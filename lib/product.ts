export type ProductImage = {
  src: string;
  lqip?: string;
};

export type Product = {
  sku: string;
  title: string;
  price: number;
  value: number;
  stock: number;
  images: ProductImage[] | string[];
  descriptionShort: string;
  howTo: string[];
};

export async function getProduct(): Promise<Product> {
  return {
    sku: "FETRA-RIT-001",
    title: "Le Rituel Visage Liftant — Kit Quartz Rose 3-en-1 & Huile RedMoringa",
    price: 49.9,
    value: 54.8,
    stock: 13,
    images: [
      { 
        src: '/optimized_images/main_1200.webp', 
        lqip: 'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAAAwAQCdASoCAAEADMBOJwAALp4AqJYgAD5oqdMACgA=' 
      },
      { 
        src: '/optimized_images/plusvaluehuile_1200.webp', 
        lqip: 'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAAAwAQCdASoCAAEADMBOJwAALp4AqJYgAD5oqdMACgA=' 
      },
    ],
    descriptionShort: "Rituel de 5 minutes qui draine, sculpte et illumine votre peau.",
    howTo: [
      "Nettoyez votre visage.",
      "Appliquez 3–4 gouttes d'huile.",
      "Drainez avec le rouleau du centre vers l'extérieur.",
      "Sculptez avec le Gua Sha le long des os du visage.",
    ],
  };
}
