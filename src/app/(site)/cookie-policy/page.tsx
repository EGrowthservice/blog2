import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy - Spotlight',
  description: 'Detailed Cookie Policy compliant with Directive 2002/58/EC (ePrivacy Directive), GDPR Recital 30, and Google Advertising Cookie disclosures.',
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
          ePrivacy & Consent Framework
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-sm text-slate-500 mt-3">
          Effective Date: September 30, 2026 | Last Audited: September 30, 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xs space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            1. Legal Basis & Scope of Cookie Usage
          </h2>
          <p>
            This Cookie Policy explains how <strong>Spotlight</strong> uses cookies, web beacons, local storage objects, and similar tracking technologies when you browse our publication.
          </p>
          <p>
            Our deployment of terminal equipment storage is governed by:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-700">
            <li><strong>Directive 2002/58/EC</strong> of the European Parliament and of the Council (Directive on Privacy and Electronic Communications, as amended by Directive 2009/136/EC).</li>
            <li><strong>Regulation (EU) 2016/679 (GDPR)</strong> Recital 30, establishing that online identifiers including cookies may be associated with natural persons and constitute personal data.</li>
            <li><strong>Google EU User Consent Policy</strong> and Google AdSense Third-Party Cookie Requirements.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            2. Detailed Classification of Cookies Deployed
          </h2>
          <p>
            The table below enumerates the technical categories of cookies and local storage tokens utilized across Spotlight:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="p-3 border border-slate-200 font-bold">Category</th>
                  <th className="p-3 border border-slate-200 font-bold">Cookie Names / Identifiers</th>
                  <th className="p-3 border border-slate-200 font-bold">Purpose & Legal Basis</th>
                  <th className="p-3 border border-slate-200 font-bold">Retention Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 border border-slate-200 font-semibold text-slate-900">
                    Strictly Necessary
                  </td>
                  <td className="p-3 border border-slate-200 font-mono text-xs">
                    auth-token, csrf-token, next-auth.session-token
                  </td>
                  <td className="p-3 border border-slate-200">
                    Essential for secure authentication, session persistence, and Cross-Site Request Forgery mitigation. Exempt from consent under Art. 5(3) Directive 2002/58/EC.
                  </td>
                  <td className="p-3 border border-slate-200">
                    Session / 7 Days
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-slate-200 font-semibold text-slate-900">
                    Performance & Analytics
                  </td>
                  <td className="p-3 border border-slate-200 font-mono text-xs">
                    _ga, _ga_*, _gid
                  </td>
                  <td className="p-3 border border-slate-200">
                    Google Analytics 4 telemetry. Measures unique visitors, bounce rates, and reading depth to help our editors refine entertainment and sports coverage.
                  </td>
                  <td className="p-3 border border-slate-200">
                    _ga: 2 Years<br />_gid: 24 Hours
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-slate-200 font-semibold text-slate-900">
                    Advertising & Retargeting
                  </td>
                  <td className="p-3 border border-slate-200 font-mono text-xs">
                    IDE, DSID, __gads, __gpi
                  </td>
                  <td className="p-3 border border-slate-200">
                    DoubleClick / Google AdSense. Serves non-intrusive contextual or personalized advertisements and limits frequency of repeated impressions.
                  </td>
                  <td className="p-3 border border-slate-200">
                    13 Months
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            3. Browser Configuration & Cookie Management
          </h2>
          <p>
            You have the right to accept, refuse, or remove cookies at any time through your browser settings. Instructions for standard browsers are provided below:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">Google Chrome</h3>
              <p className="text-slate-600">
                Go to <code className="bg-slate-200 px-1 rounded">Settings &gt; Privacy and security &gt; Third-party cookies</code>. You can select &ldquo;Block third-party cookies&rdquo; or delete existing cookies.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">Mozilla Firefox</h3>
              <p className="text-slate-600">
                Navigate to <code className="bg-slate-200 px-1 rounded">Settings &gt; Privacy &amp; Security</code>. Under &ldquo;Enhanced Tracking Protection&rdquo;, select &ldquo;Strict&rdquo; or configure custom cookie exceptions.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">Apple Safari</h3>
              <p className="text-slate-600">
                Open <code className="bg-slate-200 px-1 rounded">Settings &gt; Safari &gt; Advanced</code>. Enable &ldquo;Block All Cookies&rdquo; or manage website tracking preferences under &ldquo;Privacy&rdquo;.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">Microsoft Edge</h3>
              <p className="text-slate-600">
                Go to <code className="bg-slate-200 px-1 rounded">Settings &gt; Cookies and site permissions &gt; Manage and delete cookies and site data</code>.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            4. Centralized Opt-Out Tools for Targeted Advertising
          </h2>
          <p>
            You can utilize industry-wide regulatory opt-out registries to opt out of interest-based advertising across multiple advertising networks simultaneously:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
            <li><strong>United States:</strong> Digital Advertising Alliance (DAA) WebChoices tool at <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">optout.aboutads.info</a> and Network Advertising Initiative (NAI) at <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">optout.networkadvertising.org</a>.</li>
            <li><strong>European Union / EEA:</strong> European Interactive Digital Advertising Alliance (EDAA) consumer portal at <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">youronlinechoices.eu</a>.</li>
            <li><strong>Canada:</strong> Digital Advertising Alliance of Canada (DAAC) tool at <a href="https://youradchoices.ca/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-medium">youradchoices.ca</a>.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            5. Global Privacy Control (GPC) & Do Not Track (DNT)
          </h2>
          <p>
            Spotlight recognizes and respects <strong>Global Privacy Control (GPC)</strong> signals transmitted by modern web browsers. When our servers detect a valid GPC header signal, we treat this as a valid opt-out request for targeted advertising and third-party tracking in compliance with California CPRA regulations.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4 border-t border-slate-200 pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            6. Inquiries Regarding Cookie Technologies
          </h2>
          <p>
            For questions regarding this policy or our technical implementation of cookies, please contact:
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-slate-900">Spotlight Privacy & Tracking Inquiries:</p>
            <p>Email: <a href="mailto:privacy@spotlightmedia.com" className="text-indigo-600 underline font-semibold">privacy@spotlightmedia.com</a></p>
          </div>
        </section>
      </div>

      <div className="text-center text-xs text-slate-400">
        <Link href="/privacy-policy" className="hover:text-slate-600 underline mr-4">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-slate-600 underline mr-4">Terms of Service</Link>
        <Link href="/contact" className="hover:text-slate-600 underline">Contact Editorial Desk</Link>
      </div>
    </div>
  );
}
