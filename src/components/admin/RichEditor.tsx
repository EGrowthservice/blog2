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
  Upload,
  Table,
  Minus,
  Video,
  FileCode,
  Loader2,
} from 'lucide-react';
import { sanitizeHtmlContent } from '@/lib/utils';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('edit');
  const [uploadingImage, setUploadingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const url = prompt('Nhập đường dẫn liên kết URL (vd: https://example.com):');
    if (url) {
      insertTag(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>', 'Văn bản liên kết');
    }
  };

  const handleInsertImageByUrl = () => {
    const url = prompt('Nhập URL hình ảnh trực tiếp:');
    const alt = prompt('Nhập chú thích hình ảnh (Alt Text cho SEO):', 'Hình ảnh minh họa');
    if (url) {
      insertTag(
        `<figure class="my-6">\n  <img src="${url}" alt="${alt || 'Hình ảnh'}" class="w-full rounded-2xl shadow-md" />\n  <figcaption class="text-xs text-center text-slate-500 mt-2">${alt || ''}</figcaption>\n</figure>\n`
      );
    }
  };

  const handleUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        insertTag(
          `<figure class="my-6">\n  <img src="${data.url}" alt="${alt}" class="w-full rounded-2xl shadow-md" />\n  <figcaption class="text-xs text-center text-slate-500 mt-2">${alt}</figcaption>\n</figure>\n`
        );
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

  const handleInsertVideo = () => {
    const embed = prompt('Nhập đường dẫn nhúng YouTube/Video (vd: https://www.youtube.com/embed/XXXX):');
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
        <th class="px-4 py-3 text-left font-bold text-slate-900">Tiêu đề 1</th>
        <th class="px-4 py-3 text-left font-bold text-slate-900">Tiêu đề 2</th>
        <th class="px-4 py-3 text-left font-bold text-slate-900">Trạng thái</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 text-sm">
      <tr>
        <td class="px-4 py-3 font-medium text-slate-900">Dữ liệu 1</td>
        <td class="px-4 py-3 text-slate-600">Mô tả nội dung</td>
        <td class="px-4 py-3 text-emerald-600 font-semibold">Hoạt động</td>
      </tr>
      <tr>
        <td class="px-4 py-3 font-medium text-slate-900">Dữ liệu 2</td>
        <td class="px-4 py-3 text-slate-600">Chi tiết bổ sung</td>
        <td class="px-4 py-3 text-slate-600">Tiêu chuẩn</td>
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
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white">Chế độ soạn thảo HTML trực tiếp</span>
          <span className="text-slate-400 hidden sm:inline">
            — Hỗ trợ đầy đủ thẻ HTML (`&lt;p&gt;`, `&lt;h2&gt;`, `&lt;img&gt;`, `&lt;iframe&gt;`, `&lt;table&gt;`)
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              viewMode === 'edit'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Soạn HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
              viewMode === 'split'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Chia đôi</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
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

      {/* HTML Quick Insertion Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1">
        <button
          type="button"
          title="Chèn đoạn văn <p>"
          onClick={() => insertTag('<p>', '</p>\n', 'Nội dung đoạn văn ở đây...')}
          className="px-2 py-1 rounded-lg hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition cursor-pointer"
        >
          &lt;p&gt;
        </button>
        <button
          type="button"
          title="Tiêu đề 1 <h1>"
          onClick={() => insertTag('<h1>', '</h1>\n', 'Tiêu đề chính')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Tiêu đề 2 <h2>"
          onClick={() => insertTag('<h2>', '</h2>\n', 'Tiêu đề phụ')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Tiêu đề 3 <h3>"
          onClick={() => insertTag('<h3>', '</h3>\n', 'Tiêu đề mục nhỏ')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          title="In đậm <b>"
          onClick={() => insertTag('<strong>', '</strong>', 'chữ in đậm')}
          className="px-2 py-1 rounded-lg hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
        >
          &lt;b&gt;
        </button>
        <button
          type="button"
          title="In nghiêng <i>"
          onClick={() => insertTag('<em>', '</em>', 'chữ in nghiêng')}
          className="px-2 py-1 rounded-lg hover:bg-slate-200 text-slate-800 italic text-xs cursor-pointer"
        >
          &lt;i&gt;
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          title="Danh sách không thứ tự <ul>"
          onClick={() => insertTag('<ul>\n  <li>', '</li>\n  <li>Mục 2</li>\n</ul>\n', 'Mục 1')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Danh sách có thứ tự <ol>"
          onClick={() => insertTag('<ol>\n  <li>', '</li>\n  <li>Bước 2</li>\n</ol>\n', 'Bước 1')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Trích dẫn <blockquote>"
          onClick={() => insertTag('<blockquote>\n  <p>"', '"</p>\n</blockquote>\n', 'Trích dẫn đáng chú ý')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          title="Chèn liên kết <a>"
          onClick={handleInsertLink}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Upload image to Supabase button */}
        <button
          type="button"
          title="Tải ảnh lên Supabase Storage và chèn vào bài viết"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingImage}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition cursor-pointer border border-indigo-200"
        >
          {uploadingImage ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          <span>Tải ảnh lên</span>
        </button>

        <button
          type="button"
          title="Chèn ảnh qua link URL <img>"
          onClick={handleInsertImageByUrl}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          title="Nhúng Video YouTube/Vimeo"
          onClick={handleInsertVideo}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Video className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Chèn bảng biểu <table>"
          onClick={handleInsertTable}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Table className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Đường kẻ ngang phân cách <hr>"
          onClick={() => insertTag('<hr class="my-8 border-slate-200" />\n')}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Hidden file input for Supabase upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUploadImageFile}
          className="hidden"
        />
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
              placeholder="<!-- Soạn thảo hoặc dán mã HTML bài viết tại đây -->&#10;<p>Bắt đầu viết nội dung bài báo với các thẻ HTML...</p>"
              className="w-full h-full min-h-[500px] p-5 font-mono text-sm text-slate-800 bg-white focus:outline-none resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>
        )}

        {/* Live Sanitized Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex-1 p-6 overflow-y-auto max-h-[800px] bg-slate-50/50">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-200 flex items-center justify-between">
              <span>Xem trước kết quả HTML hiển thị</span>
              <span className="text-emerald-600 font-semibold">Bản xem trước trực tiếp</span>
            </div>
            <div
              className="article-body prose prose-slate max-w-none text-slate-800"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtmlContent(
                  value || '<p class="text-slate-400 italic">Chưa có nội dung. Hãy nhập mã HTML ở khung bên trái...</p>'
                ),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
