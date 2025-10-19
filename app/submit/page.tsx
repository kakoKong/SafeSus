'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import LoginModal from '@/components/shared/LoginModal';
import { CheckCircle } from 'lucide-react';
import { trackEvent, Events } from '@/lib/analytics';

export default function SubmitTipPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    summary: '',
    details: '',
  });

  useState(() => {
    checkAuth();
  });

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
    if (!user) {
      setShowLoginModal(true);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!formData.category || !formData.title || !formData.summary) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/submit-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        trackEvent(Events.SUBMIT_TIP, { category: formData.category });
      } else {
        const data = await res.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to submit tip',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit tip. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container px-4 py-12 max-w-2xl mx-auto text-center">
        <div className="bg-primary/10 rounded-full p-6 inline-block mb-6">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your tip has been submitted and will be reviewed by our team before publication.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/cities')}>Browse Cities</Button>
          <Button variant="outline" onClick={() => {
            setSubmitted(false);
            setFormData({ category: '', title: '', summary: '', details: '' });
          }}>
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container px-4 py-12 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Submit a Tip</h1>
          <p className="text-muted-foreground">
            Help other travelers by sharing your safety experiences. All submissions are reviewed before publication.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
            <CardDescription>
              Your contribution helps build a safer travel community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Category <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stay">Safe/Avoid Area</SelectItem>
                    <SelectItem value="scam">Scam Pattern</SelectItem>
                    <SelectItem value="do_dont">Do or Don't</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Headline <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Brief, clear title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Summary <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="One or two sentences describing the tip"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Details (optional)
                </label>
                <Textarea
                  placeholder="Additional context, what to do, or advice"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={5}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Submitting...' : 'Submit Tip'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Community Guidelines</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be specific and factual</li>
              <li>• Avoid naming individuals or businesses unless reporting scams</li>
              <li>• No profanity or offensive language</li>
              <li>• Tips are moderated before publication</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onSuccess={() => {
          setIsAuthenticated(true);
          setShowLoginModal(false);
        }}
      />
    </>
  );
}

