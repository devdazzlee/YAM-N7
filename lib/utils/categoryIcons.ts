import {
  Baby,
  Crown,
  Droplets,
  Flame,
  Flower2,
  Gem,
  Gift,
  Package,
  Award,
  Star,
  User,
  type LucideIcon,
} from 'lucide-react';

const SLUG_ICON_MAP: Record<string, LucideIcon> = {
  'gift-sets-duo-trio': Gift,
  'gift-sets': Gift,
  zodiac: Star,
  'yam-n7-signature': Award,
  premium: Gem,
  elite: Crown,
  men: User,
  'mens-fragrances': User,
  women: Flower2,
  'womens-fragrances': Flower2,
  kids: Baby,
  oud: Flame,
  attars: Droplets,
};

export function getCategoryIcon(slug: string, name: string): LucideIcon {
  const bySlug = SLUG_ICON_MAP[slug.toLowerCase()];
  if (bySlug) return bySlug;

  const n = name.toLowerCase();
  if (n.includes('gift') || n.includes('duo') || n.includes('trio')) return Gift;
  if (n.includes('zodiac')) return Star;
  if (n.includes('signature')) return Award;
  if (n.includes('premium')) return Gem;
  if (n.includes('elite')) return Crown;
  if (n.includes('kid')) return Baby;
  if (n.includes('women') || n.includes('woman')) return Flower2;
  if (/\bmen\b/.test(n) || (n.includes('men') && !n.includes('women'))) return User;
  if (n.includes('oud')) return Flame;
  if (n.includes('attar')) return Droplets;

  return Package;
}

export function getCategoryDescription(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('gift') || n.includes('duo') || n.includes('trio')) return 'Ready-to-gift sets and duos';
  if (n.includes('zodiac')) return 'Scents aligned with your star sign';
  if (n.includes('signature')) return 'Exclusive YAM-N7 house creations';
  if (n.includes('premium')) return 'Elevated everyday luxury fragrances';
  if (n.includes('elite')) return 'Rare oud blends and limited editions';
  if (n.includes('kid')) return 'Gentle, playful scents for children';
  if (n.includes('women') || n.includes('woman')) return 'Elegant florals and sophisticated notes';
  if (/\bmen\b/.test(n) || (n.includes('men') && !n.includes('women'))) return 'Bold, refined fragrances for him';
  if (n.includes('oud')) return 'Rich, woody oud compositions';
  if (n.includes('attar')) return 'Traditional oil-based attars';
  return `Browse our ${name.toLowerCase()} collection`;
}
