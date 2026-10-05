import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Dr. Noorul Hidaya" },
      {
        name: "description",
        content:
          "The terms governing use of Dr. Noorul Hidaya's website, including the nature of the information published and the limits of what this site can offer.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: TermsConditions,
});

const LAST_UPDATED = "4 October 2026";

function TermsConditions() {
  return (
    <div className="min-h-screen gradient-soft">
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Legal</p>
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">Terms &amp; Conditions</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-10 text-[15px] text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance</h2>
            <p>
              By using this website you agree to these terms. If you do not agree with them, please do
              not use the appointment request form.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              2. What this website is, and is not
            </h2>
            <p>
              This website is an information and appointment-request site published by Dr. Noorul
              Hidaya. It is <span className="text-foreground">not a healthcare facility</span>. It
              does not provide medical advice, diagnosis, treatment, teleconsultation, prescriptions,
              referrals or second opinions, and no clinician-patient relationship is created by using
              it.
            </p>
            <p className="mt-3">
              No clinical decision should be based on anything published here. Everything on this site
              is general information. Your management is decided only after a consultation at a
              DHA-licensed healthcare facility, where your history is examined directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Urgent and emergency care</h2>
            <p>
              This site is not monitored for urgent or emergency requests and must not be used for
              them. If you have urgent symptoms, contact a DHA-licensed healthcare facility or call the
              Dubai ambulance service on{" "}
              <span className="text-foreground font-medium">998</span> immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              4. Professional status and verification
            </h2>
            <p>
              Dr. Noorul Hidaya is registered with the Dubai Health Authority as a Physician under the
              title <span className="text-foreground">Specialist Ophthalmology</span>, DHA Unique ID
              81268607. A DHA professional registration is not in itself a permit to practise; it is
              activated into a licence by a licensed health facility before clinical practice
              commences. Clinical care is provided at a DHA-licensed healthcare facility in Dubai.
            </p>
            <p className="mt-3">
              Information published here is not a means of verifying registration status. Please verify
              directly with the Dubai Health Authority using the registration details you are given.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              5. No guarantees about results or appointments
            </h2>
            <p>
              Nothing on this website is a promise, guarantee or indication of any particular clinical
              result, visual outcome, recovery time, complication rate or duration of a procedure.
              Every patient's condition, anatomy and management differ, and outcomes vary. Any figures
              quoted relate to the author's personal clinical logbook and are not a prediction of what
              any individual patient will experience.
            </p>
            <p className="mt-3">
              An appointment requested through this site is a request only. It is not confirmed until
              you receive a confirmation directly from the practice. Availability, timing and the
              location of any consultation are set by the DHA-licensed facility and may change.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              6. What you should not send through the form
            </h2>
            <p>
              Do not submit detailed clinical history, test results, imaging, medication lists or any
              other sensitive health information through the appointment form. The form is not a
              secure clinical channel and is not reviewed by a clinician before it is answered. Bring
              your records to your consultation instead. See also the{" "}
              <Link
                to="/privacy"
                className="text-primary underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              7. Articles and other published content
            </h2>
            <p>
              Articles published on this site are general educational information. They are not
              personalised advice, they do not take account of your situation, and they must not be
              relied on as a basis for self-diagnosis or self-treatment. Reading an article is not a
              substitute for consultation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Third-party names</h2>
            <p>
              Aravind Eye Care System, Vasan Eye Care Hospital, Dr J A Batcha Polyclinic, Madurai
              Medical College and other institutions are named on this site only as places of prior
              training or work. Their names, brands and logos are not used with their permission to
              imply endorsement, sponsorship, affiliation or partnership, and their inclusion should
              not be read as a recommendation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Intellectual property</h2>
            <p>
              The text, layout, design and code of this site are owned by or licensed to the publisher
              and may not be reproduced commercially without written permission. Quotations for the
              purpose of comment or review, with clear attribution, are permitted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Availability and links</h2>
            <p>
              This site is provided on an "as is" and "as available" basis. It may be unavailable,
              incomplete or out of date at any time, and no warranty is given that it will be
              uninterrupted or error-free. Third-party links are provided for convenience; the
              publisher does not control and is not responsible for their content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              11. Limitation of liability
            </h2>
            <p>
              To the fullest extent permitted by law, the publisher accepts no liability for any loss
              or damage arising from use of this site or reliance on its content, and for any decision
              taken or not taken as a result of it. Nothing in these terms excludes or limits
              liability that cannot lawfully be excluded.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Governing law</h2>
            <p>
              These terms are governed by the laws of the Emirate of Dubai and the applicable
              regulations of the Dubai Health Authority. Any dispute is subject to the jurisdiction of
              the Dubai courts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">13. Changes</h2>
            <p>
              These terms may be updated. The revision date at the top of this page always reflects the
              current version. Continued use of the site after a change means the updated terms are
              accepted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">14. Contact</h2>
            <p>
              Questions about these terms can be sent to{" "}
              <a
                href="mailto:drhidaya87@gmail.com"
                className="text-primary underline underline-offset-2 hover:text-foreground transition-colors"
              >
                drhidaya87@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="pt-4 border-t border-border/50">
            <Link
              to="/privacy"
              className="text-primary underline underline-offset-2 hover:text-foreground transition-colors text-sm"
            >
              Read the Privacy Policy
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
