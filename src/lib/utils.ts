import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { countries } from "./data/countries"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function getCountryName(countryCode: string): string {
  if (!countryCode) return 'N/A';
  
  // Handle case where the code might already be a full name
  if (countryCode.length > 3) {
    return countryCode;
  }
  
  const country = countries.find(c => c.code.toLowerCase() === countryCode.toLowerCase());
  return country ? country.name : countryCode;
}

export function getCountryCode(countryName: string): string {
  if (!countryName) return '';
  
  const country = countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
  return country ? country.code : countryName;
}