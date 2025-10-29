import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    sku: "FETRA-RIT-001",
    title: "Le Rituel Visage Liftant — Kit Quartz Rose 3-en-1 & Huile RedMoringa",
    price: 49.9,
    value: 54.8,
    stock: 13,
    images: ["/main.webp", "/plusvaluehuile.webp"],
    descriptionShort: "Rituel de 5 minutes qui draine, sculpte et illumine votre peau.",
  });
}
