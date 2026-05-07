"use client";

import { useState, useTransition } from "react";
import { addComment, deleteComment } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, getInitials } from "@/lib/utils";
import { Trash2, Send, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface CommentUser { id: string; name: string | null; image: string | null }
interface CommentData { id: string; content: string; createdAt: Date; user: CommentUser }

interface CommentsProps {
  postId: string;
  comments: CommentData[];
  currentUserId?: string;
  isOwner?: boolean;
  isLoggedIn: boolean;
}

// Sticky note colors
const NOTE_COLORS = [
  "bg-yellow-50 border-yellow-200",
  "bg-sky-pale border-sky-light",
  "bg-aqua-50 border-aqua-200",
  "bg-pink-50 border-pink-200",
];

export function Comments({ postId, comments: init, currentUserId, isOwner, isLoggedIn }: CommentsProps) {
  const [comments, setComments] = useState(init);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!isLoggedIn) { toast("Sign in to leave a note 🌊"); return; }
    startTransition(async () => {
      const res = await addComment(postId, text);
      if (res?.error) toast.error(res.error);
      else { toast.success("Note pinned! 📌"); setText(""); }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteComment(id);
        setComments((p) => p.filter((c) => c.id !== id));
        toast.success("Note removed");
      } catch { toast.error("Couldn't remove note"); }
    });
  };

  return (
    <section className="mt-10">
      <h3 className="font-heading text-2xl text-navy mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-aqua-400" />
        little notes ✦ ({comments.length})
      </h3>

      {/* Form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="sticky-note mb-3">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="leave a little note here... 🌊"
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-handwriting text-base text-navy placeholder:text-yellow-400 resize-none min-h-[80px]"
              maxLength={1000}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body text-xs text-navy-faint">{text.length}/1000</span>
            <Button type="submit" size="sm" variant="coral" disabled={isPending || !text.trim()}>
              <Send className="w-3.5 h-3.5" />
              Pin note
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded-2xl border-2 border-dashed border-aqua-300 bg-white/60 text-center">
          <p className="font-body text-sm text-navy-muted">
            <Link href="/login" className="text-coral-400 hover:underline font-semibold">Sign in</Link> to leave a little note 🌊
          </p>
        </div>
      )}

      {/* Sticky notes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {comments.length === 0 && (
          <div className="col-span-2 text-center py-10">
            <p className="font-handwriting text-xl text-aqua-400">no notes yet... be the first! 🌊</p>
          </div>
        )}
        {comments.map((c, i) => {
          const colorClass = NOTE_COLORS[i % NOTE_COLORS.length];
          const rotation = ((c.id.charCodeAt(0) % 5) - 2) * 0.5;
          return (
            <div
              key={c.id}
              className={`relative p-4 rounded-sm border-2 shadow-sticky ${colorClass}`}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-5 bg-aqua-200/60 rounded-sm" />

              <div className="flex items-start gap-2 mb-2">
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarImage src={c.user.image ?? ""} />
                  <AvatarFallback className="text-xs">{getInitials(c.user.name ?? c.user.id)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <span className="font-handwriting text-sm text-navy font-semibold">{c.user.name ?? "anonymous"}</span>
                  <span className="font-body text-xs text-navy-faint ml-2">{formatDate(c.createdAt)}</span>
                </div>
                {(currentUserId === c.user.id || isOwner) && (
                  <button onClick={() => handleDelete(c.id)} disabled={isPending} className="text-navy-faint hover:text-coral-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="font-handwriting text-sm text-navy leading-relaxed whitespace-pre-wrap">{c.content}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
