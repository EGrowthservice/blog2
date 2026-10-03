'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Table as TableIcon,
  Video,
  Undo,
  Redo,
  Code,
  Eye,
  FileText,
  ChevronDown,
  Loader2,
  Type,
  Indent,
  Outdent,
  Palette,
  Eraser,
  Sparkles,
} from 'lucide-react';
import { sanitizeHtmlContent } from '@/lib/utils';
import {
  cleanWordAndHtml,
  isMarkdownText,
  convertMarkdownToHtml,
  convertPlainTextToHtml,
  calculateWordCount,
  escapeHtml,
} from '@/lib/editor-utils';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const [viewMode, setViewMode] = useState<'visual' | 'html' | 'preview'>('visual');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  // Popover states
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);

  // Modal dialog states
  const [modalType, setModalType] = useState<'link' | 'image-url' | 'video' | 'table' | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);

  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageAlign, setImageAlign] = useState<'center' | 'left' | 'right'>('center');

  const [videoUrl, setVideoUrl] = useState('');
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastEmittedValue = useRef<string>(value || '');
  const savedSelectionRange = useRef<Range | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>(value || '');

  // Sync external value changes into contentEditable and textarea
  useEffect(() => {
    if (editorRef.current) {
      if (value !== lastEmittedValue.current && editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
        lastEmittedValue.current = value || '';
      }
    }
    if (textareaRef.current) {
      if (textareaRef.current.value !== (value || '')) {
        textareaRef.current.value = value || '';
      }
    }
  }, [value]);

  // Initial mount: ensure content is rendered in editor
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
      lastEmittedValue.current = value;
    }
    if (textareaRef.current && !textareaRef.current.value && value) {
      textareaRef.current.value = value;
    }
  }, [value]);

  const notifyChange = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    // Normalize empty content
    const cleanHtml = html === '<p><br></p>' || html === '<p></p>' || html === '<br>' ? '' : html;
    lastEmittedValue.current = cleanHtml;
    onChange(cleanHtml);
  }, [onChange]);

  // View switcher that prevents any data loss
  const handleSwitchView = (newMode: 'visual' | 'html' | 'preview') => {
    if (newMode === viewMode) return;

    // Leaving visual mode: capture current visual HTML
    if (viewMode === 'visual' && editorRef.current) {
      const html = editorRef.current.innerHTML;
      const cleanHtml = html === '<p><br></p>' || html === '<p></p>' || html === '<br>' ? '' : html;
      lastEmittedValue.current = cleanHtml;
      onChange(cleanHtml);
      setPreviewHtml(cleanHtml);
      if (textareaRef.current) {
        textareaRef.current.value = cleanHtml;
      }
    }

    // Leaving html mode: sync textarea into editorRef
    if (viewMode === 'html' && textareaRef.current) {
      const html = textareaRef.current.value;
      lastEmittedValue.current = html;
      onChange(html);
      setPreviewHtml(html);
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
      }
    }

    // Entering visual mode
    if (newMode === 'visual') {
      if (editorRef.current) {
        if (viewMode === 'html' && textareaRef.current) {
          editorRef.current.innerHTML = textareaRef.current.value;
        } else if (!editorRef.current.innerHTML && (value || previewHtml)) {
          editorRef.current.innerHTML = previewHtml || value || '';
        }
      }
    }

    // Entering html mode
    if (newMode === 'html') {
      if (textareaRef.current) {
        const currentHtml =
          viewMode === 'visual' && editorRef.current
            ? editorRef.current.innerHTML
            : value || previewHtml;
        textareaRef.current.value = currentHtml || '';
      }
    }

    // Entering preview mode
    if (newMode === 'preview') {
      const currentHtml =
        viewMode === 'html' && textareaRef.current
          ? textareaRef.current.value
          : editorRef.current
          ? editorRef.current.innerHTML
          : value;
      setPreviewHtml(currentHtml || '');
    }

    setViewMode(newMode);
  };

  // Save selection before opening modal
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Restore selection after closing modal
  const restoreSelection = () => {
    if (savedSelectionRange.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRange.current);
      }
    } else if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const executeCmd = (cmd: string, arg?: string) => {
    if (viewMode !== 'visual') return;
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    notifyChange();
  };

  const applyHeading = (tag: string) => {
    if (viewMode !== 'visual') return;
    editorRef.current?.focus();
    setShowHeadingMenu(false);
    // Format block with tag
    document.execCommand('formatBlock', false, tag);
    notifyChange();
  };

  const setLineSpacing = (spacing: string) => {
    if (viewMode !== 'visual') return;
    editorRef.current?.focus();
    setShowSpacingMenu(false);

    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    let node: Node | null = sel.anchorNode;
    let applied = false;

    while (node && node !== editorRef.current) {
      if (node.nodeType === 1) {
        const el = node as HTMLElement;
        if (/^(P|H1|H2|H3|H4|DIV|LI|BLOCKQUOTE)$/i.test(el.tagName)) {
          el.style.lineHeight = spacing;
          applied = true;
          break;
        }
      }
      node = node.parentNode;
    }

    if (!applied && editorRef.current) {
      // If cursor is in general text, wrap or apply to editor selection
      document.execCommand('formatBlock', false, '<p>');
      const currentSel = window.getSelection();
      const parent = currentSel?.anchorNode?.parentElement;
      if (parent && parent !== editorRef.current) {
        parent.style.lineHeight = spacing;
      }
    }

    notifyChange();
  };

  // Insert custom HTML fragment at cursor position
  const insertHtmlAtSelection = (html: string) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
      if (editorRef.current) {
        editorRef.current.innerHTML += html;
        notifyChange();
      }
      return;
    }

    const range = sel.getRangeAt(0);
    range.deleteContents();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node: ChildNode | null;
    let lastNode: ChildNode | null = null;

    while ((node = tempDiv.firstChild)) {
      lastNode = frag.appendChild(node);
    }

    range.insertNode(frag);

    if (lastNode) {
      const newRange = range.cloneRange();
      newRange.setStartAfter(lastNode);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }

    notifyChange();
  };

  // SMART PASTE HANDLER
  // Allows copying formatted content from ChatGPT, Word, Google Docs, Notion, or Web pages
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');

    // Case 1: Rich HTML available (from Word, Google Docs, ChatGPT browser copy)
    if (htmlData && htmlData.trim()) {
      const cleaned = cleanWordAndHtml(htmlData);
      insertHtmlAtSelection(cleaned);
      setPasteNotice('Đã dán và định dạng chuẩn văn bản từ clipboard!');
      setTimeout(() => setPasteNotice(null), 3500);
      return;
    }

    // Case 2: Plain text with Markdown (from ChatGPT copy button or markdown files)
    if (textData && textData.trim()) {
      if (isMarkdownText(textData)) {
        const converted = convertMarkdownToHtml(textData);
        insertHtmlAtSelection(converted);
        setPasteNotice('Đã nhận diện định dạng ChatGPT và chuyển thành văn bản chuẩn!');
        setTimeout(() => setPasteNotice(null), 3500);
        return;
      }

      // Case 3: Standard plain text with paragraphs
      const htmlParagraphs = convertPlainTextToHtml(textData);
      insertHtmlAtSelection(htmlParagraphs || escapeHtml(textData));
      setPasteNotice('Đã dán văn bản!');
      setTimeout(() => setPasteNotice(null), 2500);
    }
  };

  // Handle direct file upload to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'articles');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Tải ảnh lên Supabase thất bại.');
      }

      if (data.url) {
        const alt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const figureHtml = `
<figure class="my-8 text-center">
  <img src="${data.url}" alt="${alt}" class="w-full max-w-3xl mx-auto rounded-2xl shadow-md object-cover" />
  <figcaption class="text-xs text-center text-slate-500 mt-2 italic">${alt}</figcaption>
</figure>
<p><br /></p>
`;
        insertHtmlAtSelection(figureHtml);
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      alert(errorObj.message || 'Lỗi khi tải ảnh lên.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Submit Modal actions
  const handleInsertLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    const target = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const text = linkText.trim() || linkUrl.trim();
    const html = `<a href="${linkUrl.trim()}"${target} class="text-indigo-600 underline underline-offset-3 hover:text-indigo-800 font-medium">${escapeHtml(text)}</a>`;
    insertHtmlAtSelection(html);
    setModalType(null);
    setLinkUrl('');
    setLinkText('');
  };

  const handleInsertImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    const alignClass =
      imageAlign === 'center'
        ? 'mx-auto text-center'
        : imageAlign === 'right'
        ? 'ml-auto text-right'
        : 'mr-auto text-left';

    const figureHtml = `
<figure class="my-8 ${alignClass}">
  <img src="${imageUrl.trim()}" alt="${escapeHtml(imageAlt) || 'Hình ảnh'}" class="max-w-full rounded-2xl shadow-md ${alignClass}" />
  ${imageAlt ? `<figcaption class="text-xs text-slate-500 mt-2 italic">${escapeHtml(imageAlt)}</figcaption>` : ''}
</figure>
<p><br /></p>
`;
    insertHtmlAtSelection(figureHtml);
    setModalType(null);
    setImageUrl('');
    setImageAlt('');
  };

  const handleInsertVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    let embedSrc = videoUrl.trim();
    const ytMatch = embedSrc.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      embedSrc = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    const videoHtml = `
<div class="aspect-video w-full my-8 rounded-2xl overflow-hidden shadow-lg bg-black">
  <iframe src="${embedSrc}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<p><br /></p>
`;
    insertHtmlAtSelection(videoHtml);
    setModalType(null);
    setVideoUrl('');
  };

  const handleInsertTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = Math.max(1, Math.min(tableRows, 20));
    const c = Math.max(1, Math.min(tableCols, 10));

    let tableHtml = `
<div class="overflow-x-auto my-8">
  <table class="min-w-full divide-y divide-slate-200 border border-slate-300 rounded-xl overflow-hidden shadow-xs">
    <thead class="bg-slate-100 text-slate-800 text-sm font-bold">
      <tr>
`;
    for (let j = 0; j < c; j++) {
      tableHtml += `        <th class="px-4 py-3 text-left border border-slate-200">Tiêu đề ${j + 1}</th>\n`;
    }
    tableHtml += `      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 text-sm text-slate-700">
`;
    for (let i = 0; i < r; i++) {
      tableHtml += `      <tr class="${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}">\n`;
      for (let j = 0; j < c; j++) {
        tableHtml += `        <td class="px-4 py-3 border border-slate-200">Nội dung ô ${i + 1}-${j + 1}</td>\n`;
      }
      tableHtml += `      </tr>\n`;
    }
    tableHtml += `    </tbody>
  </table>
</div>
<p><br /></p>
`;
    insertHtmlAtSelection(tableHtml);
    setModalType(null);
  };

  // Keyboard shortcut handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      executeCmd('bold');
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      executeCmd('italic');
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      executeCmd('underline');
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      executeCmd('undo');
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      executeCmd('redo');
    }
  };

  const wordStats = calculateWordCount(value || '');

  const textColors = [
    { label: 'Mặc định', color: '#0f172a' },
    { label: 'Xanh dương', color: '#2563eb' },
    { label: 'Chàm (Indigo)', color: '#4f46e5' },
    { label: 'Đỏ', color: '#dc2626' },
    { label: 'Xanh lá', color: '#16a34a' },
    { label: 'Cam', color: '#ea580c' },
    { label: 'Tím', color: '#9333ea' },
    { label: 'Xám đậm', color: '#475569' },
  ];

  const bgColors = [
    { label: 'Trong suốt', color: 'transparent' },
    { label: 'Vàng nhạt', color: '#fef08a' },
    { label: 'Xanh lơ nhạt', color: '#bae6fd' },
    { label: 'Xanh lá nhạt', color: '#bbf7d0' },
    { label: 'Hồng phấn', color: '#fbcfe8' },
    { label: 'Cam nhạt', color: '#fed7aa' },
    { label: 'Xám nhạt', color: '#e2e8f0' },
  ];

  return (
    <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">Soạn thảo bài viết chuẩn Word</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                WYSIWYG Trực quan
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Hỗ trợ dán trực tiếp từ ChatGPT, Microsoft Word, Google Docs - Giữ nguyên tiêu đề H1, H2, H3
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => handleSwitchView('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              viewMode === 'visual'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Soạn thảo (Word)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchView('html')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              viewMode === 'html'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Mã HTML</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchView('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem trước</span>
          </button>
        </div>
      </div>

      {/* Floating paste notification */}
      {pasteNotice && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-2 flex items-center justify-between animate-fadeIn transition">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span className="font-medium">{pasteNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setPasteNotice(null)}
            className="text-white/80 hover:text-white text-xs font-bold px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Word-like Ribbon Toolbar (Visible in Visual Mode) */}
      {viewMode === 'visual' && (
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-700 select-none">
          {/* Group 1: Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Hoàn tác (Ctrl+Z)"
              onClick={() => executeCmd('undo')}
              className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer text-slate-600"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Làm lại (Ctrl+Y)"
              onClick={() => executeCmd('redo')}
              className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer text-slate-600"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <div className="w-[1px] h-5 bg-slate-300 mx-1" />

          {/* Group 2: Headings / Style dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHeadingMenu(!showHeadingMenu);
                setShowSpacingMenu(false);
                setShowColorPicker(false);
                setShowBgColorPicker(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition cursor-pointer shadow-2xs"
            >
              <Type className="w-3.5 h-3.5 text-indigo-600" />
              <span>Kiểu chữ / Tiêu đề</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showHeadingMenu && (
              <div className="absolute left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => applyHeading('p')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between cursor-pointer"
                >
                  <span>Văn bản thường (Paragraph)</span>
                  <span className="text-[10px] text-slate-400 font-mono">&lt;p&gt;</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyHeading('h1')}
                  className="w-full text-left px-3 py-2 text-sm font-bold hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between cursor-pointer text-slate-900"
                >
                  <span className="flex items-center gap-1.5">
                    <Heading1 className="w-4 h-4 text-indigo-500" />
                    <span>Tiêu đề 1 (H1)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">28px</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyHeading('h2')}
                  className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between cursor-pointer text-slate-900"
                >
                  <span className="flex items-center gap-1.5">
                    <Heading2 className="w-4 h-4 text-indigo-500" />
                    <span>Tiêu đề 2 (H2)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">22px</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyHeading('h3')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between cursor-pointer text-slate-900"
                >
                  <span className="flex items-center gap-1.5">
                    <Heading3 className="w-4 h-4 text-indigo-500" />
                    <span>Tiêu đề 3 (H3)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">18px</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyHeading('h4')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between cursor-pointer text-slate-900"
                >
                  <span className="flex items-center gap-1.5">
                    <Heading4 className="w-4 h-4 text-indigo-500" />
                    <span>Tiêu đề 4 (H4)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">16px</span>
                </button>
              </div>
            )}
          </div>

          <div className="w-[1px] h-5 bg-slate-300 mx-1" />

          {/* Group 3: Formatting (Bold, Italic, Underline, Strikethrough) */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="In đậm (Ctrl+B)"
              onClick={() => executeCmd('bold')}
              className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer font-bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="In nghiêng (Ctrl+I)"
              onClick={() => executeCmd('italic')}
              className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Gạch chân (Ctrl+U)"
              onClick={() => executeCmd('underline')}
              className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Gạch ngang chữ"
              onClick={() => executeCmd('strikeThrough')}
              className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Xóa định dạng về chữ thường"
              onClick={() => executeCmd('removeFormat')}
              className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-red-600 transition cursor-pointer text-slate-500"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          <div className="w-[1px] h-5 bg-slate-300 mx-1" />

          {/* Group 4: Text color & Highlight color */}
          <div className="flex items-center gap-0.5 relative">
            <div className="relative">
              <button
                type="button"
                title="Màu chữ"
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowBgColorPicker(false);
                  setShowHeadingMenu(false);
                  setShowSpacingMenu(false);
                }}
                className="flex items-center gap-0.5 p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                <Palette className="w-4 h-4 text-indigo-600" />
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>
              {showColorPicker && (
                <div className="absolute left-0 mt-1 p-2 bg-white rounded-xl shadow-xl border border-slate-200 z-30 w-44 grid grid-cols-4 gap-1.5 animate-fadeIn">
                  {textColors.map((tc) => (
                    <button
                      key={tc.color}
                      type="button"
                      title={tc.label}
                      onClick={() => {
                        executeCmd('foreColor', tc.color);
                        setShowColorPicker(false);
                      }}
                      className="w-8 h-8 rounded-lg border border-slate-200 hover:scale-110 transition cursor-pointer flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: tc.color }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                title="Màu nền / Đánh dấu chữ"
                onClick={() => {
                  setShowBgColorPicker(!showBgColorPicker);
                  setShowColorPicker(false);
                  setShowHeadingMenu(false);
                  setShowSpacingMenu(false);
                }}
                className="flex items-center gap-0.5 p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                <span className="w-4 h-4 rounded bg-yellow-200 border border-yellow-400 font-bold text-[10px] flex items-center justify-center text-slate-800">
                  A
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>
              {showBgColorPicker && (
                <div className="absolute left-0 mt-1 p-2 bg-white rounded-xl shadow-xl border border-slate-200 z-30 w-44 grid grid-cols-4 gap-1.5 animate-fadeIn">
                  {bgColors.map((bc) => (
                    <button
                      key={bc.color}
                      type="button"
                      title={bc.label}
                      onClick={() => {
                        executeCmd('hiliteColor', bc.color);
                        setShowBgColorPicker(false);
                      }}
                      className="w-8 h-8 rounded-lg border border-slate-300 hover:scale-110 transition cursor-pointer flex items-center justify-center text-[10px] font-bold text-slate-800 shadow-xs"
                      style={{ backgroundColor: bc.color }}
                    >
                      {bc.color === 'transparent' ? '✕' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-[1px] h-5 bg-slate-300 mx-1" />

          {/* Group 5: Text Alignment (Căn lề) */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Căn trái"
              onClick={() => executeCmd('justifyLeft')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Căn giữa"
              onClick={() => executeCmd('justifyCenter')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Căn phải"
              onClick={() => executeCmd('justifyRight')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Căn đều 2 bên (Justify)"
              onClick={() => executeCmd('justifyFull')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          <div className="w-[1px] h-5 bg-slate-300 mx-1" />

          {/* Group 6: Line Spacing & Indent ("Căn cách dòng y như bản Word") */}
          <div className="relative">
            <button
              type="button"
              title="Khoảng cách dòng (Line Spacing)"
              onClick={() => {
                setShowSpacingMenu(!showSpacingMenu);
                setShowHeadingMenu(false);
                setShowColorPicker(false);
                setShowBgColorPicker(false);
              }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-medium text-slate-700 transition cursor-pointer shadow-2xs"
            >
              <span>Cách dòng</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showSpacingMenu && (
              <div className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-fadeIn text-xs">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Khoảng cách dòng
                </div>
                <button
                  type="button"
                  onClick={() => setLineSpacing('1.0')}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between cursor-pointer"
                >
                  <span>1.0 (Dòng đơn)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLineSpacing('1.25')}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between cursor-pointer"
                >
                  <span>1.25</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLineSpacing('1.5')}
                  className="w-full text-left px-3 py-1.5 font-medium hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between cursor-pointer"
                >
                  <span>1.5 (Chuẩn bài viết)</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Khuyên dùng</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLineSpacing('1.75')}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between cursor-pointer"
                >
                  <span>1.75 (Thoáng)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLineSpacing('2.0')}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between cursor-pointer"
                >
                  <span>2.0 (Dòng đôi)</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Giảm thụt lề"
              onClick={() => executeCmd('outdent')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <Outdent className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Tăng thụt lề"
              onClick={() => executeCmd('indent')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <Indent className="w-4 h-4" />
            </button>
          </div>

          <div className="w-[1px] h-5 bg-slate-300 mx-1" />

          {/* Group 7: Lists, Quote, Horizontal line */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Danh sách gạch đầu dòng"
              onClick={() => executeCmd('insertUnorderedList')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Danh sách số thứ tự"
              onClick={() => executeCmd('insertOrderedList')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Khối trích dẫn (Quote)"
              onClick={() => applyHeading('blockquote')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Đường kẻ ngang phân cách"
              onClick={() => insertHtmlAtSelection('<hr class="my-8 border-slate-300" /><p><br/></p>')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          <div className="w-[1px] h-5 bg-slate-300 mx-1" />

          {/* Group 8: Insert Media & Link */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              title="Chèn liên kết"
              onClick={() => {
                saveSelection();
                setModalType('link');
              }}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            {/* Direct Upload Image to Supabase */}
            <button
              type="button"
              title="Tải ảnh từ máy tính lên Supabase Storage"
              onClick={() => {
                saveSelection();
                fileInputRef.current?.click();
              }}
              disabled={uploadingImage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition cursor-pointer border border-indigo-200"
            >
              {uploadingImage ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Tải ảnh lên</span>
            </button>

            <button
              type="button"
              title="Chèn ảnh bằng link URL"
              onClick={() => {
                saveSelection();
                setModalType('image-url');
              }}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              title="Chèn bảng biểu"
              onClick={() => {
                saveSelection();
                setModalType('table');
              }}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <TableIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              title="Nhúng video YouTube"
              onClick={() => {
                saveSelection();
                setModalType('video');
              }}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <Video className="w-4 h-4" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Main Canvas Container */}
      <div className="min-h-[550px] relative bg-slate-100/70 p-4 sm:p-8 flex justify-center overflow-y-auto">
        {/* Mode 1: Visual Word-Like Document Canvas - NEVER UNMOUNT TO PREVENT DATA LOSS */}
        <div
          ref={editorRef}
          contentEditable
          onInput={notifyChange}
          onKeyUp={notifyChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          data-placeholder={
            placeholder ||
            'Bắt đầu viết nội dung bài viết hoặc dán (Ctrl+V) nội dung từ ChatGPT, Word, Google Docs vào đây...'
          }
          className={`w-full max-w-4xl bg-white shadow-sm border border-slate-200/80 rounded-xl p-8 sm:p-12 min-h-[500px] outline-none article-body prose prose-slate focus:ring-2 focus:ring-indigo-500/20 text-slate-800 transition leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:italic empty:before:pointer-events-none ${
            viewMode === 'visual' ? 'block' : 'hidden'
          }`}
          spellCheck={true}
        />

        {/* Mode 2: Raw HTML Textarea (For advanced users) - NEVER UNMOUNT */}
        <div
          className={`w-full max-w-4xl bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden ${
            viewMode === 'html' ? 'block' : 'hidden'
          }`}
        >
          <div className="bg-slate-800 text-slate-300 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-700">
            <span className="font-mono">Mã nguồn HTML bài viết (Chỉnh sửa trực tiếp)</span>
            <span className="text-slate-400">Tự động đồng bộ với giao diện Word</span>
          </div>
          <textarea
            ref={textareaRef}
            defaultValue={value}
            onChange={(e) => {
              const val = e.target.value;
              lastEmittedValue.current = val;
              onChange(val);
              setPreviewHtml(val);
              if (editorRef.current) {
                editorRef.current.innerHTML = val;
              }
            }}
            placeholder="Nhập hoặc dán mã HTML tại đây..."
            className="w-full min-h-[500px] p-6 font-mono text-xs sm:text-sm text-slate-800 bg-white focus:outline-none resize-y leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Mode 3: Live Preview on Site */}
        <div
          className={`w-full max-w-4xl bg-white shadow-sm border border-slate-200 rounded-xl p-8 sm:p-12 min-h-[500px] ${
            viewMode === 'preview' ? 'block' : 'hidden'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-6 pb-2 border-b border-slate-200 flex items-center justify-between">
            <span>Bản xem trước giao diện hiển thị cho người đọc</span>
            <span className="text-emerald-600 font-semibold">Live Preview</span>
          </div>
          <div
            className="article-body prose prose-slate max-w-none text-slate-800"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtmlContent(
                previewHtml || value || '<p class="text-slate-400 italic">Chưa có nội dung bài viết...</p>'
              ),
            }}
          />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="font-medium text-slate-700">
            Số từ: <span className="font-bold text-slate-900">{wordStats.words}</span>
          </span>
          <span>·</span>
          <span>
            Ký tự: <span className="font-semibold text-slate-800">{wordStats.chars}</span>
          </span>
          <span>·</span>
          <span>
            Thời gian đọc ước tính:{' '}
            <span className="font-semibold text-slate-800">{wordStats.readingTime} phút</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>Sẵn sàng dán trực tiếp từ ChatGPT & Word giữ nguyên định dạng</span>
        </div>
      </div>

      {/* MODAL: INSERT LINK */}
      {modalType === 'link' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-indigo-600" />
              <span>Chèn liên kết URL</span>
            </h3>
            <form onSubmit={handleInsertLinkSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ URL liên kết (bắt buộc)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Văn bản hiển thị (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Nhập chữ hiển thị nếu muốn..."
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={linkNewTab}
                  onChange={(e) => setLinkNewTab(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Mở trong thẻ mới (target=&quot;_blank&quot;)</span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Chèn liên kết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INSERT IMAGE BY URL */}
      {modalType === 'image-url' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              <span>Chèn ảnh từ đường link URL</span>
            </h3>
            <form onSubmit={handleInsertImageSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đường dẫn URL hình ảnh (bắt buộc)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chú thích ảnh / Thẻ Alt (SEO)
                </label>
                <input
                  type="text"
                  placeholder="Chú thích dưới ảnh và mô tả SEO..."
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Căn lề hiển thị
                </label>
                <select
                  value={imageAlign}
                  onChange={(e) => setImageAlign(e.target.value as 'center' | 'left' | 'right')}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="center">Căn giữa (Khuyên dùng)</option>
                  <option value="left">Căn trái</option>
                  <option value="right">Căn phải</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Chèn hình ảnh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INSERT VIDEO */}
      {modalType === 'video' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-600" />
              <span>Nhúng Video YouTube / Vimeo</span>
            </h3>
            <form onSubmit={handleInsertVideoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Link video YouTube
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=XXXXX hoặc youtu.be/XXXXX"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Nhúng video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INSERT TABLE */}
      {modalType === 'table' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-indigo-600" />
              <span>Tạo bảng biểu mới</span>
            </h3>
            <form onSubmit={handleInsertTableSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số hàng (Rows)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={tableRows}
                    onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số cột (Columns)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={tableCols}
                    onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Tạo bảng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
