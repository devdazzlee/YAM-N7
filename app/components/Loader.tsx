'use client';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

export default function Loader({ size = 'md', text, fullScreen = false }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-20 h-20 border-4',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      {/* Simple spinning loader */}
      <div className={`${sizeClasses[size]} border-t-[#C5A059] border-r-[#C5A059] border-b-transparent border-l-transparent rounded-full animate-spin`}></div>
      
      {text && (
        <p className="mt-4 text-[#1A1A1A] font-medium text-sm sm:text-base animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

