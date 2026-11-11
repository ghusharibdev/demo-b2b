import { whatsappUrl } from './site';

export const productCategories = [
  '3pc Suit',
  'Shawl',
  'Gents Shawl',
  '2pc Suit',
  'Gents Suit',
] as const;

export type ProductCategory = (typeof productCategories)[number];

export interface Product {
  id: string;
  slug: string;
  name: string;
  alt: string;
  brand: string;
  fabric: string;
  isNew: boolean;
  inStock: boolean;
  price: number;
  spec: string;
  image: string;
  category: ProductCategory;
}

export const products: Product[] = [
  {
    id: 'dhanak-printed-3pc-olive',
    slug: 'dhanak-printed-3pc-olive',
    name: 'DHANAK Printed Hit Code Unstitched 3pc - Olive Green Hearts',
    alt: 'DHANAK Printed 3pc olive green hearts folded',
    brand: 'Lahore Boutique',
    fabric: 'Dhanak',
    isNew: true,
    inStock: true,
    price: 2400,
    spec: 'Shirt: Dhanak Printed, Trouser: Dhanak Plain, Shawl: Dhanak Printed',
    image: '/images/product-1.jpg',
    category: '3pc Suit',
  },
  {
    id: 'velvet-9mm-shawl-purple',
    slug: 'velvet-9mm-shawl-purple',
    name: 'Velvet 9MM Sequence Embroidered Heavy Shawl - Purple',
    alt: 'Velvet purple embroidered shawl',
    brand: 'Velvet',
    fabric: 'Velvet',
    isNew: true,
    inStock: true,
    price: 2850,
    spec: '2.5 Yard Complete Shawl, Four Side Stone Work Lace, Ready To Wear',
    image: '/images/product-2.jpg',
    category: 'Shawl',
  },
  {
    id: 'j-gents-shawl-black',
    slug: 'j-gents-shawl-black',
    name: 'J. By Junaid Jamshed Gents Shawl - Black',
    alt: 'J. black gents shawl with box',
    brand: 'J.',
    fabric: 'Wool',
    isNew: false,
    inStock: true,
    price: 1800,
    spec: 'Gents Shawl, Soft Wool, With Box, 2.5 Yard',
    image: '/images/product-3.jpg',
    category: 'Gents Shawl',
  },
  {
    id: 'summer-cotton-2pc-black',
    slug: 'summer-cotton-2pc-black',
    name: 'Summer Cotton Premium Quality 2pc - Black Floral',
    alt: 'Summer cotton black floral 2pc folded',
    brand: 'Summer Cotton',
    fabric: 'Cotton',
    isNew: false,
    inStock: true,
    price: 1900,
    spec: 'Shirt: Summer Cotton Printed, Trouser: Summer Cotton Plain',
    image: '/images/product-4.jpg',
    category: '2pc Suit',
  },
  {
    id: 'almirah-wash-wear-stone-gray',
    slug: 'almirah-wash-wear-stone-gray',
    name: 'Almirah Tropical Wash & Wear - Stone Gray - Gents',
    alt: 'Almirah stone gray wash and wear gents suit',
    brand: 'Almirah',
    fabric: 'Wash & Wear',
    isNew: false,
    inStock: true,
    price: 2200,
    spec: 'Gents Suit, Tropical Wash & Wear, Unstitched, Stone Gray',
    image: '/images/product-5.jpg',
    category: 'Gents Suit',
  },
  {
    id: 'premium-wool-3pc-mustard',
    slug: 'premium-wool-3pc-mustard',
    name: 'Premium Wool 3pc - Mustard Brown',
    alt: 'Mustard brown wool 3pc with dupatta',
    brand: 'Premium',
    fabric: 'Wool',
    isNew: false,
    inStock: true,
    price: 2600,
    spec: 'Shirt: Wool Printed, Trouser: Wool Plain, Dupatta: Wool',
    image: '/images/product-6.jpg',
    category: '3pc Suit',
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-PK').format(price);
}

export function productOrderUrl(product: Product): string {
  return whatsappUrl(
    `Assalam-o-Alaikum, I want to order ${product.name} - Price Rs ${formatPrice(product.price)} Wholesale. Is it in stock? My city is:`,
  );
}
