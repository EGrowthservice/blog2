import type { Metadata } from 'next';
import Image from 'next/image';
import { Film, Trophy, Laugh, ShieldCheck } from 'lucide-react';
import { getSiteSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About Spotlight - Entertainment, Sports & Comedy Editorial Mission',
  description: 'Discover Spotlight’s editorial standards, journalistic integrity, and comprehensive coverage across Entertainment, Sports, and Comedy.',
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const values = [
    {
      icon: Film,
      title: 'Cultural Pulse & Cinema',
      description: 'We bring sharp critique, exclusive festival coverage, and nuanced reporting on cinema, television, and streaming media.',
    },
    {
      icon: Trophy,
      title: 'Athletic Depth & Analysis',
      description: 'Beyond box scores, we break down tactical strategies, player legacies, and tournament narratives across major global sports.',
    },
    {
      icon: Laugh,
      title: 'Witty Commentary & Comedy',
      description: 'From stand-up retrospectives to insightful satire, we explore the cultural power of humor and comedy craft.',
    },
    {
      icon: ShieldCheck,
      title: 'Editorial Standards & Verification',
      description: 'Every reported event, quote, and sports statistic is verified against primary sources, official league records, and public press archives.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          Editorial Mission
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
        <h2 className="text-2xl font-bold text-slate-900">Illuminating Pop Culture, Athletic Feats & Comedy</h2>
        <p>
          Founded in 2026, <strong>{settings.siteName}</strong> is dedicated to celebrating and analyzing three essential pillars of modern culture: <strong>Entertainment</strong>, <strong>Sports</strong>, and <strong>Comedy</strong>.
        </p>
        <p>
          In an era of relentless algorithmic feeds and superficial snippets, Spotlight provides thoughtful journalism, lively commentary, and rich multimedia stories. Whether exploring the theatrical evolution of film, analyzing championship sports matches, or spotlighting trailblazing stand-up comedians, our platform delivers journalism that entertains and informs.
        </p>

        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden my-8">
          <Image
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
            alt="Spotlight Editorial Production"
            fill
            className="object-cover"
          />
        </div>

        <h3 className="text-xl font-bold text-slate-900">Editorial Independence & Transparency</h3>
        <p>
          Our editorial desk operates with strict journalistic independence. Programmatic advertising, commercial partnerships, and creative sponsorships are strictly separated from our editorial judgments and never dictate our reviews, sports coverage, or critical opinions.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {values.map((val) => {
          const Icon = val.icon;
          return (
            <div
              key={val.title}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{val.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{val.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
