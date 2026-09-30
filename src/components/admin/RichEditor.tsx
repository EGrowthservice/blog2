'use client';

import { useState, useRef } from 'react';
import {
  Code,
  Eye,
  Columns,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table,
  Minus,
  Video,
  FileCode,
} from 'lucide-react';
import { sanitizeHtmlContent } from '@/lib/utils';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultText;

    const newText =
      textarea.value.substring(0, start) +
      before +
      selectedText +
      after +
      textarea.value.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 50);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL (e.g. https://example.com):');
    if (url) {
      insertTag(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>', 'Link Text');
    }
  };

  const handleInsertImage = () => {
    const url = prompt('Enter Image URL:');
    const alt = prompt('Enter Image Alt Text (for SEO):', 'Illustration');
    if (url) {
      insertTag(
        `<figure class="my-6">\n  <img src="${url}" alt="${alt || 'Image'}" class="w-full rounded-2xl shadow-md" />\n  <figcaption class="text-xs text-center text-slate-500 mt-2">${alt || ''}</figcaption>\n</figure>\n`
      );
    }
  };

  const handleInsertVideo = () => {
    const embed = prompt('Enter YouTube or Video Embed URL (e.g. https://www.youtube.com/embed/XXXX):');
    if (embed) {
      insertTag(
        `<div class="aspect-video w-full my-6 rounded-2xl overflow-hidden shadow-lg">\n  <iframe src="${embed}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n</div>\n`
      );
    }
  };

  const handleInsertTable = () => {
    const tableTemplate = `
<div class="overflow-x-auto my-6">
  <table class="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-xl">
    <thead class="bg-slate-50">
      <tr>
        <th class="px-4 py-3 text-left font-bold text-slate-900">Header 1</th>
        <th class="px-4 py-3 text-left font-bold text-slate-900">Header 2</th>
        <th class="px-4 py-3 text-left font-bold text-slate-900">Header 3</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 text-sm">
      <tr>
        <td class="px-4 py-3 font-medium text-slate-900">Row 1 Item</td>
        <td class="px-4 py-3 text-slate-600">Details</td>
        <td class="px-4 py-3 text-emerald-600 font-semibold">Active</td>
      </tr>
      <tr>
        <td class="px-4 py-3 font-medium text-slate-900">Row 2 Item</td>
        <td class="px-4 py-3 text-slate-600">Details</td>
        <td class="px-4 py-3 text-slate-600">Standard</td>
      </tr>
    </tbody>
  </table>
</div>
`;
    insertTag(tableTemplate);
  };

  return (
    <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Top Banner indicating HTML input mode */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-rose-400" />
          <span className="font-semibold text-white">Direct HTML Content Mode</span>
          <span className="text-slate-400 hidden sm:inline">
            — Paste or write raw HTML code (`&lt;p&gt;`, `&lt;h2&gt;`, `&lt;img&gt;`, `&lt;iframe&gt;`, `&lt;table&gt;`)
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              viewMode === 'edit'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>HTML Code</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              viewMode === 'split'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Rendered Preview</span>
          </button>
        </div>
      </div>

      {/* HTML Quick Insertion Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1">
        <button
          type="button"
          title="Insert Paragraph <p>"
          onClick={() => insertTag('<p>', '</p>\n', 'Enter paragraph text here...')}
          className="px-2 py-1 rounded-lg hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition cursor-pointer"
        >
          &lt;p&gt;
        </button>
        <button
          type="button"
          title="Heading 1 <h1>"
          onClick={() => insertTag('<h1>', '</h1>\n', 'Main Section Title')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Heading 2 <h2>"
          onClick={() => insertTag('<h2>', '</h2>\n', 'Sub Heading')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Heading 3 <h3>"
          onClick={() => insertTag('<h3>', '</h3>\n', 'Minor Section')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          title="Bold <strong>"
          onClick={() => insertTag('<strong>', '</strong>', 'bold text')}
          className="px-2 py-1 rounded-lg hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
        >
          &lt;b&gt;
        </button>
        <button
          type="button"
          title="Italic <em>"
          onClick={() => insertTag('<em>', '</em>', 'italic text')}
          className="px-2 py-1 rounded-lg hover:bg-slate-200 text-slate-800 italic text-xs cursor-pointer"
        >
          &lt;i&gt;
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          title="Unordered List <ul>"
          onClick={() => insertTag('<ul>\n  <li>', '</li>\n  <li>Item 2</li>\n</ul>\n', 'Item 1')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Ordered List <ol>"
          onClick={() => insertTag('<ol>\n  <li>', '</li>\n  <li>Step 2</li>\n</ol>\n', 'Step 1')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Blockquote <blockquote>"
          onClick={() => insertTag('<blockquote>\n  <p>"', '"</p>\n</blockquote>\n', 'Memorable quote or highlight')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          title="Insert Link <a>"
          onClick={handleInsertLink}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Insert Figure & Image <img>"
          onClick={handleInsertImage}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Insert Video Iframe"
          onClick={handleInsertVideo}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Video className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Insert Table"
          onClick={handleInsertTable}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Table className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Divider <hr>"
          onClick={() => insertTag('<hr class="my-8 border-slate-200" />\n')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Body */}
      <div className="min-h-[500px] flex">
        {/* Raw HTML Textarea */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`flex-1 ${viewMode === 'split' ? 'border-r border-slate-200' : ''}`}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="<!-- Write or paste your raw HTML article content here -->&#10;<p>Start typing your story with HTML markup...</p>"
              className="w-full h-full min-h-[500px] p-5 font-mono text-sm text-slate-800 bg-white focus:outline-none resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>
        )}

        {/* Live Sanitized Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex-1 p-6 overflow-y-auto max-h-[800px] bg-slate-50/50">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
              <span>Live Rendered HTML Output</span>
              <span className="text-emerald-600 font-semibold">Active Preview</span>
            </div>
            <div
              className="article-body prose prose-slate max-w-none text-slate-800"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtmlContent(
                  value || '<p class="text-slate-400 italic">No HTML content yet. Type or paste HTML on the left...</p>'
                ),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
