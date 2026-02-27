import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCapitalize(val: string): string {
  if (!val || typeof val !== 'string') return val;
  // Jika string merupakan all-caps sempurna, biarkan apa adanya (tidak ubah ke title case)
  const isAllCaps = val === val.toUpperCase();
  if (isAllCaps) return val;

  // Ubah menjadi Title Case dengan regex batas kata
  return val.replace(/\b\w/g, char => char.toUpperCase());
}
