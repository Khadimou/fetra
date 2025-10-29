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
  descriptionLong?: string;
  howTo: string[];
};

export async function getProduct(): Promise<Product> {
  return {
    sku: "FETRA-RIT-001",
    title: "Le Rituel Visage Liftant FETRA : Kit Quartz Rose 3-en-1 & Huile Régénérante",
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
    descriptionLong: "Un rituel de beauté universel conçu pour tous les visages, sans distinction de genre ou de type de peau. Notre Kit Quartz Rose 3-en-1 associé à l'Huile Régénérante offre un moment de bien-être quotidien pour révéler l'éclat naturel de votre peau, sculpter vos traits et profiter d'une expérience sensorielle apaisante. Adapté à toutes les carnations et tous les types de peau, ce rituel respecte la sensibilité de votre épiderme grâce à des outils en Quartz Rose authentique et une formulation naturelle.",
    howTo: [
      "Nettoyez votre visage.",
      "Appliquez 3–4 gouttes d'huile.",
      "Drainez avec le rouleau du centre vers l'extérieur.",
      "Sculptez avec le Gua Sha le long des os du visage.",
    ],
  };
}
