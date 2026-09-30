import sanitizeHtml from 'sanitize-html';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  const cleanText = content.replace(/<[^>]*>/g, ' ');
  const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}

export function formatDate(dateStringOrDate?: string | Date | null): string {
  if (!dateStringOrDate) return '';
  const date = new Date(dateStringOrDate);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

export function sanitizeHtmlContent(dirtyHtml: string): string {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'div', 'span', 'blockquote',
      'b', 'i', 'strong', 'em', 'strike', 'code', 'pre', 'hr', 'br',
      'ul', 'ol', 'li',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a', 'img', 'iframe', 'figure', 'figcaption',
    ],
    allowedAttributes: {
      '*': ['class', 'style', 'id'],
      a: ['href', 'name', 'target', 'rel', 'class', 'style', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'class', 'style'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'class', 'style'],
      div: ['class', 'style', 'id'],
      span: ['class', 'style', 'id'],
      p: ['class', 'style'],
      h1: ['id', 'class', 'style'],
      h2: ['id', 'class', 'style'],
      h3: ['id', 'class', 'style'],
      h4: ['id', 'class', 'style'],
      code: ['class', 'style'],
      pre: ['class', 'style'],
      table: ['class', 'style', 'border', 'cellpadding', 'cellspacing'],
      th: ['class', 'style', 'scope', 'colspan', 'rowspan'],
      td: ['class', 'style', 'colspan', 'rowspan'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com', 'twitter.com', 'platform.twitter.com'],
  });
}
