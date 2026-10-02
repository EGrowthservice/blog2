'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Flag,
  CheckCircle,
  AlertCircle,
  X,
  ShieldAlert,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CommentItem {
  _id: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  reportsCount?: number;
}

interface CommentSectionProps {
  postId: string;
  postTitle?: string;
}

const REPORT_REASONS = [
  'Spam or advertising',
  'Harassment or hate speech',
  'False or misleading information',
  'Inappropriate or offensive content',
  'Other violation',
];

export default function CommentSection({ postId, postTitle }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reporting State
  const [reportingTarget, setReportingTarget] = useState<{
    type: 'comment' | 'article';
    id: string;
    title?: string;
  } | null>(null);
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.comments) {
          setComments(data.comments);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!authorName.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!content.trim()) {
      setError('Comment content cannot be empty.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          content: content.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit comment');
      }

      if (data.comment) {
        setComments([data.comment, ...comments]);
        setContent('');
        setSuccessMsg('Your comment has been posted successfully!');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Error submitting comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReport = (type: 'comment' | 'article', id: string, title?: string) => {
    setReportingTarget({ type, id, title });
    setSelectedReason(REPORT_REASONS[0]);
    setReportDetails('');
    setReportDone(false);
  };

  const handleSubmitReport = async () => {
    if (!reportingTarget) return;
    setReportSubmitting(true);

    try {
      const url =
        reportingTarget.type === 'comment'
          ? `/api/comments/${reportingTarget.id}/report`
          : '/api/reports';

      const payload =
        reportingTarget.type === 'comment'
          ? { reason: selectedReason, details: reportDetails }
          : {
              targetType: 'article',
              targetId: reportingTarget.id,
              reason: selectedReason,
              details: reportDetails,
            };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      setReportDone(true);
      setTimeout(() => {
        setReportingTarget(null);
        setReportDone(false);
      }, 2500);
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message || 'Error submitting report');
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <section className="pt-10 mt-12 border-t border-slate-200 space-y-8">
      {/* Header with Comment count & Article Report Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Discussion ({comments.length})
          </h3>
        </div>

        <button
          type="button"
          onClick={() => handleOpenReport('article', postId, postTitle)}
          className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition flex items-center gap-1.5 cursor-pointer"
          title="Report this article for factual inaccuracy or policy violation"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Report Article</span>
        </button>
      </div>

      {/* Guest Comment Submission Box */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Leave a Comment</h4>
          <span className="text-[11px] text-slate-400 font-medium">No account required</span>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your Name *"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="Your Email (Optional, kept private)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Join the discussion. Share your perspective respectfully..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-slate-400">
              Comments are moderated to maintain courteous, thoughtful discourse.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center bg-slate-50/60 rounded-2xl border border-slate-100 text-xs text-slate-400">
            No comments yet. Be the first to start the conversation!
          </div>
        ) : (
          comments.map((c) => {
            const initial = c.authorName ? c.authorName.charAt(0).toUpperCase() : '?';
            return (
              <div
                key={c._id}
                className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {initial}
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block leading-tight">
                        {c.authorName}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Report Comment Flag Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenReport('comment', c._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Report this comment"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-11 whitespace-pre-line">
                  {c.content}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Report Modal */}
      {reportingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">
                  {reportingTarget.type === 'article' ? 'Report Article' : 'Report Comment'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReportingTarget(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportDone ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Thank you for reporting</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Our editorial moderation desk has received your notice and will review it promptly.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Help us maintain honest, respectful standards. Please specify the issue:
                </p>

                <div className="space-y-2">
                  {REPORT_REASONS.map((r) => (
                    <label
                      key={r}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800 transition"
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={r}
                        checked={selectedReason === r}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide any relevant context..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportingTarget(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={reportSubmitting}
                    onClick={handleSubmitReport}
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-rose-600/20 cursor-pointer"
                  >
                    {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
