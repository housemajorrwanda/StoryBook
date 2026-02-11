import PageLayout from "@/layout/PageLayout";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - HouseMajor iHame",
  description: "Privacy Policy for the HouseMajor iHame platform",
};

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Last updated: February 11, 2026
        </p>

        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              1. Introduction
            </h2>
            <p>
              HouseMajor (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;)
              operates the iHame platform (&quot;Platform&quot;), a digital
              archive dedicated to preserving testimonies and historical
              records related to the 1994 Genocide against the Tutsi in Rwanda.
              This Privacy Policy explains how we collect, use, store, and
              protect your personal information when you use our Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              2. Information We Collect
            </h2>

            <h3 className="text-sm font-semibold text-gray-900 mt-4 mb-2">
              2.1 Information You Provide
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account Information:</strong> Full name, email address,
                and password when you create an account.
              </li>
              <li>
                <strong>Profile Information:</strong> Place of residence and
                other optional profile details.
              </li>
              <li>
                <strong>Testimony Content:</strong> Personal stories,
                testimonies, photographs, and related materials you choose to
                submit.
              </li>
              <li>
                <strong>Communication Data:</strong> Messages and
                correspondence you send to us.
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-gray-900 mt-4 mb-2">
              2.2 Information Collected Automatically
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Usage Data:</strong> Pages visited, features used, time
                spent on the Platform, and interaction patterns.
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating
                system, and device identifiers.
              </li>
              <li>
                <strong>Log Data:</strong> IP address, access times, and
                referring URLs.
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-gray-900 mt-4 mb-2">
              2.3 Third-Party Authentication
            </h3>
            <p>
              If you sign in using Google, we receive your name, email address,
              and profile picture from Google. We do not receive or store your
              Google password.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                To create and manage your account.
              </li>
              <li>
                To publish and preserve testimonies in the digital archive.
              </li>
              <li>
                To communicate with you about your account, submissions, and
                Platform updates.
              </li>
              <li>
                To improve the Platform, its features, and user experience.
              </li>
              <li>
                To ensure the security and integrity of the Platform.
              </li>
              <li>
                To comply with legal obligations.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. How We Share Your Information
            </h2>
            <p className="mb-3">
              We do not sell your personal information. We may share your
              information only in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Published Testimonies:</strong> Testimonies you submit
                may be made publicly available on the Platform as part of the
                archive, based on the visibility settings you choose during
                submission.
              </li>
              <li>
                <strong>Service Providers:</strong> We may share data with
                trusted third-party services that help us operate the Platform
                (e.g., hosting, analytics), bound by confidentiality
                obligations.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose
                information if required by law, regulation, or legal process.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              5. Data Storage & Security
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Your data is stored on secure servers with encryption in
                transit and at rest.
              </li>
              <li>
                Authentication tokens are stored securely using HTTP-only
                cookies and local storage with expiration policies.
              </li>
              <li>
                We implement industry-standard security measures to protect
                against unauthorized access, alteration, or destruction of
                data.
              </li>
              <li>
                While we strive to protect your information, no method of
                electronic storage or transmission is 100% secure.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              6. Your Rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Access</strong> the personal information we hold about
                you.
              </li>
              <li>
                <strong>Correct</strong> inaccurate or incomplete information.
              </li>
              <li>
                <strong>Delete</strong> your account and personal data, subject
                to our archival obligations.
              </li>
              <li>
                <strong>Withdraw Consent</strong> for data processing at any
                time.
              </li>
              <li>
                <strong>Export</strong> your data in a portable format.
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:support@housemajor.rw"
                className="text-gray-900 font-semibold underline"
              >
                support@housemajor.rw
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. Testimony Data & Archival Purpose
            </h2>
            <p>
              Given the historical and archival nature of this Platform,
              published testimonies may be retained even after account
              deletion, unless you specifically request their removal. This
              ensures the preservation of historical records for future
              generations. We will always respect your wishes regarding the
              handling of sensitive personal stories.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              8. Cookies & Local Storage
            </h2>
            <p>
              We use cookies and local storage to maintain your authentication
              session and remember your preferences. These are essential for
              the Platform to function properly. We do not use third-party
              advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              9. Children&apos;s Privacy
            </h2>
            <p>
              The Platform is not intended for children under 16. We do not
              knowingly collect personal information from children under 16. If
              we become aware that we have collected data from a child under
              16, we will take steps to delete that information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. When we make
              changes, we will update the &quot;Last updated&quot; date at the
              top of this page and notify you through the Platform if the
              changes are significant. Continued use of the Platform after
              changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              11. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy
              or how we handle your data, please contact us at{" "}
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

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            This Privacy Policy should be read together with our{" "}
            <Link
              href="/terms"
              className="text-gray-600 underline"
            >
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
