export function pushEvent(eventName: string, eventData?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...eventData,
    });
  }
}

export function beginCheckout(sku: string, quantity: number, price?: number) {
  pushEvent('begin_checkout', {
    sku,
    quantity,
    price,
  });
}

