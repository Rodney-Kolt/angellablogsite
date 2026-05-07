"use client";

import { useState, useTransition } from "react";
import { deletePost } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function DeletePostButton({ postId, postTitle }: { postId: string; postTitle: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deletePost(postId);
        toast.success("memory removed ✦");
        setOpen(false);
      } catch (err: unknown) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") toast.error("couldn't delete");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-coral-400" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading text-navy">delete this memory? 🌊</DialogTitle>
          <DialogDescription className="font-body text-navy-muted">
            Are you sure you want to delete <strong>"{postTitle}"</strong>? This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>keep it</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {isPending ? "deleting..." : "yes, delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
