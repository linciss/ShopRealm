// import prisma from '@/lib/db';
import prisma from '@/lib/db';

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
  category,
  minPrice,
  maxPrice,
  sort,
  limit,
}: ProductsQueryOptions) {
  const allProducts = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      slug: true,
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
      createdAt: true,
      quantity: true,
    },
  });

  let filteredProducts = [...allProducts];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchLower),
    );
  }

  if (category) {
    filteredProducts = filteredProducts.filter((product) =>
      product.category.includes(category),
    );
  }

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
        filteredProducts.sort(
          (a, b) =>
            new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
        );
        break;
      case 'oldest':
        filteredProducts.sort(
          (a, b) =>
            new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf(),
        );
        break;
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
    products: paginatedProducts,
    totalProducts,
  };
}

export const getProduct = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        quantity: true,
        image: true,
        store: {
          select: {
            name: true,
            id: true,
          },
        },
        category: true,
        createdAt: true,
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,

            user: {
              select: {
                name: true,
              },
            },
          },
        },
        details: true,
        specifications: true,
      },
    });

    if (!product) return;

    return product;
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error: ', error.stack);
    }
    return;
  }
};

export const getRelatedProducts = async (
  category: string[],
  productId: string,
) => {
  try {
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: {
          hasSome: category,
        },
        id: {
          not: productId,
        },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        slug: true,
        reviews: {
          select: {
            rating: true,
          },
        },
        quantity: true,
      },
      orderBy: {
        createdAt: Math.random() > 0.5 ? 'desc' : 'asc',
      },
      take: 4,
    });

    return relatedProducts;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};
