'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle, MapPin, MessageCircle } from 'lucide-react';
import type { TipSubmission, UserProfile } from '@/types';

export default function GuardianDashboard() {
  const supabase = createClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [submissions, setSubmissions] = useState<TipSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<TipSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkGuardianStatus();
  }, []);

  async function checkGuardianStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to access this page.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Check if user is a guardian
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile || profile.role !== 'guardian') {
      toast({
        title: 'Access denied',
        description: 'This page is only accessible to guardians.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    setUserProfile(profile);
    await loadPendingSubmissions();
  }

  async function loadPendingSubmissions() {
    const { data, error } = await supabase
      .from('tip_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: 'Error loading submissions',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setSubmissions(data || []);
    }
    
    setLoading(false);
  }

  async function handleReview(submissionId: number, status: 'approved' | 'rejected') {
    setProcessing(true);

    try {
      // Update submission status
      const { error: updateError } = await supabase
        .from('tip_submissions')
        .update({ status, reviewed_by: userProfile?.user_id || null })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      // If approved, update user score
      if (status === 'approved') {
        const submission = submissions.find(s => s.id === submissionId);
        if (submission?.user_id) {
          const { data: submitterProfile } = await supabase
            .from('user_profiles')
            .select('score')
            .eq('user_id', submission.user_id)
            .single();

          if (submitterProfile) {
            await supabase
              .from('user_profiles')
              .update({ score: submitterProfile.score + 10 })
              .eq('user_id', submission.user_id);
          }
        }
      }

      toast({
        title: status === 'approved' ? 'Submission approved' : 'Submission rejected',
        description: `The submission has been ${status}.`,
      });

      // Reload submissions
      await loadPendingSubmissions();
      setSelectedSubmission(null);
      setReviewNotes('');
    } catch (error: any) {
      toast({
        title: 'Error processing review',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-12 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Clock className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!userProfile || userProfile.role !== 'guardian') {
    return (
      <div className="container px-4 py-12 max-w-4xl mx-auto text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
        <p className="text-muted-foreground">
          This page is only accessible to guardian members.
        </p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">Guardian Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Review and verify community submissions to maintain quality and trust.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold">{submissions.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Score</p>
                <p className="text-3xl font-bold">{userProfile.score}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="text-xl font-bold capitalize">{userProfile.role}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: List of pending submissions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Pending Submissions</CardTitle>
              <CardDescription>
                Click on a submission to review it
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p className="text-muted-foreground">All caught up! No pending submissions.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {submissions.map((submission) => (
                    <button
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedSubmission?.id === submission.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-800 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {submission.category === 'scam' && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                          {submission.category === 'do_dont' && <MessageCircle className="h-5 w-5 text-blue-500" />}
                          {submission.category === 'stay' && <MapPin className="h-5 w-5 text-green-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{submission.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{submission.summary}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {submission.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(submission.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Selected submission details */}
        <div>
          {selectedSubmission ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Review Submission</CardTitle>
                    <CardDescription>
                      Submitted {new Date(selectedSubmission.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge>
                    {selectedSubmission.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Title</h4>
                  <p>{selectedSubmission.title}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Summary</h4>
                  <p className="text-muted-foreground">{selectedSubmission.summary}</p>
                </div>

                {selectedSubmission.details && (
                  <div>
                    <h4 className="font-semibold mb-2">Details</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedSubmission.details}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Review Notes (optional)
                  </label>
                  <Textarea
                    placeholder="Add notes about your decision..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleReview(selectedSubmission.id, 'approved')}
                    disabled={processing}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReview(selectedSubmission.id, 'rejected')}
                    disabled={processing}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select a submission from the list to review
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Guidelines */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Guardian Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-green-600">✓ Approve if:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Information is specific and actionable</li>
                <li>• Language is respectful and constructive</li>
                <li>• Content appears factual and helpful</li>
                <li>• No commercial promotion or spam</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-red-600">✗ Reject if:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Content is vague or unhelpful</li>
                <li>• Contains offensive language or personal attacks</li>
                <li>• Appears to be false or exaggerated</li>
                <li>• Promotes businesses or spam</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

