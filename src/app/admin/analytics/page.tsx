'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Activity,
  Search,
  Eye,
  FolderTree,
} from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { ISetting } from '@/types';

export default function AdminAnalyticsPage() {
  const [settings, setSettings] = useState<ISetting | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      });
  }, []);

  const gaId = settings?.gaId || process.env.NEXT_PUBLIC_GA_ID;
  const isConfigured = Boolean(gaId && gaId.trim().length > 0);

  const trackedEvents = [
    {
      name: 'Page Views',
      icon: Eye,
      description: 'Automatically dispatched on route transitions via GoogleAnalytics client component.',
    },
    {
      name: 'Article Reads',
      icon: Activity,
      description: 'Triggered when visitors view full article pages, updating verified MongoDB counters.',
    },
    {
      name: 'Search Queries',
      icon: Search,
      description: 'Logged to evaluate trending reader topics and keyword interest patterns.',
    },
    {
      name: 'Category Visits',
      icon: FolderTree,
      description: 'Tracked to assess topic demand and user interest distributions.',
    },
  ];

  return (
    <div>
      <AdminNavbar title="Google Analytics 4" />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Analytics Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor real-time Google Analytics 4 integration status and telemetry tracking events.
          </p>
        </div>

        {/* Integration Status Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Google Analytics 4 Status
                </h3>
                {isConfigured ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Not Configured
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
                {isConfigured
                  ? `Active Measurement ID: ${gaId}. Telemetry script is injecting into public pages.`
                  : 'Add your GA4 Measurement ID (format: G-XXXXXXXXXX) in Settings to begin streaming visitor metrics.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isConfigured ? (
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow transition"
              >
                <span>Open Google Analytics</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition"
              >
                Configure in Settings
              </Link>
            )}
          </div>
        </div>

        {/* Tracked Events Matrix */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Automated Telemetry Events
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trackedEvents.map((evt) => {
              const Icon = evt.icon;
              return (
                <div
                  key={evt.name}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{evt.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Setup Instructions Box */}
        <div className="bg-slate-900 text-slate-300 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">
            Connecting Google Analytics 4 to Spotlight
          </h3>
          <ol className="list-decimal pl-5 space-y-2 text-xs leading-relaxed text-slate-300">
            <li>Visit <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">analytics.google.com</a> and sign in with your Google account.</li>
            <li>Create a new Property for your blog domain and establish a Web Data Stream.</li>
            <li>Copy your <strong>Measurement ID</strong> (e.g. <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">G-XXXXXXXXXX</code>).</li>
            <li>Paste it into <Link href="/admin/settings" className="text-indigo-400 underline font-semibold">Admin → Settings</Link> or add it to <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">NEXT_PUBLIC_GA_ID</code> in your <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">.env</code> file.</li>
            <li>Save changes. Google Analytics will immediately begin tracking visits.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
