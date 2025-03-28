// import prisma from '@/lib/db';
import { mockupDatA } from './mockup';

interface ProductsQueryOptions {
  page: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  limit: number;
}

export async function getProducts({
  page,
  search,
  //   category,
  minPrice,
  maxPrice,
  sort,
  limit,
}: ProductsQueryOptions) {
  //   const allProducts = await prisma.product.findMany({
  //     select: {
  //       id: true,
  //       name: true,
  //       description: true,
  //       price: true,
  //       quantity: true,
  //       isActive: true,
  //       image: true,
  //       slug: true,
  //       storeId: true,
  //       category: true,
  //       createdAt: true,
  //       updatedAt: true,
  //       reviews: {
  //         select: {
  //           id: true,
  //           rating: true,
  //           comment: true,
  //           createdAt: true,
  //           user: {
  //             select: {
  //               name: true,
  //             },
  //           },
  //         },
  //       },
  //       details: true,
  //       specifications: true,
  //     },
  //   });

  const allProducts = mockupDatA;

  let filteredProducts = [...allProducts];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchLower),
    );
  }

  //   if (category) {
  //     filteredProducts = filteredProducts.filter(
  //       (product) => product.category.toLowerCase() === category,
  //     );
  //   }

  if (minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(
      (product) => Number(product.price) >= minPrice,
    );
  }

  if (maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(
      (product) => Number(product.price) <= maxPrice,
    );
  }

  if (sort) {
    switch (sort) {
      case 'price-low':
        filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'popular':
        filteredProducts.sort((a, b) => b.reviews.length - a.reviews.length);
        break;
      case 'newest':
      default:
        break;
    }
  }

  const totalProducts = filteredProducts.length;
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + limit,
  );

  return {
    products: paginatedProducts as Product[],
    totalProducts,
  };
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  reviews: {
    rating: number;
  }[];
}
