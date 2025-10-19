import { Card, CardContent } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <Card>
        <CardContent className="pt-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using Safesus, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Description of Service</h2>
            <p className="text-muted-foreground">
              Safesus provides safety information and travel guidance for various cities. The service includes safety zone maps, scam alerts, local tips, and real-time location-based warnings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">User Responsibilities</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>When using Safesus, you agree to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide accurate information</li>
                <li>Use the service lawfully and respectfully</li>
                <li>Not submit false, misleading, or offensive content</li>
                <li>Not attempt to compromise the security of the service</li>
                <li>Not use automated tools to access or scrape content</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Content and Information</h2>
            <p className="text-muted-foreground mb-3">
              <strong className="text-foreground">Disclaimer:</strong> The safety information provided on Safesus is for general guidance only. While we strive for accuracy, we cannot guarantee that all information is complete, current, or error-free. 
            </p>
            <p className="text-muted-foreground">
              You should always exercise your own judgment and take appropriate precautions when traveling. Safesus is not liable for any loss, injury, or damage resulting from your reliance on this information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">User-Generated Content</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                When you submit tips or other content to Safesus, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content within the service.
              </p>
              <p>
                You retain ownership of your content, but represent that:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>You have the right to submit the content</li>
                <li>The content does not violate any laws or third-party rights</li>
                <li>The content is factual to the best of your knowledge</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Moderation and Content Removal</h2>
            <p className="text-muted-foreground">
              We reserve the right to review, moderate, edit, or remove any user-submitted content at our discretion, including content that violates these terms or our community guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Safesus is provided "as is" without warranties of any kind. We shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the service, including but not limited to personal injury, property damage, or financial loss.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless Safesus and its affiliates from any claims, damages, or expenses arising from your use of the service or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Account Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate your account if you violate these terms or engage in abusive behavior. You may also delete your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may modify these terms at any time. Continued use of Safesus after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Governing Law</h2>
            <p className="text-muted-foreground">
              These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@safesus.com" className="text-primary hover:underline">
                legal@safesus.com
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

