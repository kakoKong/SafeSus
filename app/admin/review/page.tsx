'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import type { TipSubmission } from '@/types';

export default function AdminReviewPage() {
  const [submissions, setSubmissions] = useState<TipSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    const { data, error } = await supabase
      .from('tip_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch submissions:', error);
    } else {
      setSubmissions(data || []);
    }
    setLoading(false);
  }

  async function handleApprove(id: number) {
    const { error } = await supabase
      .from('tip_submissions')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve submission',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Submission approved' });
      setSubmissions(submissions.filter((s) => s.id !== id));
    }
  }

  async function handleReject(id: number) {
    const { error } = await supabase
      .from('tip_submissions')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject submission',
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Submission rejected' });
      setSubmissions(submissions.filter((s) => s.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-12 max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Review Submissions</h1>
        <p className="text-muted-foreground">
          Review and moderate community tip submissions.
        </p>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No pending submissions.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{submission.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle>{submission.title}</CardTitle>
                    <CardDescription className="mt-2">{submission.summary}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              {submission.details && (
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{submission.details}</p>
                </CardContent>
              )}
              <CardContent className="pt-0">
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApprove(submission.id)}
                    variant="default"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(submission.id)}
                    variant="outline"
                    size="sm"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

