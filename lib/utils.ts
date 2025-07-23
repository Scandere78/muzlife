import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utilitaire Tailwind/clsx typé pour TypeScript
export function cn(...inputs: (string | number | boolean | undefined | null)[]): string {
  return twMerge(clsx(inputs));
}
