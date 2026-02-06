import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Check, CornerDownRight } from 'lucide-react';
import type { Comment } from '../../lib/teamService';

interface CommentThreadProps {
  comments: Comment[];
  currentUserId: string;
  onAddComment: (content: string, parentId?: string) => void;
  onResolve: (commentId: string) => void;
  onDelete: (commentId: string) => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comments,
  currentUserId,
  onAddComment,
  onResolve,
  onDelete,
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const topLevelComments = comments.filter(c => !c.parent_id);

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  return (
    <div className="w-80 bg-[#171717] border-l border-neutral-800 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-lime-400" />
          <h3 className="font-semibold text-white">Comments</h3>
          <span className="px-2 py-0.5 bg-neutral-800 rounded-full text-xs text-neutral-400">
            {comments.length}
          </span>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={48} className="mx-auto mb-4 text-neutral-700" />
            <p className="text-neutral-500 text-sm">No comments yet</p>
            <p className="text-neutral-600 text-xs mt-1">Start the conversation</p>
          </div>
        ) : (
          topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={comments.filter(c => c.parent_id === comment.id)}
              currentUserId={currentUserId}
              isReplying={replyingTo === comment.id}
              isExpanded={expandedComments.has(comment.id)}
              onReply={() => setReplyingTo(comment.id)}
              onCancelReply={() => setReplyingTo(null)}
              onSubmitReply={(content) => {
                onAddComment(content, comment.id);
                setReplyingTo(null);
              }}
              onResolve={() => onResolve(comment.id)}
              onDelete={() => onDelete(comment.id)}
              onToggleReplies={() => toggleReplies(comment.id)}
            />
          ))
        )}
      </div>

      {/* New Comment Input */}
      <div className="p-4 border-t border-neutral-800">
        <CommentInput
          placeholder="Add a comment..."
          onSubmit={onAddComment}
        />
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  currentUserId: string;
  isReplying: boolean;
  isExpanded: boolean;
  onReply: () => void;
  onCancelReply: () => void;
  onSubmitReply: (content: string) => void;
  onResolve: () => void;
  onDelete: () => void;
  onToggleReplies: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  replies,
  currentUserId,
  isReplying,
  isExpanded,
  onReply,
  onCancelReply,
  onSubmitReply,
  onResolve,
  onDelete,
  onToggleReplies,
}) => {
  const isOwn = comment.user_id === currentUserId;
  const hasReplies = replies.length > 0;

  return (
    <div className={`space-y-3 ${comment.resolved ? 'opacity-50' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-500/30 to-lime-600/10 flex items-center justify-center">
            <span className="text-xs font-medium text-lime-400">
              {comment.user?.email?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">
                {comment.user?.user_metadata?.full_name || comment.user?.email?.split('@')[0] || 'Unknown'}
              </span>
              <span className="text-xs text-neutral-500">
                {formatTime(comment.created_at)}
              </span>
              {comment.resolved && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded">
                  <Check size={10} />
                  Resolved
                </span>
              )}
            </div>

            {isOwn && !comment.resolved && (
              <div className="flex items-center gap-1">
                <button
                  onClick={onResolve}
                  className="p-1 text-neutral-500 hover:text-green-400 transition-colors"
                  title="Resolve"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={onReply}
              className="text-xs text-neutral-500 hover:text-lime-400 transition-colors"
            >
              Reply
            </button>
            {hasReplies && (
              <button
                onClick={onToggleReplies}
                className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
              >
                <CornerDownRight size={12} />
                {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-3">
              <CommentInput
                placeholder="Write a reply..."
                onSubmit={onSubmitReply}
                autoFocus
                onCancel={onCancelReply}
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {hasReplies && isExpanded && (
        <div className="ml-11 space-y-3 border-l-2 border-neutral-800 pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] text-neutral-400">
                  {reply.user?.email?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">
                    {reply.user?.user_metadata?.full_name || reply.user?.email?.split('@')[0] || 'Unknown'}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {formatTime(reply.created_at)}
                  </span>
                </div>
                <p className="text-sm text-neutral-400">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface CommentInputProps {
  placeholder?: string;
  onSubmit: (content: string) => void;
  autoFocus?: boolean;
  onCancel?: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  placeholder = 'Add a comment...',
  onSubmit,
  autoFocus = false,
  onCancel,
}) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape' && onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={2}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500 resize-none"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs font-medium rounded-lg transition-colors"
        >
          <Send size={12} />
          Send
        </button>
      </div>
    </div>
  );
};

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
