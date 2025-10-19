import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <Card>
        <CardContent className="pt-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
            <p className="text-muted-foreground">
              Safesus ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
            <div className="space-y-3 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Account Information</h3>
                <p>When you create an account, we collect your email address and authentication credentials through Supabase Auth.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Location Data</h3>
                <p>When you use Live Mode, we access your device location to show nearby safety warnings. We do not store or track your continuous location history. Location data is used only in real-time for the features you request.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Usage Data</h3>
                <p>We collect anonymous analytics data (via PostHog) to understand how our app is used and improve the experience. This includes page views, feature usage, and general interaction patterns.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Submitted Content</h3>
                <p>When you submit tips, we store the content you provide along with your user ID for moderation purposes.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>To provide and maintain our service</li>
              <li>To show you relevant safety information based on your location (Live Mode only)</li>
              <li>To save your preferences and saved cities</li>
              <li>To moderate and publish community contributions</li>
              <li>To improve our app through anonymous analytics</li>
              <li>To communicate important updates (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground mb-3">
              We do not sell your personal information. We share data only in these limited circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>With service providers (Supabase, PostHog, Sentry) necessary to operate the app</li>
              <li>If required by law or to protect rights and safety</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw consent for location access at any time</li>
              <li>Export your data</li>
              <li>Opt out of analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Safesus is not intended for children under 13. We do not knowingly collect data from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@safesus.com" className="text-primary hover:underline">
                privacy@safesus.com
              </a>
            </p>
          </section>

          <p className="text-sm text-muted-foreground pt-6">
            Last Updated: October 19, 2025
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

