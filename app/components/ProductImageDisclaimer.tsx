export const PRODUCT_IMAGE_DISCLAIMER_TEXT =
  'Images are for representation only. Product appearance may vary due to natural characteristics and digital editing.';

type ProductImageDisclaimerProps = {
  className?: string;
  /** `card`: fine print under actions inside a tile. `cardStrip`: full-width footer bar (list layout). `default`: PDP / compare. */
  variant?: 'default' | 'card' | 'cardStrip';
};

export default function ProductImageDisclaimer({
  className = '',
  variant = 'default',
}: ProductImageDisclaimerProps) {
  if (variant === 'cardStrip') {
    return (
      <p
        className={[
          'w-full shrink-0 border-t border-gray-200/90 bg-[#FAFAF9]',
          'px-3 py-2.5 sm:px-4 md:px-6 sm:py-3',
          'text-center sm:text-left text-[10px] sm:text-[11px] leading-relaxed text-[#4B5563]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        role="note"
      >
        {PRODUCT_IMAGE_DISCLAIMER_TEXT}
      </p>
    );
  }

  if (variant === 'card') {
    return (
      <p
        className={[
          'mt-2 sm:mt-2.5 pt-2 sm:pt-2.5 border-t border-gray-200/90',
          'text-[10px] sm:text-[11px] leading-relaxed text-[#4B5563]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        role="note"
      >
        {PRODUCT_IMAGE_DISCLAIMER_TEXT}
      </p>
    );
  }

  return (
    <p
      className={['text-[#6B7280] text-[9px] sm:text-[10px] leading-snug', className].filter(Boolean).join(' ')}
      role="note"
    >
      {PRODUCT_IMAGE_DISCLAIMER_TEXT}
    </p>
  );
}
