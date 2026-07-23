import { LegalPageLayout, LegalSection } from "@/components/LegalPageLayout";

export const metadata = {
  title: "Terms of Service | WellSide Behavioral Health",
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="July 22, 2026">
      <p className="text-sm text-muted-foreground leading-relaxed">
        These Terms of Service (&quot;Terms&quot;) govern your use of the
        WellSide Behavioral Health website and telehealth platform. By
        booking an appointment or creating an account, you agree to these
        Terms.
      </p>

      <LegalSection title="1. Telehealth services">
        <p>
          WellSide Behavioral Health provides behavioral health services via
          secure video visits. Telehealth has both benefits and limitations
          compared to in-person care; your provider will discuss whether
          telehealth is appropriate for your needs during your first visit.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>
          Our services are intended for patients located in states where our
          provider is licensed to practice. You are responsible for
          confirming you are physically located in an eligible state at the
          time of your appointment.
        </p>
      </LegalSection>

      <LegalSection title="3. Appointments, cancellations, and fees">
        <p>
          Appointments may be rescheduled or canceled through your patient
          portal. Late cancellations or missed appointments may be subject to
          a fee, as described at the time of booking. Estimated costs shown
          before booking are estimates only and final costs may vary based on
          your insurance coverage.
        </p>
      </LegalSection>

      <LegalSection title="4. Emergency situations">
        <p>
          This platform is not intended for medical emergencies. If you are
          experiencing a mental health crisis or emergency, call 911 or go to
          your nearest emergency room. You can also reach the 988 Suicide
          &amp; Crisis Lifeline by calling or texting 988.
        </p>
      </LegalSection>

      <LegalSection title="5. Patient responsibilities">
        <p>
          You agree to provide accurate information during intake and
          appointments, to keep your account credentials secure, and to use
          the platform only for its intended purpose.
        </p>
      </LegalSection>

      <LegalSection title="6. Limitation of liability">
        <p>
          To the fullest extent permitted by law, WellSide Behavioral Health
          is not liable for indirect, incidental, or consequential damages
          arising from your use of the platform, except where such
          limitation is not permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="7. Changes to these terms">
        <p>
          We may update these Terms from time to time. Continued use of the
          platform after changes are posted constitutes acceptance of the
          revised Terms.
        </p>
      </LegalSection>

      <p className="text-xs text-muted-foreground/70 pt-4 border-t border-border">
        This page is placeholder content for a product prototype. Before
        launch, these terms should be reviewed and finalized by qualified
        legal counsel to ensure compliance with applicable state and federal
        law.
      </p>
    </LegalPageLayout>
  );
}
