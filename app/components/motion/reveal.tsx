'use client';

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

export const ease = [0.22, 1, 0.36, 1] as const;

export const viewport = {
  once: true,
  margin: '-60px 0px -40px 0px',
  amount: 0.15,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease },
  },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease },
  },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -36, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 36, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.94, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease },
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
  light?: boolean;
};

export function SectionHeader({
  title,
  subtitle,
  accent,
  className = '',
  light = false,
}: SectionHeaderProps) {
  return (
    <Reveal className={`text-center mb-6 sm:mb-8 md:mb-10 ${className}`}>
      {accent && (
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.35em' }}
          viewport={viewport}
          transition={{ duration: 0.8, ease }}
          className={`mb-2 text-xs font-semibold uppercase sm:text-sm ${
            light ? 'text-primary-light' : 'text-primary-dark'
          }`}
        >
          {accent}
        </motion.p>
      )}
      <h2
        className={`text-xl font-bold sm:text-2xl md:text-3xl mb-2 ${
          light ? 'text-foreground' : 'text-foreground'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mx-auto max-w-xl text-xs sm:text-sm md:text-base ${
            light ? 'text-foreground/85' : 'text-muted'
          }`}
        >
          {subtitle}
        </p>
      )}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={viewport}
        transition={{ duration: 0.7, delay: 0.15, ease }}
        className="mx-auto mt-4 h-[2px] w-16 origin-center rounded-full bg-gradient-to-r from-transparent via-primary to-transparent sm:w-20"
      />
    </Reveal>
  );
}
