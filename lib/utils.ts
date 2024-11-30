import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('');
}
