import React from "react";
import { QUOTES } from "../lib/citations";

function getDailyIndex(total: number): number {
  // Utilise la date UTC pour éviter les décalages serveur/client
  const today = new Date().toISOString().slice(0, 10); // AAAA-MM-JJ (UTC)
  let hash = 0;
  for (let i = 0; i < today.length; i += 1) {
    hash = (hash * 31 + today.charCodeAt(i)) >>> 0;
  }
  return hash % total;
}

export default function CitationOfTheDay(): React.ReactElement {
  const quote = QUOTES[getDailyIndex(QUOTES.length)];

  return (
    <section
      aria-label="Citation du jour"
      className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/70 shadow-lg backdrop-blur-sm"
    >
      {/* Accent gradient */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[var(--color-accent)]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[var(--color-foreground)]/10 blur-3xl" />

      <div className="relative p-6 sm:p-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/20 px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M3 5a3 3 0 013-3h1a1 1 0 010 2H6a1 1 0 00-1 1v1h2a2 2 0 012 2v3a2 2 0 01-2 2H4a1 1 0 01-1-1V5zm10-3a3 3 0 00-3 3v1h2a2 2 0 012 2v3a2 2 0 01-2 2h-2a1 1 0 01-1-1V5a3 3 0 013-3h1a1 1 0 010 2h-1z" />
          </svg>
          Citation du jour
        </div>

        <blockquote className="text-lg sm:text-xl leading-relaxed text-[var(--color-foreground)]">
          « {quote.text} »
        </blockquote>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--color-foreground)]/80">
          <span className="rounded-md bg-[var(--color-background)]/40 px-2 py-0.5 font-medium">
            {quote.source}
          </span>
          {quote.reference ? (
            <span className="text-[var(--color-foreground)]/60">• {quote.reference}</span>
          ) : null}
        </div>
      </div>
    </section>
  );
}

