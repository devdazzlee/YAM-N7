'use client';

import BrandLoader from './BrandLoader';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

export default function Loader({ text, fullScreen = false }: LoaderProps) {
  if (fullScreen) {
    return <BrandLoader variant="route" text={text ?? 'Curating your experience...'} progress={72} />;
  }

  return <BrandLoader variant="inline" text={text} />;
}
