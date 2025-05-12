'use client';

import { useEffect } from 'react';
import { incrementView } from '../../../../actions/product/increment-view';
import { trackInterest } from '../../../../actions/user/track-interests';

interface ViewTrackerProps {
  productId: string;
}
export const ViewTracker = ({ productId }: ViewTrackerProps) => {
  useEffect(() => {
    incrementView(productId);

    trackInterest(productId);
  }, [productId]);

  return null;
};
