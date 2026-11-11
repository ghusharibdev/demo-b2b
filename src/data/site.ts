export const site = {
  name: 'Lahore Boutique',
  tagline: 'Fashion • Quality • Style',
  address: 'Allama Iqbal Town, Lahore, Pakistan',
  phoneDisplay: '+92 332 6241303',
  phoneHref: 'tel:+923326241303',
  whatsappNumber: '923326241303',
  email: 'abdullahmughal6241303@gmail.com',
  emailHref: 'mailto:abdullahmughal6241303@gmail.com',
  hours: 'Always Open',
  delivery: 'Lahore & Nationwide Delivery',
  orderMessage: 'Assalam-o-Alaikum, I saw your collection, I want to order.',
} as const;

export function whatsappUrl(message: string = site.orderMessage): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
