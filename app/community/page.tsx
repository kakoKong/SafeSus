'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, MessageCircle, AlertTriangle, MapPin, CheckCircle, Clock } from 'lucide-react';
import ReportButton from '@/components/shared/ReportButton';
import type { TipSubmission } from '@/types';

export default function CommunityPage() {
  const [recentActivity, setRecentActivity] = useState<TipSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadRecentActivity();
  }, []);

  async function loadRecentActivity() {
    const { data, error } = await supabase
      .from('tip_submissions')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setRecentActivity(data);
    }
    setLoading(false);
  }
  return (
    <div className="container px-4 py-12 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Safesus Community</h1>
        <p className="text-xl text-muted-foreground">
          Help fellow travelers stay safe by sharing your experiences and verifying community contributions.
        </p>
      </div>

      {/* Recent Activity Feed */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Verified Updates</h2>
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Community Verified
          </Badge>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Clock className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : recentActivity.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No recent activity yet. Be the first to contribute!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {activity.category === 'scam' && (
                        <div className="p-3 bg-orange-500/10 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-orange-500" />
                        </div>
                      )}
                      {activity.category === 'do_dont' && (
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                          <MessageCircle className="h-6 w-6 text-blue-500" />
                        </div>
                      )}
                      {activity.category === 'stay' && (
                        <div className="p-3 bg-green-500/10 rounded-lg">
                          <MapPin className="h-6 w-6 text-green-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>
                      <p className="text-muted-foreground mb-3">{activity.summary}</p>
                      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs">
                            {activity.category.replace('_', ' ')}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Verified
                          </span>
                          <span>•</span>
                          <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                        </div>
                        <ReportButton targetType="tip" targetId={activity.id} variant="subtle" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <div className="border-t pt-12" />

      {/* How to Contribute */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How to Contribute</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Share Safe/Avoid Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Know a neighborhood that's particularly safe or one to avoid? Share your local knowledge to help others plan better.
              </p>
              <p className="text-sm font-medium">Include:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Specific area name</li>
                <li>• Why it's safe/unsafe</li>
                <li>• Time of day considerations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Report Scams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Encountered a scam? Share the pattern so others can recognize and avoid it.
              </p>
              <p className="text-sm font-medium">Include:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• What happened</li>
                <li>• Where it happened</li>
                <li>• How to avoid it</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Share Do's & Don'ts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Local customs, practical tips, or safety practices that travelers should know.
              </p>
              <p className="text-sm font-medium">Include:</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Clear action or advice</li>
                <li>• Why it matters</li>
                <li>• Context if needed</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Request Cities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Planning to visit a city that's not yet covered? Request it and we'll prioritize based on demand.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Available from any city detail page.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Policy */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Trust & Moderation</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">All submissions are reviewed</strong> by our team before going live. We verify information and check for quality, accuracy, and compliance with community guidelines.
              </p>
              <p>
                <strong className="text-foreground">We don't allow:</strong>
              </p>
              <ul className="space-y-1 ml-4">
                <li>• Personal attacks or naming individuals</li>
                <li>• Offensive language or discrimination</li>
                <li>• False information or exaggeration</li>
                <li>• Commercial promotion or spam</li>
              </ul>
              <p>
                <strong className="text-foreground">Your privacy:</strong> Submissions are anonymous by default. We never share personal information publicly.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-12">
            <h2 className="text-2xl font-bold mb-4">Ready to Contribute?</h2>
            <p className="mb-6 opacity-90">
              Your experience can help thousands of travelers stay safe.
            </p>
            <Link href="/submit">
              <Button size="lg" variant="secondary">
                Submit a Tip
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Report Abuse */}
      <section className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          See something inappropriate?{' '}
          <a href="mailto:report@safesus.com" className="text-primary hover:underline">
            Report it
          </a>
        </p>
      </section>
    </div>
  );
}

