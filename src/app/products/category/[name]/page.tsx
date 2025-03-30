// import { redirect } from 'next/navigation';
// import { Metadata } from 'next';
// import { getProduct } from '../../../../data/product';
// import { ProductPageInfo } from '@/components/custom/products/product-page-info';

// type Props = {
//   params: Promise<{ slug: string }>;
// };

// // generates metadata for the page based on the product id
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { slug } = await params;

//   const productData = await getProduct(slug);

//   return {
//     title: productData?.name,
//     description: productData?.description,
//   };
// }

// export default async function ProductPage({ params }: Props) {
//   const { slug } = await params;

//   const productData = await getProduct(slug);

//   if (!productData) redirect('/products');

//   return (
//     <div className='space-y-4  max-w-7xl mx-auto'>
//       <ProductPageInfo productData={productData} />
//     </div>
//   );
// }
