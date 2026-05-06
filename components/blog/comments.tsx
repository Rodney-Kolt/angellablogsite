"use client";

import { useState, useTransition } from "react";
import { addComment, deleteComment } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, getInitials } from "@/lib/utils";
import { Trash2, Send, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

interface CommentUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  user: CommentUser;
}

interface CommentsProps {
  postId: string;
  comments: CommentData[];
  currentUserId?: string;
  isOwner?: boolean;
  isLoggedIn: boolean;
}

export function Comments({
  postId,
  comments: initialComments,
  currentUserId,
  isOwner,
  isLoggedIn,
}: CommentsProps) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!isLoggedIn) {
      toast("sign in to drop a comment 🏀");
      return;
    }

    startTransition(async () => {
      const result = await addComment(postId, text);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("comment dropped! 🏀");
        setText("");
      }
    });
  };

  const handleDelete = (commentId: string) => {
    startTransition(async () => {
      try {
        await deleteComment(commentId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success("comment removed");
      } catch {
        toast.error("couldn't delete that comment");
      }
    });
  };

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-5 h-5 text-hoop-orange" />
        <h3 className="font-heading text-xl text-white tracking-widest">
          LOCKER ROOM
        </h3>
        <span className="font-body text-xs text-slate-600 uppercase tracking-wider">
          ({comments.length} comments)
        </span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Comment form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {/* Chalkboard textarea */}
          <div className="chalkboard rounded-sm p-4 mb-2">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="drop your thoughts on the board..."
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-200 placeholder:text-slate-600 resize-none min-h-[80px] font-body text-sm"
              maxLength={1000}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body text-xs text-slate-600">
              {text.length}/1000
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !text.trim()}
            >
              <Send className="w-3.5 h-3.5" />
              Drop It
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded-sm border border-dashed border-slate-700 text-center chalkboard">
          <p className="font-body text-sm text-slate-500">
            <a href="/login" className="text-hoop-orange hover:underline font-semibold">
              Sign in
            </a>{" "}
            to drop a comment in the locker room 🏀
          </p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-3">
        {comments.length === 0 && (
          <div className="text-center py-10 chalkboard rounded-sm">
            <p className="font-heading text-slate-600 text-lg tracking-widest">
              BOARD IS EMPTY
            </p>
            <p className="font-body text-xs text-slate-700 mt-1">
              be the first to write on the board
            </p>
          </div>
        )}

        {comments.map((comment) => (
          <div
            key={comment.id}
            className="chalkboard rounded-sm p-4"
          >
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={comment.user.image ?? ""} />
                <AvatarFallback className="text-xs">
                  {getInitials(comment.user.name ?? comment.user.id)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-body text-xs font-semibold text-hoop-orange uppercase tracking-wider">
                    {comment.user.name ?? "anonymous"}
                  </span>
                  <span className="font-body text-xs text-slate-600">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="font-body text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>

              {(currentUserId === comment.user.id || isOwner) && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={isPending}
                  className="text-slate-700 hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label="Delete comment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
