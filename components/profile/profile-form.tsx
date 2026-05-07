"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

export function ProfileForm({ user }: { user: { name: string | null; bio: string | null } }) {
  const [name, setName] = useState(user.name ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", name);
    fd.append("bio", bio);
    startTransition(async () => {
      const res = await updateProfile(fd);
      if (res?.success) toast.success("Profile updated");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-medium text-ink">Edit profile</h3>
      <div className="space-y-1.5">
        <Label htmlFor="name">Display name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={50} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A little about you…" maxLength={200} rows={3} />
        <p className="text-xs text-slate-400 text-right">{bio.length}/200</p>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
