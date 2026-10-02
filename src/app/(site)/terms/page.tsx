import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - Spotlight',
  description: 'Terms of Service governing the use of Spotlight, reader commentary guidelines, content copyrights, and contact procedures.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
          Site Guidelines & Agreement
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 mt-3">
          Last Updated: October 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xs space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* Acceptance */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using <strong>Spotlight</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our website&rdquo;), you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue browsing our site.
          </p>
        </section>

        {/* Content & Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            2. Intellectual Property & Content Use
          </h2>
          <p>
            All original articles, editorial reviews, summaries, logos, and website design elements published on Spotlight are protected by copyright laws.
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              <strong>Personal Use:</strong> You are welcome to read, bookmark, and share links to our articles for personal, non-commercial purposes.
            </li>
            <li>
              <strong>Fair Quotation:</strong> Brief excerpts of our articles may be quoted by other writers, researchers, or news outlets provided that proper credit and a direct hyperlink to the original article on Spotlight are visibly included.
            </li>
            <li>
              <strong>Unauthorized Reproduction:</strong> Scraping, automated copying, or republishing entire articles without prior permission is prohibited.
            </li>
          </ul>
        </section>

        {/* Comments and Community Guidelines */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            3. Reader Comments & Community Guidelines
          </h2>
          <p>
            Spotlight allows readers to post comments and feedback without requiring an account. To keep discussions helpful and respectful, you agree not to post:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Defamatory, abusive, harassing, threatening, or hateful content.</li>
            <li>Unsolicited commercial advertisements, spam, affiliate links, or repetitive postings.</li>
            <li>Malicious code, phishing links, or unauthorized disclosures of personal private information.</li>
            <li>Content that infringes upon the intellectual property or privacy rights of any third party.</li>
          </ul>
          <p>
            We reserve the right to review, edit, moderate, or remove any comment at our sole discretion, as well as take action on reader reports submitted through our site.
          </p>
        </section>

        {/* Copyright and DMCA */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            4. Copyright Inquiries & Takedown Requests
          </h2>
          <p>
            We respect the intellectual property of artists, filmmakers, writers, and photographers. If you believe that any image, text, or material published on Spotlight infringes upon your copyright, please notify us immediately with the following details:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
            <li>The URL of the article or material on our site that you are requesting removal of.</li>
            <li>Proof or explanation of your ownership or authorization to represent the copyright holder.</li>
            <li>Your contact information (name and email address).</li>
          </ul>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
            <p className="font-semibold text-slate-900">Direct Copyright Contact:</p>
            <p>
              Email:{' '}
              <a href="mailto:qbinhtkcongviec@gmail.com" className="text-indigo-600 underline font-medium">
                qbinhtkcongviec@gmail.com
              </a>
            </p>
            <p className="text-slate-500 mt-1">We address valid notices and remove infringing material promptly upon receipt.</p>
          </div>
        </section>

        {/* Disclaimers */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            5. Disclaimers & Limitation of Liability
          </h2>
          <p>
            The content provided on Spotlight is for informational, cultural, and entertainment purposes only. While we aim for accuracy in reporting news, scores, and dates, content is provided on an &ldquo;as is&rdquo; basis without warranties of completeness or fitness for a particular purpose.
          </p>
          <p>
            Under no circumstances will Spotlight or its administrators be liable for any direct or indirect loss resulting from the use of, or inability to use, the information or services provided on this site.
          </p>
        </section>

        {/* External Links */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            6. External Links & Advertising
          </h2>
          <p>
            Our website may contain links to external third-party websites or advertisements served via networks like Google AdSense. We do not control or endorse the content, policies, or products offered by external sites, and we encourage you to review their terms and privacy policies.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4 border-t border-slate-200 pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            7. Contact Information
          </h2>
          <p>
            For questions regarding these Terms of Service or editorial matters, please reach out to:
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1">
            <p><strong>Spotlight Site Administration</strong></p>
            <p>
              Email:{' '}
              <a href="mailto:qbinhtkcongviec@gmail.com" className="text-indigo-600 underline font-semibold">
                qbinhtkcongviec@gmail.com
              </a>
            </p>
          </div>
        </section>
      </div>

      <div className="text-center text-xs text-slate-400">
        <Link href="/privacy-policy" className="hover:text-slate-600 underline mr-4">Privacy Policy</Link>
        <Link href="/cookie-policy" className="hover:text-slate-600 underline mr-4">Cookie Policy</Link>
        <Link href="/contact" className="hover:text-slate-600 underline">Contact Us</Link>
      </div>
    </div>
  );
}
