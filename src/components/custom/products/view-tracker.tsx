'use client';

import { useEffect } from 'react';
import { incrementView } from '../../../../actions/product/increment-view';

interface ViewTrackerProps {
  productId: string;
}
export const ViewTracker = ({ productId }: ViewTrackerProps) => {
  useEffect(() => {
    incrementView(productId);
  }, [productId]);

  return null;
};
