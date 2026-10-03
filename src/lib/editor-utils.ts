export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function isMarkdownText(text: string): boolean {
  if (!text || text.length < 5) return false;
  const lines = text.split('\n');
  let markdownSignals = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^#{1,6}\s+\S+/.test(trimmed)) markdownSignals += 2;
    if (/^(\*|-|\+)\s+\S+/.test(trimmed)) markdownSignals += 1;
    if (/^\d+\.\s+\S+/.test(trimmed)) markdownSignals += 1;
    if (/^>\s+\S+/.test(trimmed)) markdownSignals += 1;
    if (/^```/.test(trimmed)) markdownSignals += 2;
  }

  if (/\*\*[^*\n]+\*\*/.test(text)) markdownSignals += 1;
  if (/\[[^\]]+\]\([^)]+\)/.test(text)) markdownSignals += 1;

  return markdownSignals >= 2;
}

export function convertMarkdownToHtml(md: string): string {
  if (!md) return '';
  const lines = md.split(/\r?\n/);
  const result: string[] = [];
  let inList: 'ul' | 'ol' | null = null;
  let inCodeBlock = false;
  let codeBlockBuffer: string[] = [];
  let inBlockquote = false;
  let blockquoteBuffer: string[] = [];

  const flushList = () => {
    if (inList) {
      result.push(inList === 'ul' ? '</ul>' : '</ol>');
      inList = null;
    }
  };

  const flushBlockquote = () => {
    if (inBlockquote) {
      result.push(`<blockquote><p>${blockquoteBuffer.join('<br>')}</p></blockquote>`);
      blockquoteBuffer = [];
      inBlockquote = false;
    }
  };

  const formatInline = (text: string): string => {
    let t = escapeHtml(text);
    // Bold: **text** or __text__
    t = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/__(.*?)__/g, '<strong>$1</strong>');
    // Italic: *text* or _text_
    t = t.replace(/\*(.*?)\*/g, '<em>$1</em>');
    t = t.replace(/_([^_]+)_/g, '<em>$1</em>');
    // Strikethrough: ~~text~~
    t = t.replace(/~~(.*?)~~/g, '<s>$1</s>');
    // Inline code: `code`
    t = t.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-600 font-mono text-xs">$1</code>');
    // Links: [text](url)
    t = t.replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 underline underline-offset-2">$1</a>');
    return t;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Code block ```
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        result.push(`<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto my-4 text-xs font-mono"><code>${escapeHtml(codeBlockBuffer.join('\n'))}</code></pre>`);
        codeBlockBuffer = [];
        inCodeBlock = false;
      } else {
        flushList();
        flushBlockquote();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(rawLine);
      continue;
    }

    // Empty line
    if (!trimmed) {
      flushList();
      flushBlockquote();
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      flushBlockquote();
      const level = headingMatch[1].length;
      const headingText = formatInline(headingMatch[2]);
      result.push(`<h${level}>${headingText}</h${level}>`);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      flushList();
      inBlockquote = true;
      blockquoteBuffer.push(formatInline(trimmed.replace(/^>\s*/, '')));
      continue;
    } else {
      flushBlockquote();
    }

    // Bullet list (- or * or +)
    const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (bulletMatch) {
      if (inList !== 'ul') {
        flushList();
        result.push('<ul>');
        inList = 'ul';
      }
      result.push(`<li>${formatInline(bulletMatch[1])}</li>`);
      continue;
    }

    // Numbered list (1. or 2.)
    const numberMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (numberMatch) {
      if (inList !== 'ol') {
        flushList();
        result.push('<ol>');
        inList = 'ol';
      }
      result.push(`<li>${formatInline(numberMatch[1])}</li>`);
      continue;
    }

    // If we were in a list and line is not a list item, flush list
    flushList();

    // Horizontal rule
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      result.push('<hr class="my-6 border-slate-200" />');
      continue;
    }

    // Normal paragraph
    result.push(`<p>${formatInline(trimmed)}</p>`);
  }

  flushList();
  flushBlockquote();

  return result.join('\n');
}

export function cleanWordAndHtml(html: string): string {
  if (!html) return '';

  let cleaned = html;

  // Remove XML, conditional comments, and MSO comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
  cleaned = cleaned.replace(/<xml[\s\S]*?<\/xml>/gi, '');
  cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '');
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<meta[\s\S]*?>/gi, '');
  cleaned = cleaned.replace(/<link[\s\S]*?>/gi, '');
  cleaned = cleaned.replace(/<title[\s\S]*?<\/title>/gi, '');

  // Remove Word o:p tags
  cleaned = cleaned.replace(/<\/?o:p[^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/?w:[^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/?m:[^>]*>/gi, '');

  // Clean Microsoft Word Mso classes and inline styles
  cleaned = cleaned.replace(/class="?[^"]*Mso[^"]*"?/gi, '');
  cleaned = cleaned.replace(/style="[^"]*mso-[^"]*"/gi, '');

  // Clean empty spans
  cleaned = cleaned.replace(/<span\s*>([\s\S]*?)<\/span>/gi, '$1');

  return cleaned.trim();
}

export function convertPlainTextToHtml(text: string): string {
  if (!text) return '';
  const paragraphs = text
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return '';

  return paragraphs
    .map((para) => {
      const formatted = escapeHtml(para).replace(/\r?\n/g, '<br />');
      return `<p>${formatted}</p>`;
    })
    .join('\n');
}

export function calculateWordCount(textOrHtml: string) {
  if (!textOrHtml) return { words: 0, chars: 0, readingTime: 1 };
  const clean = textOrHtml.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim();
  const chars = clean.length;
  const words = clean.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { words, chars, readingTime };
}
