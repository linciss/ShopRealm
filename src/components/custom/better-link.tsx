'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useRef } from 'react';

interface BetterLinkProps {
  href: string;
  className?: string;
  key?: string;
  ariaLabel?: string;
  children: ReactNode;
  prefetch?: boolean;
}

export const BetterLink = ({
  href,
  className,
  ariaLabel,
  children,
  prefetch,
}: BetterLinkProps) => {
  const router = useRouter();

  //   cache mechanism
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  //   custom prefecth when mouse is over link so it doesnt send as many edge requests :)
  const handlePrefetch = () => {
    if (!prefetch) return;
    if (prefetchedRoutes.current.has(href)) return;

    router.prefetch(href);
    prefetchedRoutes.current.add(href);
  };
  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      prefetch={false}
      onMouseEnter={handlePrefetch}
    >
      {children}
    </Link>
  );
};
