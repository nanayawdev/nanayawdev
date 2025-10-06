import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Devs & Creatives",
  description: "Terms of Service for Devs & Creatives. Read our terms and conditions for using our digital agency services.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using Devs & Creatives services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              Devs & Creatives provides digital agency services including but not limited to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Website design and development</li>
              <li>Web applications and digital platforms</li>
              <li>Mobile app development</li>
              <li>UI/UX design services</li>
              <li>Brand identity and design systems</li>
              <li>Motion graphics and 3D visuals</li>
              <li>API integration and maintenance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Client Responsibilities</h2>
            <p className="text-muted-foreground mb-4">
              Clients are responsible for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Providing accurate and complete project requirements</li>
              <li>Timely feedback and approval of deliverables</li>
              <li>Payment according to agreed terms</li>
              <li>Providing necessary access to systems and resources</li>
              <li>Compliance with applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Payment Terms</h2>
            <p className="text-muted-foreground mb-4">
              Payment terms will be specified in individual project agreements. Generally:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Projects require a deposit before work begins</li>
              <li>Payment schedules will be agreed upon per project</li>
              <li>Late payments may incur additional charges</li>
              <li>All prices are exclusive of applicable taxes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              Upon full payment, clients will own the final deliverables. However:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Devs & Creatives retains rights to portfolio use</li>
              <li>Third-party components remain under their respective licenses</li>
              <li>Proprietary methodologies remain our intellectual property</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Project Timeline and Deliverables</h2>
            <p className="text-muted-foreground mb-4">
              Project timelines and deliverables will be defined in individual project agreements. Delays caused by client feedback or changes may extend project timelines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Revisions and Changes</h2>
            <p className="text-muted-foreground mb-4">
              Minor revisions are included in project scope. Major changes or additional features may require additional fees and timeline adjustments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Confidentiality</h2>
            <p className="text-muted-foreground mb-4">
              We maintain strict confidentiality regarding client information and projects. We will not disclose confidential information to third parties without consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              Our liability is limited to the total amount paid for the specific project. We are not liable for indirect, incidental, or consequential damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Termination</h2>
            <p className="text-muted-foreground mb-4">
              Either party may terminate a project with written notice. Payment for completed work is due upon termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These terms are governed by the laws of Nigeria. Any disputes will be resolved through Nigerian courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-muted-foreground">
                Email: legal@devsandcreatives.com<br />
                Address: Lagos, Nigeria
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
