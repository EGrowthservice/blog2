import React from 'react';

interface ParsedTag {
  type: 'script' | 'style' | 'meta' | 'link' | 'noscript';
  attributes: Record<string, string | boolean>;
  content: string;
}

function parseAttributes(attrStr: string): Record<string, string | boolean> {
  const attrs: Record<string, string | boolean> = {};
  const attrRegex = /([a-zA-Z0-9_\-:@.]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;

  while ((match = attrRegex.exec(attrStr)) !== null) {
    const key = match[1];
    const rawVal = match[2] ?? match[3] ?? match[4];
    
    // Normalize React attribute names
    let normalizedKey = key;
    if (key.toLowerCase() === 'crossorigin') normalizedKey = 'crossOrigin';
    if (key.toLowerCase() === 'class') normalizedKey = 'className';
    if (key.toLowerCase() === 'for') normalizedKey = 'htmlFor';
    if (key.toLowerCase() === 'http-equiv') normalizedKey = 'httpEquiv';

    if (rawVal === undefined) {
      attrs[normalizedKey] = true;
    } else {
      attrs[normalizedKey] = rawVal;
    }
  }

  return attrs;
}

function parseHeaderTags(html: string): ParsedTag[] {
  if (!html || !html.trim()) return [];

  const trimmed = html.trim();

  // If user pasted raw JavaScript without HTML tags, wrap in script
  if (!trimmed.includes('<')) {
    return [{ type: 'script', attributes: {}, content: trimmed }];
  }

  // Remove HTML comments
  const cleanHtml = trimmed.replace(/<!--[\s\S]*?-->/g, '');

  const tags: ParsedTag[] = [];
  // Match script, style, meta, link, noscript
  const tagRegex = /<(script|style|meta|link|noscript)([\s\S]*?)(?:>([\s\S]*?)<\/\1>|\/>|>)/gi;
  let match;

  while ((match = tagRegex.exec(cleanHtml)) !== null) {
    const tagName = match[1].toLowerCase() as ParsedTag['type'];
    const attrString = match[2] || '';
    const content = match[3] || '';
    const attributes = parseAttributes(attrString);

    tags.push({
      type: tagName,
      attributes,
      content: content.trim(),
    });
  }

  return tags;
}

interface CustomHeaderScriptsProps {
  code?: string;
}

/**
 * CustomHeaderScripts
 * Parses and injects custom header tags (Google Analytics, GTM, Meta Pixel, Meta tags)
 * directly into the <head> element during Server-Side Rendering (SSR).
 * This ensures the tags are present in the HTML source and executed by the browser.
 */
export default function CustomHeaderScripts({ code }: CustomHeaderScriptsProps) {
  if (!code || !code.trim()) {
    return null;
  }

  const tags = parseHeaderTags(code);

  return (
    <>
      {tags.map((tag, idx) => {
        const key = `custom-header-${tag.type}-${idx}`;

        switch (tag.type) {
          case 'script':
            return (
              <script
                key={key}
                {...tag.attributes}
                dangerouslySetInnerHTML={
                  tag.content ? { __html: tag.content } : undefined
                }
              />
            );
          case 'meta':
            return <meta key={key} {...tag.attributes} />;
          case 'link':
            return <link key={key} {...tag.attributes} />;
          case 'style':
            return (
              <style
                key={key}
                {...tag.attributes}
                dangerouslySetInnerHTML={{ __html: tag.content }}
              />
            );
          case 'noscript':
            return (
              <noscript
                key={key}
                {...tag.attributes}
                dangerouslySetInnerHTML={{ __html: tag.content }}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
