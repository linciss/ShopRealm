import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const slugify = (storeName: string) => {
  return storeName.replace(/ /g, '-');
};

interface Map {
  label: string;
  id: string;
}

interface MapObject {
  [key: string]: Map;
}

export const categoryMap: MapObject = {
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

interface Review {
  id?: string;
  rating: number;
  comment?: string;
  user?: {
    name: string;
  };
  createdAt?: Date;
}

export const calculateAverageRating = (reviews: Review[]) => {
  const reviewCount = reviews.length;

  return (
    Math.round(
      (reviews
        .map((review) => {
          return review.rating;
        })
        .reduce((sum, rating) => sum + rating, 0) /
        reviewCount) *
        10,
    ) / 10 || 0
  );
};

export const statusMap: MapObject = {
  pending: { id: 'pending', label: 'Gaida' },
  shipped: { id: 'shipped', label: 'Izsutits' },
  complete: { id: 'complete', label: 'Pabeigts' },
  returned: { id: 'returned', label: 'Atgriezsts' },
};
