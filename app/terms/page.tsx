import PageLayout from "@/layout/PageLayout";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export const metadata = {
  title: "Terms of Service - HouseMajor iHame",
  description: "Terms of Service for the HouseMajor iHame platform",
};

export default function TermsOfServicePage() {
  return (
    <PageLayout showBackgroundEffects={false}>
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Last updated: February 11, 2026
        </p>

        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the HouseMajor iHame platform
              (&quot;Platform&quot;), you agree to be bound by these Terms of
              Service (&quot;Terms&quot;). If you do not agree to these Terms,
              you may not use the Platform. The Platform is a digital archive
              and remembrance tool dedicated to preserving testimonies and
              historical records related to the 1994 Genocide against the Tutsi
              in Rwanda.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              2. Eligibility
            </h2>
            <p>
              You must be at least 16 years of age to create an account and use
              the Platform. By creating an account, you represent and warrant
              that you meet this age requirement and that all information you
              provide is accurate and truthful.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              3. Account Responsibilities
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </li>
              <li>
                You are responsible for all activities that occur under your
                account.
              </li>
              <li>
                You must notify us immediately of any unauthorized use of your
                account.
              </li>
              <li>
                We reserve the right to suspend or terminate accounts that
                violate these Terms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. User Content & Testimonies
            </h2>
            <p className="mb-3">
              The Platform allows users to submit testimonies, stories, and
              related content. By submitting content, you:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Grant us a non-exclusive, worldwide, royalty-free license to
                use, display, reproduce, and distribute your content solely for
                the purpose of operating and preserving the archive.
              </li>
              <li>
                Confirm that the content you submit is truthful and accurate to
                the best of your knowledge.
              </li>
              <li>
                Confirm that you have the right to share the testimony, whether
                it is your own or you have proper authorization from the
                individual whose story you are sharing.
              </li>
              <li>
                Understand that submitted testimonies may be reviewed by
                administrators before publication.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              5. Prohibited Conduct
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Submit false, misleading, or fabricated testimonies.
              </li>
              <li>
                Use the Platform to promote genocide denial, hate speech,
                revisionism, or divisionism.
              </li>
              <li>
                Harass, threaten, or intimidate other users, survivors, or
                witnesses.
              </li>
              <li>
                Attempt to gain unauthorized access to the Platform or other
                users&apos; accounts.
              </li>
              <li>
                Use the Platform for any commercial purpose without prior
                written consent.
              </li>
              <li>
                Upload viruses, malware, or any other harmful content.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              6. Intellectual Property
            </h2>
            <p>
              The Platform, including its design, features, and original
              content, is owned by HouseMajor and is protected by intellectual
              property laws. You may not copy, modify, distribute, or create
              derivative works from the Platform without our express written
              permission. User-submitted testimonies remain the intellectual
              property of their respective authors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. Privacy
            </h2>
            <p>
              Your use of the Platform is also governed by our{" "}
              <Link
                href="/privacy"
                className="text-gray-900 font-semibold underline"
              >
                Privacy Policy
              </Link>
              , which describes how we collect, use, and protect your personal
              information. By using the Platform, you consent to the practices
              described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              8. Content Moderation
            </h2>
            <p>
              We reserve the right to review, edit, or remove any content that
              violates these Terms or that we determine, in our sole
              discretion, to be inappropriate, harmful, or inconsistent with
              the mission of the Platform. Decisions regarding content
              moderation are final.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              9. Disclaimers
            </h2>
            <p>
              The Platform is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, express or
              implied. We do not guarantee the accuracy, completeness, or
              reliability of any user-submitted content. We are not responsible
              for any decisions made based on information found on the
              Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              10. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, HouseMajor and its team
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of the Platform,
              including but not limited to loss of data, emotional distress, or
              interruption of service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              11. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. When we make
              changes, we will update the &quot;Last updated&quot; date at the
              top of this page. Continued use of the Platform after changes
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              12. Contact
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a
                href="mailto:support@housemajor.rw"
                className="text-gray-900 font-semibold underline"
              >
                support@housemajor.rw
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
