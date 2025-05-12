'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { BadgeCheck } from 'lucide-react';
import { useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { featureChange } from '../../../../actions/admin/featured-change';

interface FeaturedProps {
  productId: string;
  featured: boolean;
}

export const FeaturedButton = ({ productId, featured }: FeaturedProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleChangeFeatured = () => {
    startTransition(() => {
      featureChange(productId).then((res) => {
        if (res?.error) {
          toast({
            title: t('error'),
            description: t(res.error),
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('success'),
            description: t(res.success || 'featuredChanged'),
          });
        }
      });
    });
  };
  return (
    <DropdownMenuItem
      disabled={isPending}
      className={` text-center ${featured ? 'text-red-800' : 'text-green-800'}`}
      onClick={handleChangeFeatured}
    >
      <BadgeCheck />
      {featured ? t('removeFeature') : t('addFeature')}
    </DropdownMenuItem>
  );
};
