// import prisma from '@/lib/db';
import prisma from '@/lib/db';
import { Session } from 'next-auth';

interface ProductsQueryOptions {
  page: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  limit: number;
  sale?: boolean;
  featured?: boolean;
  session?: Session | null;
}

interface ProductWithInterestScore {
  interestScore?: number;
  category: string[];
  sale: boolean;
  featured: boolean;
  id: string;
  name: string;
  price: string;
  image: string | null;
  slug: string;
  createdAt: Date;
  quantity: number;
  salePrice: string | null;
  store: {
    name: string;
  };
  reviews: {
    rating: number;
  }[];
}

export const getProducts = async ({
  page,
  search,
  category,
  minPrice,
  maxPrice,
  sort,
  limit,
  sale = false,
  featured = false,
  session,
}: ProductsQueryOptions) => {
  const userId = session?.user?.id;

  let userInterests: Record<string, number> | null = null;

  // gets users interests aka viewed categories
  if (userId) {
    try {
      const userInterest = await prisma.userInterest.findUnique({
        where: { userId },
      });

      if (userInterest?.interests) {
        userInterests = userInterest.interests as Record<string, number>;
      }
    } catch (error) {
      console.error('err:', error);
    }
  }

  const allProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      store: {
        active: true,
      },
      ...(sale && {
        sale: true,
      }),
      ...(featured && {
        featured: true,
      }),
      deleted: false,
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
      sale: true,
      salePrice: true,
      featured: true,
      store: {
        select: { name: true },
      },
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
      (product) =>
        Number(product.sale ? product.salePrice : product.price) >= minPrice,
    );
  }

  if (maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        Number(product.sale ? product.salePrice : product.price) <= maxPrice,
    );
  }

  if (sort) {
    switch (sort) {
      case 'price-low':
        filteredProducts.sort((a, b) => {
          const aPrice = a.sale ? Number(a.salePrice) : Number(a.price);
          const bPrice = b.sale ? Number(b.salePrice) : Number(b.price);
          return aPrice - bPrice;
        });
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => {
          const aPrice = a.sale ? Number(a.salePrice) : Number(a.price);
          const bPrice = b.sale ? Number(b.salePrice) : Number(b.price);
          return bPrice - aPrice;
        });
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
  } else if (userInterests && Object.keys(userInterests).length > 0) {
    const productsWithScores = filteredProducts.map((product) => {
      // gets top 3 categories from product
      const categoryScores = product.category
        .map((cat) => userInterests[cat] || 0)
        .sort((a, b) => b - a);

      // just weights so its fair for products with more categories
      const weights = [1, 0.35, 0.15];

      let interestScore = 0;

      // calculate interest score based on user interests and product category count
      for (
        let i = 0;
        i < Math.min(weights.length, categoryScores.length);
        i++
      ) {
        interestScore += categoryScores[i] * weights[i];
      }

      // randomizer to make it more "PROFESSIONAL"
      interestScore *= 0.9 + Math.random() * 0.2;

      return {
        ...product,
        interestScore,
      } as ProductWithInterestScore;
    });

    filteredProducts = productsWithScores;

    filteredProducts.sort(
      (a, b) =>
        ((b as ProductWithInterestScore).interestScore || 0) -
        ((a as ProductWithInterestScore).interestScore || 0),
    );
  }

  const totalProducts = filteredProducts.length;
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + limit,
  ) as ProductWithInterestScore[];

  return {
    products: paginatedProducts,
    totalProducts,
  };
};

export const getProduct = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
        store: {
          active: true,
        },
        deleted: false,
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
        featured: true,
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,

            user: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        details: true,
        specifications: true,
        sale: true,
        salePrice: true,
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

export const getRelatedProducts = async (productId: string) => {
  try {
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        category: true,
        price: true,
        specifications: true,
      },
    });

    if (!currentProduct) return [];

    const recommendations = await prisma.product.findMany({
      where: {
        id: { not: productId },
        isActive: true,
        deleted: false,
        store: { active: true },
        category: { hasSome: currentProduct.category },
      },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        slug: true,
        category: true,
        sale: true,
        salePrice: true,
        featured: true,
        reviews: { select: { rating: true } },
        quantity: true,
      },
      take: 12,
    });

    return recommendations
      .map((product) => {
        const categoryOverlap = product.category.filter((c) =>
          currentProduct.category.includes(c),
        ).length;

        const priceProximity =
          1 -
          Math.min(
            Math.abs(Number(product.price) - Number(currentProduct.price)) /
              Number(currentProduct.price),
            1,
          );

        const relevanceScore = categoryOverlap * 0.6 + priceProximity * 0.4;

        return { ...product, relevanceScore };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 4);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    return;
  }
};
