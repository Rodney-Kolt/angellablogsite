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
  user: {
    name: string | null;
    bio: string | null;
  };
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
      if (result?.success) {
        toast.success("profile updated! 🌸");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-heading text-lg text-pink-700">edit profile</h3>
      <div className="space-y-2">
        <Label htmlFor="name">display name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="your name"
          maxLength={50}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="a little about you... 🌸"
          maxLength={200}
          rows={3}
        />
        <p className="font-body text-xs text-pink-300 text-right">
          {bio.length}/200
        </p>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {isPending ? "saving..." : "save changes"}
      </Button>
    </form>
  );
}
