/**
 * Invoice PDF generation utilities
 * Generates professional invoices with order details
 */

import PDFDocument from 'pdfkit';
import { Order, OrderItem, Customer, ShippingInfo } from '@prisma/client';

export interface InvoiceData {
  order: Order & {
    items: OrderItem[];
    customer: Customer;
    shipping: ShippingInfo | null;
  };
  companyInfo?: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    siret?: string;
    tva?: string;
    email: string;
    phone?: string;
  };
}

/**
 * Calculate VAT amount (French standard rate: 20%)
 */
function calculateVAT(amount: number, rate: number = 0.20): number {
  return amount * rate;
}

/**
 * Calculate price excluding VAT (HT)
 */
function calculatePriceExclVAT(priceInclVAT: number, rate: number = 0.20): number {
  return priceInclVAT / (1 + rate);
}

/**
 * Generate invoice PDF as a buffer
 * @param invoiceData - Order and company information
 * @returns Promise<Buffer> - PDF as buffer
 */
export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `Facture ${invoiceData.order.orderNumber}`,
          Author: 'FETRA BEAUTY',
          Subject: 'Facture de commande',
          Creator: 'FETRA BEAUTY',
        },
      });

      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const { order, companyInfo } = invoiceData;

      // Default company info if not provided
      const company = companyInfo || {
        name: 'FETRA BEAUTY',
        address: '123 Rue de la Beauté',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        siret: '123 456 789 00012',
        tva: 'FR 12 123456789',
        email: 'contact@fetrabeauty.com',
        phone: '+33 1 23 45 67 89',
      };

      // Colors
      const primaryColor = '#2F5233'; // fetra-olive
      const accentColor = '#E8B4B8'; // fetra-pink
      const textColor = '#333333';
      const lightGray = '#F5F5F5';

      // Page width
      const pageWidth = doc.page.width;

      // ============================================
      // HEADER
      // ============================================
      doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold').text('FACTURE', 50, 50);

      // Invoice number and date
      doc
        .fontSize(10)
        .fillColor(textColor)
        .font('Helvetica')
        .text(`N° ${order.orderNumber}`, 50, 90)
        .text(
          `Date : ${new Date(order.createdAt).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}`,
          50,
          105
        );

      // ============================================
      // COMPANY INFO (Right side)
      // ============================================
      const rightColumnX = 350;
      doc
        .fontSize(12)
        .fillColor(primaryColor)
        .font('Helvetica-Bold')
        .text(company.name, rightColumnX, 50);

      doc
        .fontSize(9)
        .fillColor(textColor)
        .font('Helvetica')
        .text(company.address, rightColumnX, 70)
        .text(`${company.postalCode} ${company.city}`, rightColumnX, 85)
        .text(company.country, rightColumnX, 100);

      if (company.siret) {
        doc.text(`SIRET : ${company.siret}`, rightColumnX, 120);
      }
      if (company.tva) {
        doc.text(`TVA : ${company.tva}`, rightColumnX, 135);
      }

      doc.text(company.email, rightColumnX, 150);
      if (company.phone) {
        doc.text(company.phone, rightColumnX, 165);
      }

      // ============================================
      // CUSTOMER INFO
      // ============================================
      doc.moveDown(3);
      const customerY = 200;

      doc
        .fontSize(11)
        .fillColor(primaryColor)
        .font('Helvetica-Bold')
        .text('FACTURER À', 50, customerY);

      const customerName = order.customer.firstName && order.customer.lastName
        ? `${order.customer.firstName} ${order.customer.lastName}`
        : order.customer.email;

      doc
        .fontSize(10)
        .fillColor(textColor)
        .font('Helvetica')
        .text(customerName, 50, customerY + 20)
        .text(order.customer.email, 50, customerY + 35);

      // Add shipping address if available
      if (order.shipping) {
        doc
          .text(order.shipping.street, 50, customerY + 50)
          .text(`${order.shipping.postalCode} ${order.shipping.city}`, 50, customerY + 65)
          .text(order.shipping.country, 50, customerY + 80);
      }

      // ============================================
      // ORDER ITEMS TABLE
      // ============================================
      const tableTop = 330;
      const tableLeft = 50;
      const tableWidth = pageWidth - 100;

      // Table header
      doc.rect(tableLeft, tableTop, tableWidth, 30).fillAndStroke(primaryColor, primaryColor);

      doc
        .fontSize(9)
        .fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .text('DESCRIPTION', tableLeft + 10, tableTop + 10, { width: 220 })
        .text('QTÉ', tableLeft + 240, tableTop + 10, { width: 50, align: 'center' })
        .text('PRIX UNIT. HT', tableLeft + 300, tableTop + 10, { width: 90, align: 'right' })
        .text('TOTAL HT', tableLeft + 400, tableTop + 10, { width: 90, align: 'right' });

      // Table rows
      let rowY = tableTop + 40;
      const rowHeight = 30;

      order.items.forEach((item, index) => {
        const unitPriceHT = calculatePriceExclVAT(Number(item.unitPrice));
        const totalPriceHT = calculatePriceExclVAT(Number(item.totalPrice));

        // Alternate row background
        if (index % 2 === 0) {
          doc.rect(tableLeft, rowY - 5, tableWidth, rowHeight).fillAndStroke(lightGray, lightGray);
        }

        doc
          .fontSize(9)
          .fillColor(textColor)
          .font('Helvetica')
          .text(item.productName, tableLeft + 10, rowY, { width: 220 })
          .text(item.quantity.toString(), tableLeft + 240, rowY, { width: 50, align: 'center' })
          .text(`${unitPriceHT.toFixed(2)} €`, tableLeft + 300, rowY, { width: 90, align: 'right' })
          .text(`${totalPriceHT.toFixed(2)} €`, tableLeft + 400, rowY, { width: 90, align: 'right' });

        rowY += rowHeight;
      });

      // ============================================
      // TOTALS
      // ============================================
      const totalY = rowY + 20;
      const totalLabelX = tableLeft + 300;
      const totalValueX = tableLeft + 400;

      const totalHT = calculatePriceExclVAT(Number(order.amount));
      const vatAmount = calculateVAT(totalHT);
      const totalTTC = Number(order.amount);

      doc
        .fontSize(10)
        .fillColor(textColor)
        .font('Helvetica')
        .text('Sous-total HT :', totalLabelX, totalY, { width: 90, align: 'right' })
        .text(`${totalHT.toFixed(2)} €`, totalValueX, totalY, { width: 90, align: 'right' });

      doc
        .text('TVA (20%) :', totalLabelX, totalY + 20, { width: 90, align: 'right' })
        .text(`${vatAmount.toFixed(2)} €`, totalValueX, totalY + 20, { width: 90, align: 'right' });

      // Total TTC (highlighted)
      doc.rect(tableLeft + 290, totalY + 45, tableWidth - 290, 30).fillAndStroke(primaryColor, primaryColor);

      doc
        .fontSize(11)
        .fillColor('#FFFFFF')
        .font('Helvetica-Bold')
        .text('TOTAL TTC :', totalLabelX, totalY + 53, { width: 90, align: 'right' })
        .text(`${totalTTC.toFixed(2)} €`, totalValueX, totalY + 53, { width: 90, align: 'right' });

      // ============================================
      // PAYMENT INFO
      // ============================================
      const paymentY = totalY + 100;

      doc
        .fontSize(9)
        .fillColor(textColor)
        .font('Helvetica-Bold')
        .text('Informations de paiement', 50, paymentY);

      doc
        .font('Helvetica')
        .text(`Méthode de paiement : Carte bancaire (Stripe)`, 50, paymentY + 15)
        .text(`Statut : ${order.status === 'PAID' ? 'Payé' : 'En attente'}`, 50, paymentY + 30);

      if (order.paidAt) {
        doc.text(
          `Date de paiement : ${new Date(order.paidAt).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          50,
          paymentY + 45
        );
      }

      // ============================================
      // FOOTER
      // ============================================
      const footerY = doc.page.height - 100;

      doc
        .fontSize(8)
        .fillColor('#999999')
        .font('Helvetica')
        .text(
          'TVA non applicable, article 293 B du CGI. Dispensé d\'immatriculation au registre du commerce et des sociétés (RCS) et au répertoire des métiers (RM).',
          50,
          footerY,
          { width: pageWidth - 100, align: 'center' }
        )
        .text(
          `${company.name} - ${company.address}, ${company.postalCode} ${company.city} - ${company.email}`,
          50,
          footerY + 25,
          { width: pageWidth - 100, align: 'center' }
        );

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate invoice filename
 */
export function generateInvoiceFilename(orderNumber: string): string {
  return `facture-${orderNumber}.pdf`;
}
