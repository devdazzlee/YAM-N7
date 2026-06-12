import { Product } from '../api/productApi';

export interface DisplayProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  sales_rate_inc_dis_and_tax?: string | number;
  sales_rate_exc_dis_and_tax?: string | number;
  selling_price?: number;
  description?: string;
  weight?: string;
  origin?: string;
  rating?: number;
  reviews?: number;
  created_at?: string;
  unitName?: string;
}

export function mapApiProduct(product: Product): DisplayProduct {
  const priceValue = product.sales_rate_inc_dis_and_tax
    ? parseFloat(String(product.sales_rate_inc_dis_and_tax))
    : product.sales_rate_exc_dis_and_tax
    ? parseFloat(String(product.sales_rate_exc_dis_and_tax))
    : product.selling_price || product.price || 0;

  const discountAmount = product.discount_amount
    ? parseFloat(String(product.discount_amount))
    : 0;
  const originalPrice =
    discountAmount > 0 && priceValue > 0 ? priceValue + discountAmount : undefined;

  const productImage =
    product.ProductImage && Array.isArray(product.ProductImage) && product.ProductImage.length > 0
      ? product.ProductImage[0].image
      : product.image || '/Banner-01.jpg';

  return {
    id: product.id,
    name: product.name,
    price: priceValue,
    originalPrice,
    image: productImage,
    category: product.category?.name,
    sales_rate_inc_dis_and_tax: product.sales_rate_inc_dis_and_tax,
    sales_rate_exc_dis_and_tax: product.sales_rate_exc_dis_and_tax,
    selling_price: product.selling_price,
    description: product.description || product.short_description,
    weight: product.weight,
    origin: product.origin,
    rating: product.rating,
    reviews: product.reviews,
    created_at: product.created_at,
    unitName: product.unit?.name,
  };
}

export function mapApiProducts(products: Product[]): DisplayProduct[] {
  return products.map(mapApiProduct);
}

type CategoryLike = { name?: string } | string | null | undefined;

export function getProductCategoryName(product: {
  category?: CategoryLike;
  category_name?: string;
  category_id?: string;
}): string {
  if (typeof product.category === 'string') return product.category;
  return product.category?.name || product.category_name || product.category_id || 'Uncategorized';
}

export function interleaveProductsByCategory<T extends {
  category?: CategoryLike;
  category_name?: string;
  category_id?: string;
}>(products: T[]): T[] {
  const categoryBuckets = new Map<string, T[]>();

  products.forEach((product) => {
    const category = getProductCategoryName(product);
    if (!categoryBuckets.has(category)) categoryBuckets.set(category, []);
    categoryBuckets.get(category)!.push(product);
  });

  const bucketEntries = Array.from(categoryBuckets.entries())
    .map(([category, items]) => ({ category, items }))
    .sort((a, b) => b.items.length - a.items.length);

  const mixed: T[] = [];
  let added = true;

  while (added) {
    added = false;
    for (const bucket of bucketEntries) {
      const next = bucket.items.shift();
      if (next) {
        mixed.push(next);
        added = true;
      }
    }
  }

  return mixed;
}
