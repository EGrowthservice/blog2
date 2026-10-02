import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Spotlight',
  description: 'Privacy Policy for Spotlight detailing how information is collected, used, and protected, including guest comments, analytics, and advertising disclosures.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
          Transparency & Data Protection
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 mt-3">
          Last Updated: October 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xs space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* Intro */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            1. Overview
          </h2>
          <p>
            Welcome to <strong>Spotlight</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the Site&rdquo;). This Privacy Policy explains what information we collect when you visit our website, read articles, leave comments, or contact us, and how that information is handled.
          </p>
          <p>
            We respect your privacy and strive to collect only what is strictly necessary to operate our digital blog, maintain site security, and provide an open platform for news and community discussions.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            2. Information We Collect
          </h2>
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base">A. Guest Comments and User Feedback</h3>
            <p>
              Visitors may submit comments and report content on articles without registering an account. When submitting a comment, you provide a display name (or nickname) and your message content. This information is saved and made publicly visible on the respective article.
            </p>

            <h3 className="font-bold text-slate-900 text-base">B. Content and Comment Reports</h3>
            <p>
              When reporting an article or comment for inappropriate content or spam, you may optionally provide a reason or note. This report is sent directly to the site administrator for moderation and is not published publicly.
            </p>

            <h3 className="font-bold text-slate-900 text-base">C. Direct Communications</h3>
            <p>
              If you email us directly or use our contact form, we receive your name, email address, and message contents so that we can respond to your inquiry.
            </p>

            <h3 className="font-bold text-slate-900 text-base">D. Standard Server Logs and Technical Information</h3>
            <p>
              Like almost all websites, our hosting servers automatically record basic technical connection data (such as IP addresses, browser types, operating systems, and page request timestamps) for network security, diagnostics, and prevention of automated spam attacks.
            </p>
          </div>
        </section>

        {/* Analytics and Third-Party Advertising */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            3. Analytics and Advertising
          </h2>
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Google Analytics</h3>
            <p>
              We may utilize Google Analytics to understand aggregate readership patterns, such as which articles are most popular and average reading duration. Google Analytics operates using cookies and collects anonymized usage statistics. You can opt out using the{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline font-medium"
              >
                Google Analytics Opt-out Browser Add-on
              </a>.
            </p>

            <h3 className="font-bold text-slate-900 text-base">Google AdSense & Third-Party Cookies</h3>
            <p>
              We may display advertisements delivered by Google AdSense or advertising partners. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this or other websites.
            </p>
            <p>
              You can customize or opt out of personalized ads by visiting{' '}
              <a
                href="https://myadcenter.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline font-medium"
              >
                Google Ad Center
              </a>{' '}
              or by using standard industry opt-out tools such as{' '}
              <a
                href="https://optout.aboutads.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline font-medium"
              >
                AboutAds WebChoices
              </a>.
            </p>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            4. How We Use the Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To publish and display reader comments alongside our editorial articles.</li>
            <li>To moderate inappropriate comments, hate speech, spam, or abusive behavior.</li>
            <li>To respond to your inquiries, suggestions, or editorial feedback.</li>
            <li>To monitor website performance, uptime, and maintain server security.</li>
          </ul>
          <p>
            We do not sell, rent, or trade your personal information to third parties.
          </p>
        </section>

        {/* Data Retention and Deletion */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            5. Data Retention & Your Rights
          </h2>
          <p>
            Comments submitted on articles remain visible as long as the article is published, unless removed by an administrator or requested by the author.
          </p>
          <p>
            If you have submitted a comment or contact inquiry and wish for it to be updated or removed, you can email us at any time at{' '}
            <a href="mailto:qbinhtkcongviec@gmail.com" className="text-indigo-600 underline font-semibold">
              qbinhtkcongviec@gmail.com
            </a>{' '}
            with the link to the comment/article, and we will promptly assist you.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4 border-t border-slate-200 pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            6. Contacting Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy or our site practices, please contact us directly:
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-1 text-xs sm:text-sm">
            <p><strong>Spotlight Editorial & Administration</strong></p>
            <p>
              Email:{' '}
              <a href="mailto:qbinhtkcongviec@gmail.com" className="text-indigo-600 underline font-semibold">
                qbinhtkcongviec@gmail.com
              </a>
            </p>
            <p className="text-slate-500">Inquiries are typically reviewed within 24 to 48 hours.</p>
          </div>
        </section>
      </div>

      <div className="text-center text-xs text-slate-400">
        <Link href="/terms" className="hover:text-slate-600 underline mr-4">Terms of Service</Link>
        <Link href="/cookie-policy" className="hover:text-slate-600 underline mr-4">Cookie Policy</Link>
        <Link href="/contact" className="hover:text-slate-600 underline">Contact Us</Link>
      </div>
    </div>
  );
}
