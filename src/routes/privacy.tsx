import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Dr. Noorul Hidaya" },
      {
        name: "description",
        content:
          "How Dr. Noorul Hidaya's website collects, uses and protects personal data submitted through the appointment request form.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: PrivacyPolicy,
});

const LAST_UPDATED = "4 October 2026";

function PrivacyPolicy() {
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
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-10 text-[15px] text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Who this website belongs to</h2>
            <p>
              This website is published by Dr. Noorul Hidaya, a physician registered with the Dubai
              Health Authority (DHA) under the title{" "}
              <span className="text-foreground">Specialist Ophthalmology</span>, DHA Unique ID
              81268607. The contact address for all data protection matters is{" "}
              <a
                href="mailto:drhidaya87@gmail.com"
                className="text-primary underline underline-offset-2 hover:text-foreground transition-colors"
              >
                drhidaya87@gmail.com
              </a>
              .
            </p>
            <p className="mt-3">
              This website is <span className="text-foreground">not a healthcare facility</span>. It
              publishes general information and accepts appointment requests. Clinical care is
              delivered at a DHA-licensed healthcare facility in Dubai, UAE. Questions about your
              clinical record should be directed to that facility, not to this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. What this website collects</h2>
            <p>The appointment request form collects only the following fields:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Your full name</li>
              <li>Your telephone number</li>
              <li>Your email address</li>
              <li>Your preferred appointment date and time</li>
              <li>The service you select from the list</li>
              <li>
                Any free-text message you choose to write. The form asks you not to include detailed
                medical information here.
              </li>
            </ul>
            <p className="mt-3">
              The website does not require you to create an account, and it does not ask for
              nationality, date of birth, Emirates ID, medical record number, payment card details or
              insurance information. Please do not submit any of those through this form.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Why your data is used</h2>
            <p>
              Details submitted through the form are used for a single purpose: to reply to your
              enquiry and to arrange and confirm your appointment. They are not used for marketing,
              not sold, and not shared for advertising.
            </p>
            <p className="mt-3">
              Submitting the form is voluntary. If you would rather arrange an appointment by telephone
              or email instead, please do so and nothing will be recorded through this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Where your data is stored</h2>
            <p>
              Form submissions are transmitted to a Google Apps Script endpoint operated by the
              practice, where they are held in a secured Google account. The website is hosted on
              Vercel. Typefaces are loaded from Google Fonts.
            </p>
            <p className="mt-3">
              Your details are therefore processed on infrastructure operated by Google and Vercel.
              Neither provider determines the purposes for which your data is used.
            </p>
            <p className="mt-3">
              Appointment submissions are <span className="text-foreground">not</span> stored in your
              browser's local storage, and are not retained on your own device by this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. How long your data is kept</h2>
            <p>
              Enquiry details are kept only for as long as is necessary to arrange and confirm your
              appointment and to handle any resulting administrative query. They are then deleted or
              anonymised. Records that form part of your clinical care are a matter for the
              DHA-licensed facility that treats you, and are subject to that facility's own retention
              policy and applicable medical record retention requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies and analytics</h2>
            <p>
              This website does not set advertising cookies and does not run behavioural advertising
              or cross-site tracking pixels. No analytics or advertising profile of you is created by
              this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Your rights</h2>
            <p>
              You may ask at any time for a copy of the personal data this website holds about you,
              ask for it to be corrected, or ask for it to be deleted. You may also withdraw your
              consent, which stops the website from using your details for any further purpose.
            </p>
            <p className="mt-3">
              To exercise any of these rights, email{" "}
              <a
                href="mailto:drhidaya87@gmail.com"
                className="text-primary underline underline-offset-2 hover:text-foreground transition-colors"
              >
                drhidaya87@gmail.com
              </a>{" "}
              with the subject line "Data request". Requests are acknowledged and handled within a
              reasonable period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Security</h2>
            <p>
              Reasonable technical and organisational measures are applied to protect submitted
              details, including HTTPS transport encryption and restricting access to the practice
              account that receives submissions. No method of transmission or storage is completely
              secure, so please do not send information you consider highly sensitive through this
              form.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Applicable law</h2>
            <p>
              This policy is read with UAE Federal Decree-Law No. 45 of 2021 on Personal Data
              Protection and the applicable health-sector requirements of the Dubai Health Authority
              and the Dubai Healthcare City Authority. Nothing in this policy reduces any right you
              have under that law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to this policy</h2>
            <p>
              This policy may be updated. The revision date at the top of this page always reflects
              the current version.
            </p>
          </section>

          <section className="pt-4 border-t border-border/50">
            <Link
              to="/terms"
              className="text-primary underline underline-offset-2 hover:text-foreground transition-colors text-sm"
            >
              Read the Terms &amp; Conditions
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
