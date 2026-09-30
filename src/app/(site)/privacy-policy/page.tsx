import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Spotlight',
  description: 'Comprehensive Privacy Policy adhering to EU GDPR (Regulation 2016/679), CCPA/CPRA (Cal. Civ. Code § 1798.100), and Google Advertising Disclosures.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
          Statutory Compliance & Data Protection
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 mt-3">
          Effective Date: September 30, 2026 | Last Updated & Audited: September 30, 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xs space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* Intro */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            1. Introduction & Scope of Policy
          </h2>
          <p>
            This Privacy Policy governs the collection, processing, and storage of personal data by <strong>Spotlight</strong> (&ldquo;Spotlight&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) when you access our digital publication, websites, newsletters, RSS feeds, and affiliated digital platforms.
          </p>
          <p>
            Spotlight is committed to transparent, lawful, and accountable data processing in strict adherence to applicable global privacy legislations, including:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li><strong>Regulation (EU) 2016/679</strong> of the European Parliament and of the Council (General Data Protection Regulation or &ldquo;GDPR&rdquo;).</li>
            <li><strong>The California Consumer Privacy Act of 2018 (CCPA)</strong> as amended by the <strong>California Privacy Rights Act of 2020 (CPRA)</strong>, codified at California Civil Code § 1798.100 <em>et seq</em>.</li>
            <li><strong>The Children&apos;s Online Privacy Protection Act (COPPA)</strong>, 15 U.S.C. §§ 6501–6506 and 16 C.F.R. Part 312.</li>
            <li><strong>Google Publisher Policies</strong> and Third-Party Advertising disclosures including the Google EU User Consent Policy.</li>
          </ul>
        </section>

        {/* Legal Bases */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            2. Legal Bases for Processing Under EU GDPR (Article 6)
          </h2>
          <p>
            Pursuant to Article 6(1) of Regulation (EU) 2016/679, Spotlight processes your personal data only where at least one of the following recognized legal grounds applies:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Article 6(1)(a) – Consent</h3>
              <p className="text-xs text-slate-600">
                Where you have given explicit consent for specific purposes, such as opting into our editorial email newsletter or allowing non-essential analytics and marketing cookies.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Article 6(1)(f) – Legitimate Interests</h3>
              <p className="text-xs text-slate-600">
                Where processing is necessary for legitimate journalistic and business operations, fraud prevention, server security monitoring, and delivering high-quality entertainment reporting.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Article 6(1)(b) – Contractual Necessity</h3>
              <p className="text-xs text-slate-600">
                Where processing is required to satisfy contractual terms or provide services explicitly requested by you (e.g., fulfilling registered subscriptions or editorial inquiries).
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Article 6(1)(c) – Legal Obligation</h3>
              <p className="text-xs text-slate-600">
                Where disclosure or recordkeeping is mandated by applicable statutory obligations, tax authorities, or court orders.
              </p>
            </div>
          </div>
        </section>

        {/* Categories of Data */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            3. Categories of Personal Data Collected
          </h2>
          <p>
            Depending on how you interact with Spotlight, we collect the following statutory categories of data:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="p-3 border border-slate-200 font-bold">Category (CCPA § 1798.140)</th>
                  <th className="p-3 border border-slate-200 font-bold">Specific Data Elements</th>
                  <th className="p-3 border border-slate-200 font-bold">Purpose & Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 border border-slate-200 font-semibold">Identifiers</td>
                  <td className="p-3 border border-slate-200">IP address, unique pseudonymous online identifiers, cookie identifiers, contact email (if submitted via contact forms).</td>
                  <td className="p-3 border border-slate-200">Directly from visitor interaction or automatically logged by web servers for connection establishment and rate limiting.</td>
                </tr>
                <tr>
                  <td className="p-3 border border-slate-200 font-semibold">Internet Network Activity</td>
                  <td className="p-3 border border-slate-200">Browsing history on Spotlight, article read duration, referrers, HTTP status codes, browser user-agent header.</td>
                  <td className="p-3 border border-slate-200">Automated telemetry via Google Analytics 4 and server event logs for content optimization.</td>
                </tr>
                <tr>
                  <td className="p-3 border border-slate-200 font-semibold">Geolocation Data</td>
                  <td className="p-3 border border-slate-200">Coarse regional geolocation derived from IP address (country, state, or metropolitan area level; no precise GPS).</td>
                  <td className="p-3 border border-slate-200">Geo-routing, regional copyright licensing compliance, and CDN edge optimization.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Google Advertising & Cookies */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            4. Third-Party Advertising & Google AdSense Disclosures
          </h2>
          <p>
            In accordance with Google publisher requirements and industry transparency frameworks, we disclose:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Third-Party Vendor Cookies:</strong> Third-party vendors, including Google LLC, use cookies to serve advertisements based on a user&apos;s prior visits to Spotlight or other websites across the World Wide Web.
            </li>
            <li>
              <strong>DoubleClick DART Cookie:</strong> Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to Spotlight and/or other sites on the internet.
            </li>
            <li>
              <strong>Interest-Based Opt-Out Mechanisms:</strong> You may opt out of personalized advertising by managing your preferences directly via:
              <ul className="list-circle pl-6 mt-1 space-y-1 text-xs">
                <li><a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">Google My Ad Center</a></li>
                <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">Digital Advertising Alliance (DAA) WebChoices Tool</a></li>
                <li><a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">Network Advertising Initiative (NAI) Consumer Opt-Out</a></li>
                <li><a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">European Interactive Digital Advertising Alliance (EDAA)</a></li>
              </ul>
            </li>
          </ul>
        </section>

        {/* Google Analytics 4 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            5. Analytics & Google Analytics 4 Disclosures
          </h2>
          <p>
            Spotlight utilizes <strong>Google Analytics 4 (GA4)</strong>, a web analysis service provided by Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA). GA4 utilizes cookies and event identifiers to track aggregate traffic behavior.
          </p>
          <p>
            IP addresses are anonymized automatically by default in GA4 before logging or processing. You may permanently prevent data collection by GA4 across all websites by downloading and installing the official <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">Google Analytics Opt-out Browser Add-on</a>.
          </p>
        </section>

        {/* Data Subject Rights GDPR */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            6. Your Statutory Rights Under GDPR (Articles 15–22)
          </h2>
          <p>
            If you reside within the European Economic Area (EEA), United Kingdom, or Switzerland, you possess enforceable statutory rights under Regulation (EU) 2016/679:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Right of Access (Article 15):</strong> Obtain confirmation as to whether your personal data is being processed and receive a copy of your records.</li>
            <li><strong>Right to Rectification (Article 16):</strong> Require rectification of inaccurate or incomplete personal data without undue delay.</li>
            <li><strong>Right to Erasure / &ldquo;Right to be Forgotten&rdquo; (Article 17):</strong> Request deletion of your personal data where retention is no longer necessary.</li>
            <li><strong>Right to Restriction of Processing (Article 18):</strong> Restrict processing under contested accuracy or unlawful processing claims.</li>
            <li><strong>Right to Data Portability (Article 20):</strong> Receive your data in a structured, commonly used, and machine-readable format.</li>
            <li><strong>Right to Object (Article 21):</strong> Object at any time to data processing carried out under legitimate interest or for direct marketing.</li>
            <li><strong>Right to Lodge a Complaint (Article 77):</strong> You have the right to lodge a formal complaint with your local Data Protection Authority (DPA).</li>
          </ul>
        </section>

        {/* California Consumer Rights */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            7. Notice to California Residents (CCPA/CPRA Disclosures)
          </h2>
          <p>
            Pursuant to California Civil Code § 1798.100, California consumers have specific rights:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Right to Know & Access:</strong> The right to request disclosure of categories and specific pieces of personal information collected over the preceding 12 months.</li>
            <li><strong>Right to Delete:</strong> The right to request deletion of personal information collected from the consumer, subject to statutory exemptions.</li>
            <li><strong>Right to Opt-Out of Sale or Sharing:</strong> Spotlight does not sell personal information for monetary consideration. Where third-party advertising cookies constitute &ldquo;sharing&rdquo; under CPRA, users can exercise opt-out rights via our cookie consent controls.</li>
            <li><strong>Right to Non-Discrimination (Cal. Civ. Code § 1798.125):</strong> We will not discriminate against you in pricing, service availability, or content access for exercising any statutory privacy rights.</li>
          </ul>
        </section>

        {/* Children's Privacy */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            8. Protection of Children&apos;s Privacy (COPPA Compliance)
          </h2>
          <p>
            Spotlight is a general audience entertainment, sports, and comedy publication and does not target children under the age of 13. In compliance with the <strong>Children&apos;s Online Privacy Protection Act (15 U.S.C. §§ 6501–6506)</strong>, we do not knowingly solicit or collect personal identifiable information from children under 13.
          </p>
          <p>
            If a parent or legal guardian discovers that their child has provided personal information without parental consent, please contact our Legal Compliance Department immediately at <strong>privacy@spotlightmedia.com</strong>, and we will expeditiously expunge such records.
          </p>
        </section>

        {/* International Data Transfers */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            9. International Transfers & Data Retention
          </h2>
          <p>
            Where personal data originating in the EEA is transferred internationally, Spotlight relies upon the European Commission&apos;s <strong>Standard Contractual Clauses (SCCs)</strong> under Commission Implementing Decision (EU) 2021/914 to ensure an adequate level of data protection.
          </p>
          <p>
            We retain server log files for a maximum duration of 90 days for network security and intrusion analysis, after which log records are automatically aggregated or permanently purged.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4 border-t border-slate-200 pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            10. Data Controller Contact & Inquiries
          </h2>
          <p>
            To exercise your statutory rights or submit an inquiry regarding our data handling practices, contact our designated privacy department:
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
            <p><strong>Spotlight Media Editorial & Legal Operations</strong></p>
            <p>Attn: Data Protection Officer / Compliance Desk</p>
            <p>Email: <a href="mailto:privacy@spotlightmedia.com" className="text-indigo-600 underline font-semibold">privacy@spotlightmedia.com</a></p>
            <p>General Editorial: <a href="mailto:editorial@spotlightmedia.com" className="text-indigo-600 underline font-semibold">editorial@spotlightmedia.com</a></p>
            <p>Response Timeframe: In accordance with GDPR Art. 12(3) and CCPA § 1798.130, statutory requests will be acknowledged and addressed within thirty (30) calendar days.</p>
          </div>
        </section>
      </div>

      <div className="text-center text-xs text-slate-400">
        <Link href="/terms" className="hover:text-slate-600 underline mr-4">Terms of Service</Link>
        <Link href="/cookie-policy" className="hover:text-slate-600 underline mr-4">Cookie Policy</Link>
        <Link href="/contact" className="hover:text-slate-600 underline">Contact Editorial Desk</Link>
      </div>
    </div>
  );
}
