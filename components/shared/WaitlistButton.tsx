'use client';

import { Button } from '@/components/ui/button';
import { type ButtonProps } from '@/components/ui/button';

interface WaitlistButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: ButtonProps['size'];
}

export default function WaitlistButton({ href, children, className, size = 'lg' }: WaitlistButtonProps) {
  const handleClick = async () => {
    // Track the click
    try {
      await fetch('/api/track-cta-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cta_type: 'waitlist_button',
        }),
      });
    } catch (error) {
      // Silently fail - don't block the user from clicking
      console.error('Failed to track CTA click:', error);
    }
    
    // Open the link (will happen naturally via the anchor tag)
  };

  return (
    <Button
      size={size}
      className={className}
      asChild
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        {children}
      </a>
    </Button>
  );
}

