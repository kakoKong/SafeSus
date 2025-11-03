'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Flag } from 'lucide-react';
import type { ReportTargetType } from '@/types';

interface ReportButtonProps {
  targetType: ReportTargetType;
  targetId: number;
  compact?: boolean;
  variant?: 'default' | 'subtle';
}

export default function ReportButton({ targetType, targetId, compact = false, variant = 'default' }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'You must be signed in to report content.',
        variant: 'destructive',
      });
      return;
    }

    if (!reason) {
      toast({
        title: 'Reason required',
        description: 'Please select a reason for reporting.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('content_flags')
        .insert({
          reporter_id: user.id,
          target_type: targetType,
          target_id: targetId,
          reason,
          details: details || null,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: 'Report submitted',
        description: 'Thank you for helping us maintain quality. Our team will review this report.',
      });

      setOpen(false);
      setReason('');
      setDetails('');
    } catch (error: any) {
      toast({
        title: 'Error submitting report',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  // Different button styles based on variant
  const buttonContent = variant === 'subtle' ? (
    <>
      <Flag className="h-3.5 w-3.5 mr-1.5" />
      <span className="text-xs">Wrong info? Report</span>
    </>
  ) : compact ? (
    <>
      <Flag className="h-4 w-4 mr-1.5" />
      <span>Report Issue</span>
    </>
  ) : (
    <>
      <Flag className="h-4 w-4 mr-2" />
      Report Issue
    </>
  );

  return (
    <>
      <Button
        variant={variant === 'subtle' ? 'ghost' : compact ? 'ghost' : 'outline'}
        size={variant === 'subtle' ? 'sm' : compact ? 'sm' : 'default'}
        onClick={() => setOpen(true)}
        className={variant === 'subtle' ? 'text-muted-foreground hover:text-destructive h-auto py-1' : ''}
      >
        {buttonContent}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Content</DialogTitle>
            <DialogDescription>
              Help us maintain quality by reporting inappropriate or false information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Reason <span className="text-destructive">*</span>
              </label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false_info">False or misleading information</SelectItem>
                  <SelectItem value="spam">Spam or promotion</SelectItem>
                  <SelectItem value="offensive">Offensive content</SelectItem>
                  <SelectItem value="outdated">Outdated information</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Additional details (optional)
              </label>
              <Textarea
                placeholder="Provide more context about why you're reporting this..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

