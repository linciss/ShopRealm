import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const slugify = (storeName: string) => {
  return storeName.replace(/ /g, '-');
};

interface CategoryItem {
  label: string;
  id: string;
}

interface CategoryMap {
  [key: string]: CategoryItem;
}

export const categoryMap: CategoryMap = {
  electronics: { id: 'electronics', label: 'Elektronika' },
  clothing: { id: 'clothing', label: 'Apgerbs' },
  home: { id: 'home', label: 'Majas un virtuve' },
  beauty: { id: 'beauty', label: 'Veseliba un skaistums' },
  sports: { id: 'sports', label: 'Sports un atputa' },
  toys: { id: 'toys', label: 'Rotaļlietas un spēles' },
  books: { id: 'books', label: 'Gramatas un mediji' },
  health: { id: 'health', label: 'Veseliba un labklajiba' },
  automotive: { id: 'automotive', label: 'Auto un motocikli' },
  jewelry: { id: 'jewelry', label: 'Rotaslietas un aksesuari' },
};
