'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import LoginModal from '@/components/shared/LoginModal';
import { CheckCircle, MapPin, AlertTriangle, MessageCircle, Map } from 'lucide-react';
import { trackEvent, Events } from '@/lib/analytics';
import InteractiveMapDrawer from '@/components/map/InteractiveMapDrawer';

type SubmissionType = 'tip' | 'scam' | 'zone';

export default function SubmitTipPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissionType, setSubmissionType] = useState<SubmissionType>('tip');
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestName, setGuestName] = useState('');

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    summary: '',
    details: '',
  });

  // Geographic data
  const [pinLocation, setPinLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [zoneCoordinates, setZoneCoordinates] = useState<number[][] | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
    // Don't show login modal automatically - allow guest mode
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    
    // For pin submissions (scam), allow guest mode
    if (submissionType === 'scam' && !user) {
      if (!guestName || guestName.trim().length === 0) {
        toast({
          title: 'Name required',
          description: 'Please enter your name to submit as a guest.',
          variant: 'destructive',
        });
        return;
      }
      setIsGuestMode(true);
    } else if (!user) {
      // For tips and zones, require login
      setShowLoginModal(true);
      return;
    } else {
      setIsGuestMode(false);
    }

    // Validation
    if (!formData.category || !formData.title || !formData.summary) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    // Validate geographic data for scam and zone submissions
    if (submissionType === 'scam' && !pinLocation) {
      toast({
        title: 'Location required',
        description: 'Please pin the location on the map where the incident occurred.',
        variant: 'destructive',
      });
      return;
    }

    if (submissionType === 'zone' && (!zoneCoordinates || zoneCoordinates.length < 3)) {
      toast({
        title: 'Zone required',
        description: 'Please draw a zone on the map.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      let endpoint = '/api/submit-tip';
      let payload: any = { ...formData };

      if (submissionType === 'scam') {
        endpoint = '/api/submit-pin';
        payload = {
          type: formData.category,
          title: formData.title,
          summary: formData.summary,
          details: formData.details,
          location: {
            type: 'Point',
            coordinates: [pinLocation!.lng, pinLocation!.lat]
          },
          ...(!user && { guest_name: guestName.trim() })
        };
      } else if (submissionType === 'zone') {
        endpoint = '/api/submit-zone';
        payload = {
          label: formData.title,
          level: formData.category,
          reason_short: formData.summary,
          reason_long: formData.details,
          geom: {
            type: 'Polygon',
            coordinates: [zoneCoordinates!]
          }
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        trackEvent(Events.SUBMIT_TIP, { category: formData.category, type: submissionType });
      } else {
        const data = await res.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to submit',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit. Please try again.',
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
      <div className="container px-4 py-12 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contribute to Safesus</h1>
          <p className="text-muted-foreground">
            Help other travelers by sharing your safety experiences. All submissions are reviewed by guardians before publication.
          </p>
        </div>

        {/* Submission Type Selector */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => {
              setSubmissionType('tip');
              setIsGuestMode(false);
            }}
            className={`p-6 rounded-xl border-2 transition-all ${
              submissionType === 'tip'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 dark:border-gray-800 hover:border-primary/50'
            }`}
          >
            <MessageCircle className={`h-8 w-8 mb-3 ${submissionType === 'tip' ? 'text-primary' : 'text-muted-foreground'}`} />
            <h3 className="font-semibold mb-1">Travel Tip</h3>
            <p className="text-xs text-muted-foreground">Share do's & don'ts</p>
          </button>

          <button
            onClick={() => setSubmissionType('scam')}
            className={`p-6 rounded-xl border-2 transition-all ${
              submissionType === 'scam'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 dark:border-gray-800 hover:border-primary/50'
            }`}
          >
            <AlertTriangle className={`h-8 w-8 mb-3 ${submissionType === 'scam' ? 'text-primary' : 'text-muted-foreground'}`} />
            <h3 className="font-semibold mb-1">Scam/Incident</h3>
            <p className="text-xs text-muted-foreground">Report specific location</p>
          </button>

          <button
            onClick={() => {
              setSubmissionType('zone');
              setIsGuestMode(false);
            }}
            className={`p-6 rounded-xl border-2 transition-all ${
              submissionType === 'zone'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 dark:border-gray-800 hover:border-primary/50'
            }`}
          >
            <Map className={`h-8 w-8 mb-3 ${submissionType === 'zone' ? 'text-primary' : 'text-muted-foreground'}`} />
            <h3 className="font-semibold mb-1">Safety Zone</h3>
            <p className="text-xs text-muted-foreground">Define area safety level</p>
          </button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {submissionType === 'tip' && 'Share a Travel Tip'}
              {submissionType === 'scam' && 'Report a Scam or Incident'}
              {submissionType === 'zone' && 'Define a Safety Zone'}
            </CardTitle>
            <CardDescription>
              {submissionType === 'tip' && 'Share your local knowledge and travel wisdom'}
              {submissionType === 'scam' && 'Help others avoid what happened to you'}
              {submissionType === 'zone' && 'Help map safe and unsafe neighborhoods'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {submissionType === 'tip' && (
                <>
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
                        <SelectItem value="do_dont">Do or Don't</SelectItem>
                        <SelectItem value="stay">Where to Stay/Avoid</SelectItem>
                        <SelectItem value="scam">Scam Awareness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Headline <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="e.g., Always use Grab instead of street taxis"
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
                      placeholder="Brief explanation of the tip"
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
                      placeholder="Additional context, examples, or advice"
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      rows={5}
                    />
                  </div>
                </>
              )}

              {submissionType === 'scam' && (
                <>
                  {!isAuthenticated && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Your Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="Enter your name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        You can submit as a guest without signing in
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Incident Type <span className="text-destructive">*</span>
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scam">Scam</SelectItem>
                        <SelectItem value="overcharge">Overcharge</SelectItem>
                        <SelectItem value="harassment">Harassment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      What Happened <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="e.g., Fake taxi driver scam at Grand Palace"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Brief Description <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="Quick summary of what happened"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Pin Location on Map <span className="text-destructive">*</span>
                    </label>
                    <InteractiveMapDrawer
                      mode="point"
                      onLocationSelect={setPinLocation}
                      className="mb-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Full Story <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      placeholder="Describe what happened and how others can avoid it"
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      required
                      rows={5}
                    />
                  </div>
                </>
              )}

              {submissionType === 'zone' && (
                <>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Draw a Safety Zone:</strong> Click the "Draw Zone" button on the map, then click points to create a polygon around the area. Double-click to finish.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Area Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="e.g., Sukhumvit 24-39 area"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Safety Level <span className="text-destructive">*</span>
                    </label>
                    <Select 
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select safety level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended (Safe)</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="caution">Caution (Be Alert)</SelectItem>
                        <SelectItem value="avoid">Avoid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Draw Zone on Map <span className="text-destructive">*</span>
                    </label>
                    <InteractiveMapDrawer
                      mode="rectangle"
                      onZoneDrawn={setZoneCoordinates}
                      className="mb-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Why this level? <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="e.g., Well-lit, 24/7 shops, tourist-friendly"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Additional Details (optional)
                    </label>
                    <Textarea
                      placeholder="Any specific times, warnings, or advice for this area"
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full"
                >
                  {loading ? 'Submitting...' : 'Submit for Review'}
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

