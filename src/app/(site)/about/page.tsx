import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Film, Trophy, Music, Tv, Mail } from 'lucide-react';
import { getSiteSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About Us - Spotlight',
  description: 'Learn more about Spotlight, our editorial mission, coverage of cinema, music, television, and sports, and how to get in touch.',
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const editorialPillars = [
    {
      icon: Film,
      title: 'Movies & Cinema',
      description: 'Reviews, box office analysis, and thoughtful critiques of contemporary cinema and indie releases.',
    },
    {
      icon: Tv,
      title: 'Prestige TV & Streaming',
      description: 'In-depth coverage of top series, season breakdowns, streaming platform trends, and industry shifts.',
    },
    {
      icon: Music,
      title: 'Music & Culture',
      description: 'Spotlighting album releases, artist retrospectives, sound design, and live event retrospectives.',
    },
    {
      icon: Trophy,
      title: 'Sports Coverage',
      description: 'Analytical perspectives, match narratives, tactical breakthroughs, and tournament highlights.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          Independent Publication
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          About {settings.siteName}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {settings.description}
        </p>
      </div>

      {/* Narrative Section */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">
        <h2 className="text-2xl font-bold text-slate-900">Our Editorial Mission</h2>
        <p>
          Welcome to <strong>{settings.siteName}</strong> — an independent digital news and review blog dedicated to sharing clear, curated, and engaging coverage across entertainment, television, music, and sports.
        </p>
        <p>
          We aim to provide a clean, distraction-free reading experience. Our focus is straightforward: well-written stories, thoughtful critiques, and timely updates without excessive clutter or sensationalism.
        </p>

        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden my-8">
          <Image
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
            alt="Spotlight Editorial Perspective"
            fill
            className="object-cover"
          />
        </div>

        <h3 className="text-xl font-bold text-slate-900">Community & Discussion</h3>
        <p>
          We believe in open conversation. Readers are welcome to join discussions by commenting on our articles or reporting inappropriate content directly without requiring account registration. We strive to maintain a constructive and respectful community environment.
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {editorialPillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{pillar.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
            </div>
          );
        })}
      </div>

      {/* Direct Contact Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Mail className="w-4 h-4" /> Get in Touch
          </div>
          <h3 className="text-2xl font-bold">Have feedback, news tips, or a story inquiry?</h3>
          <p className="text-slate-400 text-sm max-w-md">
            Reach out directly to our editorial mailbox at{' '}
            <a href="mailto:qbinhtkcongviec@gmail.com" className="text-white underline font-semibold">
              qbinhtkcongviec@gmail.com
            </a>
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors whitespace-nowrap shadow-sm"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
