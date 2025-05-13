'use client';

import { useEffect, useRef, useState } from 'react';
import { ProductCard } from './product-card';
import { Session } from 'next-auth';

interface Product {
  id: string;
  name: string;
  image: string | null;
  price: string;
  slug?: string;
  reviews: {
    rating: number;
  }[];
  quantity: number;
  sale: boolean;
  salePrice: string | null;
  featured: boolean;
}

interface Favorite {
  productId: string;
}

interface LazyProductCardProps {
  productData: Product;
  favoriteItems: Favorite[] | undefined;
  session: Session | null;
  origin?: string;
  isPriority: boolean;
}

export const LazyProductCard = (props: LazyProductCardProps) => {
  const [isVisible, setIsVisible] = useState(props.isPriority);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.isPriority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (cardRef.current) observer.unobserve(cardRef.current);
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.01,
      },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, [props.isPriority]);

  return (
    <div ref={cardRef} className='min-h-[300px]'>
      {isVisible ? (
        <ProductCard {...props} />
      ) : (
        <div className='h-[400px] rounded-md bg-gray-100 animate-pulse'></div>
      )}
    </div>
  );
};
