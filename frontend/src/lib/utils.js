import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conditional class names.
 * @param {...unknown} inputs - Class names and/or conditional objects.
 * @returns {string} Merged className string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
