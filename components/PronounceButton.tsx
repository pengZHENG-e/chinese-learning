"use client";
import { Volume2 } from "lucide-react";
import { speak } from "@/lib/tts";
import { cn } from "@/lib/utils";

export default function PronounceButton({
  text,
  size = "md",
  className,
}: {
  text: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10",
    lg: "h-14 w-14 text-xl",
  };
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={`Pronounce ${text}`}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-sky-500 text-white shadow-[0_3px_0_0_theme(colors.sky.700)] transition-all hover:bg-sky-600 active:translate-y-0.5 active:shadow-none",
        sizes[size],
        className
      )}
    >
      <Volume2 className={size === "lg" ? "h-6 w-6" : size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    </button>
  );
}
