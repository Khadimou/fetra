import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../lib/product';

// Mock du produit
const mockProduct: Product = {
  sku: 'FETRA-RIT-001',
  title: 'Test Product',
  price: 49.9,
  value: 54.8,
  stock: 10,
  images: ['/test.jpg'],
  descriptionShort: 'Test description',
  howTo: ['Step 1', 'Step 2'],
};

// Mock de fetch pour les tests
global.fetch = vi.fn();

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should clamp quantity to stock maximum', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    
    // Simuler plusieurs clics pour dépasser le stock
    for (let i = 0; i < 15; i++) {
      fireEvent.click(increaseButton);
    }
    
    const quantityDisplay = container.querySelector('.min-w-\\[60px\\]');
    expect(quantityDisplay?.textContent).toBe('10'); // Ne devrait pas dépasser stock
  });

  it('should disable CTA when stock is 0', () => {
    const outOfStockProduct: Product = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    
    const buyButton = screen.getByRole('button', { name: /Acheter|Rupture/ });
    expect(buyButton).toBeDisabled();
  });

  it('should prevent quantity from going below 1', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const decreaseButton = screen.getByLabelText('Diminuer la quantité');
    
    // Simuler plusieurs clics pour descendre en dessous de 1
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    
    const quantityDisplay = container.querySelector('.min-w-\\[60px\\]');
    expect(quantityDisplay?.textContent).toBe('1'); // Minimum devrait être 1
  });

  it('should send correct checkout request body', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: 'https://checkout.stripe.com/test' }),
    });

    render(<ProductCard product={mockProduct} />);
    const buyButton = screen.getByRole('button', { name: /Acheter/ });
    
    fireEvent.click(buyButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: 'FETRA-RIT-001', quantity: 1 }),
      });
    });
  });

  it('should disable increase button when quantity equals stock', () => {
    render(<ProductCard product={mockProduct} />);
    const increaseButton = screen.getByLabelText('Augmenter la quantité');
    
    // Augmenter jusqu'au stock max
    for (let i = 0; i < 10; i++) {
      fireEvent.click(increaseButton);
    }
    
    expect(increaseButton).toBeDisabled();
  });
});

