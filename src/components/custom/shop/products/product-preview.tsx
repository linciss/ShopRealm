import Image from 'next/image';

interface ProductProps {
  productData:
    | {
        image: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        price: number;
        category: string[];
        quantity: number;
        isActive: boolean;
        storeId: string;
      }
    | undefined;
}
export const ProductPreview = ({ productData }: ProductProps) => {
  return (
    <div className='mt-5 grid grid-cols-1 md:grid-cols-1'>
      <div className=''>
        <Image
          width={600}
          height={600}
          src={(productData?.image as string) || ''}
          alt='Product Image'
        />
      </div>
    </div>
  );
};
