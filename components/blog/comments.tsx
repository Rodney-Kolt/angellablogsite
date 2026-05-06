"use client";

import { useState, useTransition } from "react";
import { addComment, deleteComment } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, getInitials } from "@/lib/utils";
import { Trash2, Send, MessageCircle } from "lucide-react";
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
      toast("sign in to leave a note 🌸");
      return;
    }

    startTransition(async () => {
      const result = await addComment(postId, text);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("note left! 🌸");
        setText("");
        // Refresh will happen via revalidatePath
      }
    });
  };

  const handleDelete = (commentId: string) => {
    startTransition(async () => {
      try {
        await deleteComment(commentId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success("note removed");
      } catch {
        toast.error("couldn't delete that note");
      }
    });
  };

  return (
    <section className="mt-10">
      <h3 className="font-heading text-xl text-pink-800 mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-pink-400" />
        little notes ({comments.length})
      </h3>

      {/* Comment form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div
            className="relative p-4 rounded-3xl border-2 border-pink-200 bg-white/80"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 27px, #fce7f3 27px, #fce7f3 28px)",
              backgroundSize: "100% 28px",
              backgroundPositionY: "4px",
            }}
          >
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="leave a little note... 🌸"
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-handwriting text-base text-pink-700 placeholder:text-pink-300 resize-none min-h-[80px]"
              maxLength={1000}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-body text-xs text-pink-300">
              {text.length}/1000
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !text.trim()}
            >
              <Send className="w-3.5 h-3.5" />
              send note
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded-3xl border-2 border-dashed border-pink-200 text-center">
          <p className="font-body text-sm text-pink-400">
            <a href="/login" className="text-pink-600 hover:underline font-semibold">
              sign in
            </a>{" "}
            to leave a little note 🌸
          </p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <div className="text-center py-8">
            <p className="font-handwriting text-pink-300 text-lg">
              no notes yet... be the first! 🌸
            </p>
          </div>
        )}

        {comments.map((comment) => (
          <div
            key={comment.id}
            className="relative p-4 rounded-3xl border border-pink-100 bg-white/80"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 27px, #fce7f3 27px, #fce7f3 28px)",
              backgroundSize: "100% 28px",
              backgroundPositionY: "4px",
            }}
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
                  <span className="font-body text-xs font-semibold text-pink-700">
                    {comment.user.name ?? "anonymous"}
                  </span>
                  <span className="font-body text-xs text-pink-300">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="font-handwriting text-sm text-pink-800 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>

              {/* Delete button */}
              {(currentUserId === comment.user.id || isOwner) && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={isPending}
                  className="text-pink-200 hover:text-pink-400 transition-colors flex-shrink-0"
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
