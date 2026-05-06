import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

export function generateSlug(title: string): string {
  const base = slugify(title);
  const timestamp = Date.now().toString(36);
  return `${base}-${timestamp}`;
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "…";
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export const REACTION_LABELS = {
  same: { emoji: "🫧", label: "same" },
  feltThat: { emoji: "🍰", label: "felt that" },
  hugs: { emoji: "🌙", label: "sending hugs" },
} as const;

export type ReactionType = keyof typeof REACTION_LABELS;
