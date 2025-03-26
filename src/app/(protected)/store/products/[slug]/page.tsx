import { redirect } from 'next/navigation';
import { checkStoreProduct } from '../../../../../../data/store';

export default async function ProductPagePreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const isStoreProduct = await checkStoreProduct(slug);

  if (!isStoreProduct) redirect('/store/products');

  return <div>{slug}</div>;
}
