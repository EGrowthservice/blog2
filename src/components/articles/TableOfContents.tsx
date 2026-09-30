'use client';

import { useEffect, useState, useMemo } from 'react';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

function parseHeadingsFromContent(html: string): TocItem[] {
  if (typeof window === 'undefined') return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const elements = doc.querySelectorAll('h2, h3');

  const items: TocItem[] = [];
  elements.forEach((el, index) => {
    const text = el.textContent || '';
    const level = el.tagName.toLowerCase() === 'h2' ? 2 : 3;
    const id = el.id || `section-${index}-${text.toLowerCase().replace(/[^\w-]+/g, '-')}`;
    items.push({ id, text, level });
  });

  return items;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // Compute headings derived from content (SSR-safe)
  const headings = useMemo(() => {
    return parseHeadingsFromContent(content);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    // Attach IDs to elements in actual DOM article container
    const articleContainer = document.querySelector('.article-body');
    if (articleContainer) {
      const realHeadings = articleContainer.querySelectorAll('h2, h3');
      realHeadings.forEach((el, index) => {
        if (!el.id && headings[index]) {
          el.id = headings[index].id;
        }
      });
    }

    // Scroll spy for active heading
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let currentActive = '';

      headings.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          currentActive = item.id;
        }
      });

      if (currentActive) {
        setActiveId(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-8">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-200">
        <List className="w-4 h-4 text-indigo-600" />
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Table of Contents
        </h4>
      </div>

      <nav className="space-y-1">
        {headings.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToHeading(item.id)}
            className={`block w-full text-left text-xs py-1.5 transition-colors cursor-pointer rounded px-2 ${
              item.level === 3 ? 'pl-5 text-slate-500' : 'font-medium'
            } ${
              activeId === item.id
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
            }`}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
