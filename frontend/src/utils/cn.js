import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges tailwind classes properly ensuring conflicts are resolved.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
