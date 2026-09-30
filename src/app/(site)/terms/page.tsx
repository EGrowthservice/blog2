import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - Spotlight',
  description: 'Binding Terms of Service, editorial licensing, DMCA (17 U.S.C. § 512) copyright procedures, and acceptable use policy for Spotlight.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
          Binding Legal Agreement
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 mt-3">
          Effective Date: September 30, 2026 | Last Audited: September 30, 2026
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-xs space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            1. Acceptance of Terms & Legal Capacity
          </h2>
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;you&rdquo;) and <strong>Spotlight</strong> (&ldquo;Spotlight&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), regulating your access to and use of Spotlight&apos;s digital publications, domain, content, feeds, and interactive features.
          </p>
          <p>
            By accessing or browsing this website, you warrant and represent that you are at least 16 years of age (or have reached the age of majority in your jurisdiction) and possess the legal capacity to enter into these binding terms. If you do not agree to these Terms, you must discontinue use immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            2. Intellectual Property, Copyright & Fair Use
          </h2>
          <p>
            All original editorial essays, critical reviews, headline curation, typography, source code, logos, and graphics published on Spotlight are the proprietary property of Spotlight or licensed to us by respective copyright holders, protected by international copyright laws and treaties.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Permitted Personal Use:</strong> You are granted a revocable, non-exclusive, non-transferable license to access, view, and read content solely for personal, non-commercial purposes.
            </li>
            <li>
              <strong>Fair Use & Quotation (17 U.S.C. § 107):</strong> Journalists, educators, and commentators may quote brief excerpts (up to 75 words) of Spotlight articles provided that clear attribution and a direct dofollow hyperlink to the original article URL are maintained.
            </li>
            <li>
              <strong>Prohibited Conduct:</strong> You may not republish full-text articles, syndicate feeds without prior written consent, frame our pages, or scrape editorial assets for commercial distribution or generative model training without explicit licensing agreements.
            </li>
          </ul>
        </section>

        {/* Section 3 - DMCA */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            3. Copyright Infringement & DMCA Notice-and-Takedown Procedure
          </h2>
          <p>
            Spotlight respects the intellectual property rights of creators. In accordance with the <strong>Digital Millennium Copyright Act of 1998 (17 U.S.C. § 512)</strong>, we maintain a designated copyright agent to receive and process formal infringement notifications.
          </p>
          <p>
            To submit an effective DMCA Notice of Infringement pursuant to 17 U.S.C. § 512(c)(3), your written communication must include:
          </p>
          <ol className="list-decimal pl-6 space-y-1.5 text-xs sm:text-sm">
            <li>A physical or electronic signature of a person authorized to act on behalf of the copyright owner.</li>
            <li>Specific identification of the copyrighted work claimed to have been infringed, or a representative list of works.</li>
            <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit Spotlight to locate the material (exact URL on Spotlight).</li>
            <li>Information reasonably sufficient to permit us to contact you, such as address, telephone number, and email.</li>
            <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</li>
          </ol>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
            <p className="font-semibold text-slate-900">Designated DMCA Copyright Agent:</p>
            <p>Spotlight Media Legal Department</p>
            <p>Attn: DMCA Copyright Takedown Coordinator</p>
            <p>Email: <a href="mailto:dmca@spotlightmedia.com" className="text-indigo-600 underline font-medium">dmca@spotlightmedia.com</a></p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            4. Editorial Independence, Parody & Humor Disclaimers
          </h2>
          <p>
            Spotlight covers <strong>Entertainment, Sports, and Comedy</strong>. Readers must recognize distinct editorial formats:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Journalism & Sports Analysis:</strong> Fact-checked reporting on sporting events, league standings, player transactions, and industry news is verified against reliable public records and official press communications.</li>
            <li><strong>Comedy & Satirical Features:</strong> Content published under the Comedy category may feature satire, hyperbole, parodic commentary, or humorous opinion. Parody and comedic commentary are recognized forms of constitutionally protected speech and should not be construed as literal statements of factual claims.</li>
            <li><strong>Third-Party Opinions:</strong> Op-eds, guest columns, and interviews reflect the personal viewpoints of respective speakers and do not necessarily represent the institutional editorial stance of Spotlight.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            5. System Integrity & Acceptable Use Policy
          </h2>
          <p>
            When utilizing Spotlight, you agree not to engage in any activity that compromises server infrastructure or violates the <strong>Computer Fraud and Abuse Act (18 U.S.C. § 1030)</strong>:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Do not launch automated denial-of-service (DoS/DDoS) attacks or intentionally flood API endpoints.</li>
            <li>Do not bypass authentication mechanisms, manipulate session tokens, or attempt administrative escalation.</li>
            <li>Do not inject malicious code, scripts, or cross-site scripting (XSS) payloads into form fields or comment systems.</li>
            <li>Do not misrepresent affiliation with Spotlight or impersonate editorial staff members.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            6. Advertising Disclaimers & Google AdSense Transparency
          </h2>
          <p>
            Spotlight is monetized in part through commercial sponsorships, affiliate partnerships, and digital advertising programs, including Google AdSense. In accordance with Google AdSense program policies and the Federal Trade Commission (FTC) Guides Concerning the Use of Endorsements and Testimonials (16 C.F.R. Part 255):
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Advertisements are distinguished from organic editorial content through visual badges or placement markers.</li>
            <li>Spotlight does not endorse, guarantee, or make warranties regarding third-party products, services, or claims advertised through external ad networks.</li>
            <li>Clicking on advertising links directs users to external web properties subject to separate terms and privacy policies.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            7. Disclaimer of Warranties & Limitation of Liability
          </h2>
          <p className="uppercase text-xs font-bold tracking-wider text-slate-500">
            Important Notice Regarding Legal Remedies
          </p>
          <p>
            THE SERVICES, CONTENT, AND CODE PROVIDED ON SPOTLIGHT ARE OFFERED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, OR NON-INFRINGEMENT.
          </p>
          <p>
            TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, IN NO EVENT SHALL SPOTLIGHT, ITS DIRECTORS, EMPLOYEES, AFFILIATES, OR CONTENT CONTRIBUTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF THE SITE.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-4 border-t border-slate-200 pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            8. Governing Law, Severability & Amendments
          </h2>
          <p>
            These Terms shall be interpreted and governed in accordance with applicable laws, without regard to conflict of law principles. If any provision of these Terms is deemed unlawful, void, or for any reason unenforceable by a court of competent jurisdiction, that provision shall be deemed severable and shall not affect the validity and enforceability of any remaining provisions.
          </p>
          <p>
            We reserve the right to amend these Terms at our discretion. Notice of substantial revisions will be reflected in the &ldquo;Effective Date&rdquo; header above.
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-slate-900">Legal Contact:</p>
            <p>Spotlight Media Legal Department</p>
            <p>Email: <a href="mailto:legal@spotlightmedia.com" className="text-indigo-600 underline font-semibold">legal@spotlightmedia.com</a></p>
          </div>
        </section>
      </div>

      <div className="text-center text-xs text-slate-400">
        <Link href="/privacy-policy" className="hover:text-slate-600 underline mr-4">Privacy Policy</Link>
        <Link href="/cookie-policy" className="hover:text-slate-600 underline mr-4">Cookie Policy</Link>
        <Link href="/contact" className="hover:text-slate-600 underline">Contact Editorial Desk</Link>
      </div>
    </div>
  );
}
