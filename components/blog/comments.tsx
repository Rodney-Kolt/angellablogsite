"use client";

import { useState, useTransition } from "react";
import { addComment, deleteComment } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, getInitials } from "@/lib/utils";
import { Trash2, Send, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

interface CommentUser { id: string; name: string | null; image: string | null }
interface CommentData { id: string; content: string; createdAt: Date; user: CommentUser }

interface CommentsProps {
  postId: string;
  comments: CommentData[];
  currentUserId?: string;
  isOwner?: boolean;
  isLoggedIn: boolean;
}

export function Comments({ postId, comments: init, currentUserId, isOwner, isLoggedIn }: CommentsProps) {
  const [comments, setComments] = useState(init);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!isLoggedIn) { toast("Sign in to comment"); return; }
    startTransition(async () => {
      const res = await addComment(postId, text);
      if (res?.error) toast.error(res.error);
      else { toast.success("Comment added"); setText(""); }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteComment(id);
        setComments((p) => p.filter((c) => c.id !== id));
        toast.success("Deleted");
      } catch { toast.error("Could not delete"); }
    });
  };

  return (
    <section>
      <h3 className="font-serif text-xl text-ink mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-400" />
        {comments.length} {comments.length === 1 ? "comment" : "comments"}
      </h3>

      {/* Form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts…"
            className="mb-3"
            maxLength={1000}
            rows={3}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">{text.length}/1000</span>
            <Button type="submit" size="sm" disabled={isPending || !text.trim()}>
              <Send className="w-3.5 h-3.5" />
              Post comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded-xl border border-slate-200 bg-blue-50 text-center">
          <p className="text-sm text-slate-500">
            <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link> to leave a comment.
          </p>
        </div>
      )}

      {/* List */}
      <div className="space-y-5">
        {comments.length === 0 && (
          <p className="text-center text-slate-400 py-8 text-sm">No comments yet. Be the first!</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={c.user.image ?? ""} />
              <AvatarFallback className="text-xs">{getInitials(c.user.name ?? c.user.id)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-ink">{c.user.name ?? "Anonymous"}</span>
                <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{c.content}</p>
            </div>
            {(currentUserId === c.user.id || isOwner) && (
              <button onClick={() => handleDelete(c.id)} disabled={isPending} className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0 mt-1">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// Need Link import
import Link from "next/link";
