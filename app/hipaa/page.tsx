import { LegalPageLayout, LegalSection } from "@/components/LegalPageLayout";

export const metadata = {
  title: "HIPAA Notice | WellSide Behavioral Health",
};

export default function HipaaNoticePage() {
  return (
    <LegalPageLayout
      title="HIPAA Notice of Privacy Practices"
      lastUpdated="July 22, 2026"
    >
      <p className="text-sm text-muted-foreground leading-relaxed">
        This notice describes how medical information about you may be used
        and disclosed, and how you can get access to this information.
        Please review it carefully.
      </p>

      <LegalSection title="Our commitment to your privacy">
        <p>
          WellSide Behavioral Health is required by law to maintain the
          privacy of your protected health information (PHI), to provide you
          with this notice of our legal duties and privacy practices, and to
          follow the terms of this notice.
        </p>
      </LegalSection>

      <LegalSection title="How we may use and disclose your information">
        <p>We may use and disclose your PHI for purposes including:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong>Treatment</strong> — sharing information with your
            provider to deliver and coordinate your care.
          </li>
          <li>
            <strong>Payment</strong> — sharing information with your
            insurance provider to verify coverage and process claims.
          </li>
          <li>
            <strong>Healthcare operations</strong> — using information for
            quality assessment, staff training, and administrative
            activities.
          </li>
        </ul>
        <p>
          Other uses and disclosures not described in this notice will be
          made only with your written authorization, which you may revoke at
          any time.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>The right to request restrictions on certain uses and disclosures of your PHI.</li>
          <li>The right to request confidential communications.</li>
          <li>The right to inspect and obtain a copy of your PHI.</li>
          <li>The right to request an amendment to your PHI.</li>
          <li>The right to receive an accounting of certain disclosures.</li>
          <li>The right to receive a paper copy of this notice, even if you agreed to receive it electronically.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Complaints">
        <p>
          If you believe your privacy rights have been violated, you may file
          a complaint with us or with the U.S. Department of Health and Human
          Services Office for Civil Rights. We will not retaliate against you
          for filing a complaint.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this notice">
        <p>
          We reserve the right to change this notice and to make the revised
          notice effective for PHI we already have as well as any
          information we receive in the future.
        </p>
      </LegalSection>

      <LegalSection title="Contact information">
        <p>
          If you have questions about this notice, please contact us at{" "}
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
        This page is placeholder content for a product prototype. A HIPAA
        Notice of Privacy Practices is a legally significant document —
        before launch, this notice must be reviewed and finalized by
        qualified legal/compliance counsel to ensure it accurately reflects
        your actual practices and meets all federal and state requirements.
      </p>
    </LegalPageLayout>
  );
}
