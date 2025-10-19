import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, MessageCircle, AlertTriangle } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Join the Safesus Community</h1>
        <p className="text-xl text-muted-foreground">
          Help fellow travelers stay safe by sharing your experiences.
        </p>
      </div>

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

