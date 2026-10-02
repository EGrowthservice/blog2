import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy - Spotlight',
  description: 'Learn how Spotlight uses cookies, analytics, and advertising technologies, and how you can manage your preferences.',
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
          Browser Storage & Privacy
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-sm text-slate-500 mt-3">
          Last Updated: October 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xs space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* Intro */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            1. What Are Cookies?
          </h2>
          <p>
            Cookies are small text files placed on your computer or mobile device when you visit websites. They help websites remember your preferences, keep you logged into secure administrative areas, and provide anonymous usage metrics to website owners.
          </p>
        </section>

        {/* What Cookies We Use */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            2. The Types of Cookies We Use
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="p-3 border border-slate-200 font-bold">Cookie Category</th>
                  <th className="p-3 border border-slate-200 font-bold">Examples</th>
                  <th className="p-3 border border-slate-200 font-bold">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 border border-slate-200 font-semibold text-slate-900">
                    Essential / Administrative
                  </td>
                  <td className="p-3 border border-slate-200 font-mono text-xs">
                    auth-token, session
                  </td>
                  <td className="p-3 border border-slate-200">
                    Allows administrators to securely log into the content dashboard and manage posts. Regular readers are not required to log in to read or comment.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-slate-200 font-semibold text-slate-900">
                    Analytics & Performance
                  </td>
                  <td className="p-3 border border-slate-200 font-mono text-xs">
                    _ga, _ga_*
                  </td>
                  <td className="p-3 border border-slate-200">
                    Used by Google Analytics to help us understand anonymous reader volume, popular articles, and website speed performance.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-slate-200 font-semibold text-slate-900">
                    Advertising & Marketing
                  </td>
                  <td className="p-3 border border-slate-200 font-mono text-xs">
                    __gads, IDE, DSID
                  </td>
                  <td className="p-3 border border-slate-200">
                    Set by Google AdSense and third-party advertising partners to serve relevant advertising and prevent the same ad from showing repeatedly.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* How to Manage Cookies */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            3. How to Control and Manage Cookies
          </h2>
          <p>
            You can configure your browser to block or alert you about cookies, or delete cookies that have already been set. Each web browser provides straightforward controls in its settings menu:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
            <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Third-party cookies.</li>
            <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection.</li>
            <li><strong>Apple Safari:</strong> Settings &gt; Safari &gt; Advanced / Privacy &gt; Block All Cookies.</li>
            <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies.</li>
          </ul>
          <p className="text-xs text-slate-500">
            Note: Disabling all cookies will not prevent you from reading public articles or posting guest comments on our site.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4 border-t border-slate-200 pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            4. Questions About Our Cookie Usage
          </h2>
          <p>
            If you have questions about how we use cookies, please feel free to email:
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-slate-900">Spotlight Administration:</p>
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
        <Link href="/terms" className="hover:text-slate-600 underline mr-4">Terms of Service</Link>
        <Link href="/contact" className="hover:text-slate-600 underline">Contact Us</Link>
      </div>
    </div>
  );
}
