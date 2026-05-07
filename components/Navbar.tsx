"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, PenLine, Headphones, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthButton from "./AuthButton";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/flashcards", label: "Review", icon: BookOpen },
  { href: "/write", label: "Write", icon: PenLine },
  { href: "/listen", label: "Listen", icon: Headphones },
  { href: "/stats", label: "Stats", icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <>
      <header className="sticky top-0 z-30 border-b-2 border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐼</span>
            <span className="hanzi text-xl font-bold text-brand-600">学中文</span>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden gap-1 md:flex">
              {TABS.map(({ href, label, icon: Icon }) => {
                const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                      active ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                             : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t-2 border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto grid max-w-5xl grid-cols-5">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-xs font-medium",
                  active ? "text-brand-600" : "text-zinc-500"
                )}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
