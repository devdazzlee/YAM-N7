'use client';

import { usePathname } from 'next/navigation';
import BrandLoader from './BrandLoader';
import { getLoadingMessage, getPageTitleFromPath } from '../../lib/utils/pageTitles';

export default function RouteLoading() {
  const pathname = usePathname();
  return (
    <BrandLoader
      variant="route"
      text={getLoadingMessage(pathname)}
      pageTitle={getPageTitleFromPath(pathname)}
      progress={55}
    />
  );
}
