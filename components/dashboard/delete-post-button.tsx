"use client";

import { useState, useTransition } from "react";
import { deletePost } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeletePostButtonProps {
  postId: string;
  postTitle: string;
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deletePost(postId);
        toast.success("post deleted 🌸");
        setOpen(false);
      } catch (err: unknown) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
          toast.error("couldn't delete post");
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Delete post">
          <Trash2 className="w-4 h-4 text-red-400" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>delete this post? 🌙</DialogTitle>
          <DialogDescription>
            are you sure you want to delete{" "}
            <span className="font-semibold text-pink-700">"{postTitle}"</span>?
            this can't be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            keep it
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {isPending ? "deleting..." : "yes, delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
