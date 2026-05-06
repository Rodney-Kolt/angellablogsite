"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

interface ProfileFormProps {
  user: { name: string | null; bio: string | null };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", name);
    fd.append("bio", bio);
    startTransition(async () => {
      const result = await updateProfile(fd);
      if (result?.success) toast.success("profile updated 🏀");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-heading text-sm text-hoop-orange tracking-widest">
        EDIT PROFILE
      </h3>
      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="your player name"
          maxLength={50}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="tell the court about yourself..."
          maxLength={200}
          rows={3}
        />
        <p className="font-body text-xs text-slate-700 text-right">
          {bio.length}/200
        </p>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
