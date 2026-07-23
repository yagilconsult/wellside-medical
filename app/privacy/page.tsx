import { LegalPageLayout, LegalSection } from "@/components/LegalPageLayout";

export const metadata = {
  title: "Privacy Policy | WellSide Behavioral Health",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="July 22, 2026">
      <p className="text-sm text-muted-foreground leading-relaxed">
        This Privacy Policy describes how WellSide Behavioral Health
        (&quot;WellSide,&quot; &quot;we,&quot; &quot;us&quot;) collects, uses,
        and protects your information when you use our website and
        telehealth platform.
      </p>

      <LegalSection title="1. Information we collect">
        <p>
          We collect information you provide directly, such as your name,
          date of birth, contact details, insurance information, and health
          information you share during intake or appointments. We also
          collect limited technical information, such as device and browser
          type, to keep the platform secure and functioning correctly.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use your information">
        <p>
          We use your information to schedule and deliver care, verify
          insurance coverage, process payments, communicate with you about
          your account and appointments, and meet our legal and regulatory
          obligations as a healthcare provider.
        </p>
      </LegalSection>

      <LegalSection title="3. How we protect your information">
        <p>
          We use industry-standard administrative, technical, and physical
          safeguards designed to protect your information, consistent with
          our obligations under HIPAA. See our{" "}
          <a href="/hipaa" className="text-primary underline">
            HIPAA Notice of Privacy Practices
          </a>{" "}
          for details on how your protected health information is used and
          disclosed.
        </p>
      </LegalSection>

      <LegalSection title="4. Sharing of information">
        <p>
          We do not sell your personal or health information. We may share
          information with insurance providers to process claims, with
          service providers who help us operate the platform under
          confidentiality obligations, or when required by law.
        </p>
      </LegalSection>

      <LegalSection title="5. Your choices">
        <p>
          You can review and update your information at any time through your
          patient portal, or by contacting us directly. You may also request
          a copy of your records or ask us to restrict certain uses of your
          information, subject to applicable law.
        </p>
      </LegalSection>

      <LegalSection title="6. Contact us">
        <p>
          Questions about this policy can be directed to{" "}
          <a
            href="mailto:bookings@wellsidebehavioralhealth.com"
            className="text-primary underline"
          >
            bookings@wellsidebehavioralhealth.com
          </a>
          .
        </p>
      </LegalSection>

      <p className="text-xs text-muted-foreground/70 pt-4 border-t border-border">
        This page is placeholder content for a product prototype. Before
        launch, this policy should be reviewed and finalized by qualified
        legal counsel to ensure compliance with applicable state and federal
        law.
      </p>
    </LegalPageLayout>
  );
}
