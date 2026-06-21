'use client';

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

export const ease = [0.22, 1, 0.36, 1] as const;

export const viewport = {
  once: true,
  margin: '-80px 0px -60px 0px',
  amount: 0.12,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease },
  },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 32, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease },
  },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -48, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 48, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease },
  },
};

type RevealProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
  variant?: 'fadeUp' | 'fadeScale' | 'slideLeft' | 'slideRight';
  delay?: number;
};

const variantMap = {
  fadeUp,
  fadeScale,
  slideLeft,
  slideRight,
};

export function Reveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  className,
  ...props
}: RevealProps) {
  return (
    <motion.div
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
};

export function Stagger({ children, className }: StaggerProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChild({
  children,
  className,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div variants={staggerItem} className={className} {...props}>
      {children}
    </motion.div>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  accent?: string;
  className?: string;
  align?: 'center' | 'left';
  light?: boolean;
};

export function SectionHeader({
  title,
  subtitle,
  accent,
  className = '',
  align = 'center',
  light = false,
}: SectionHeaderProps) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';
  const subtitleClass = align === 'left' ? 'max-w-xl' : 'mx-auto max-w-2xl';

  return (
    <Reveal className={`mb-10 sm:mb-12 md:mb-16 ${alignClass} ${className}`}>
      {accent && (
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.45em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.28em' }}
          viewport={viewport}
          transition={{ duration: 0.9, ease }}
          className={`luxury-label mb-3 sm:mb-4 ${light ? 'text-primary-light' : ''}`}
        >
          {accent}
        </motion.p>
      )}
      <h2
        className={`font-heading text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-3 sm:mb-4 ${
          light ? 'text-foreground' : 'text-foreground'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`${subtitleClass} text-sm sm:text-base md:text-lg leading-relaxed ${
            light ? 'text-foreground/80' : 'text-muted'
          }`}
        >
          {subtitle}
        </p>
      )}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={viewport}
        transition={{ duration: 0.8, delay: 0.12, ease }}
        className={`mt-6 h-px w-20 sm:w-24 origin-center bg-gradient-to-r from-transparent via-primary to-transparent ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </Reveal>
  );
}

type SectionShellProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
};

export function SectionShell({ children, className = '', id, dark = false }: SectionShellProps) {
  return (
    <section
      id={id}
      className={`luxury-section ${dark ? 'bg-surface' : 'bg-background'} ${className}`}
    >
      <div className="luxury-container relative z-10">{children}</div>
    </section>
  );
}
