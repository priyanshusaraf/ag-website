import jsPDF from 'jspdf';
import 'jspdf-autotable';

// $75 USD flat international shipping fee — must match paymentController constant
const INTERNATIONAL_SHIPPING_USD = 75;

export function generateInvoicePDF(order) {
  const doc       = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin    = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const brandColor = [139, 69, 19]; // #8b4513
  const darkGray   = [51, 51, 51];
  const lightGray  = [128, 128, 128];
  const white      = [255, 255, 255];
  const amber      = [180, 100, 0];

  const shippingCharge = parseFloat(order.shipping_charge || 0);
  const isIntl         = order.is_international === true || shippingCharge > 0;

  // ── Header band ─────────────────────────────────────────────────────────────
  doc.setFillColor(...brandColor);
  doc.rect(0, 0, pageWidth, 36, 'F');

  doc.setTextColor(...white);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ANDRE GARCIA CASES', pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Cigar Containers', pageWidth / 2, 24, { align: 'center' });

  doc.setFontSize(8);
  doc.text('www.andregarciacases.com', pageWidth / 2, 31, { align: 'center' });

  // International order banner strip
  if (isIntl) {
    doc.setFillColor(...amber);
    doc.rect(0, 36, pageWidth, 7, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `INTERNATIONAL ORDER  ·  Flat shipping fee: $${INTERNATIONAL_SHIPPING_USD} USD`,
      pageWidth / 2, 41,
      { align: 'center' }
    );
  }

  y = isIntl ? 52 : 46;

  // ── INVOICE title + order meta ───────────────────────────────────────────────
  doc.setTextColor(...darkGray);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', margin, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightGray);

  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const rightX = pageWidth - margin;
  doc.text(`Order #${order.id}`,                                           rightX, y - 10, { align: 'right' });
  doc.text(`Date: ${orderDate}`,                                           rightX, y - 5,  { align: 'right' });
  doc.text(`Status: ${(order.status || 'pending').replace(/_/g, ' ').toUpperCase()}`, rightX, y, { align: 'right' });

  y += 10;

  doc.setDrawColor(...brandColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ── Bill To / Ship To ────────────────────────────────────────────────────────
  const colWidth = contentWidth / 2;

  doc.setTextColor(...brandColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', margin, y);

  doc.setTextColor(...darkGray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  y += 5;
  doc.text(order.users?.name  || 'Customer', margin, y); y += 4;
  doc.text(order.users?.email || '',          margin, y);
  if (order.phone) {
    y += 4;
    doc.text(`Ph: ${order.phone}`, margin, y);
  }

  let shipY = y - (order.phone ? 13 : 9);
  const shipX = margin + colWidth + 10;
  doc.setTextColor(...brandColor);
  doc.setFont('helvetica', 'bold');
  doc.text('SHIP TO', shipX, shipY);

  doc.setTextColor(...darkGray);
  doc.setFont('helvetica', 'normal');
  shipY += 5;

  if (order.shipping_address) {
    const addressLines = order.shipping_address.split('\n');
    for (const line of addressLines) {
      if (line.trim()) {
        doc.text(line.trim(), shipX, shipY);
        shipY += 4;
      }
    }
  }

  // Country badge for international orders
  if (isIntl && order.country) {
    doc.setTextColor(...amber);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(`🌍 International · ${order.country}`, shipX, shipY);
    shipY += 5;
  }

  y = Math.max(y + 4, shipY) + 8;

  // Payment ID
  if (order.payment_id) {
    doc.setTextColor(...lightGray);
    doc.setFontSize(8);
    doc.text(`Payment ID: ${order.payment_id}`, margin, y);
    y += 4;
  }
  y += 4;

  // ── Items table ──────────────────────────────────────────────────────────────
  const tableRows = (order.order_items || []).map((item, idx) => {
    const name    = item.products?.name || 'Product';
    const details = [
      item.products?.category,
      item.products?.quality,
      item.products?.size,
      item.products?.capacity,
    ].filter(Boolean).join(' | ');

    let customLine = '';
    if (item.customization_details) {
      try {
        const custom = JSON.parse(item.customization_details);
        customLine = Object.entries(custom)
          .filter(([, v]) => v && v !== 'N/A')
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
      } catch {}
    }

    const description = [details, customLine].filter(Boolean).join('\n');
    const unitPrice   = parseFloat(item.price_at_purchase);
    const lineTotal   = unitPrice * item.quantity;

    return [
      idx + 1,
      name + (description ? '\n' + description : ''),
      item.quantity,
      formatINR(unitPrice),
      formatINR(lineTotal),
    ];
  });

  doc.autoTable({
    startY: y,
    head:   [['#', 'Item', 'Qty', 'Unit Price', 'Total']],
    body:   tableRows,
    theme:  'striped',
    headStyles: { fillColor: brandColor, textColor: white, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8, textColor: darkGray },
    columnStyles: {
      0: { cellWidth: 10,   halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 15,   halign: 'center' },
      3: { cellWidth: 30,   halign: 'right' },
      4: { cellWidth: 30,   halign: 'right' },
    },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 10;

  // ── Totals ───────────────────────────────────────────────────────────────────
  const totalAmount     = parseFloat(order.total_amount);
  const discountAmount  = parseFloat(order.discount_amount || 0);
  // subtotal = total + discount - shipping (reverse-engineer the original items total)
  const subtotal        = totalAmount + discountAmount - shippingCharge;

  const totalsX = pageWidth - margin - 80;
  const valuesX = pageWidth - margin;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);

  doc.text('Subtotal:', totalsX, y);
  doc.text(formatINR(subtotal), valuesX, y, { align: 'right' });
  y += 6;

  if (discountAmount > 0) {
    doc.setTextColor(22, 163, 74);
    const discountLabel = order.discount_code
      ? `Discount (${order.discount_code}):`
      : 'Discount:';
    doc.text(discountLabel, totalsX, y);
    doc.text(`-${formatINR(discountAmount)}`, valuesX, y, { align: 'right' });
    doc.setTextColor(...darkGray);
    y += 6;
  }

  // Shipping row — labelled clearly for international orders
  if (isIntl) {
    doc.setTextColor(...amber);
    doc.text(`International Shipping ($${INTERNATIONAL_SHIPPING_USD} USD):`, totalsX, y);
    doc.text(formatINR(shippingCharge), valuesX, y, { align: 'right' });
    doc.setTextColor(...darkGray);
  } else {
    doc.text('Shipping:', totalsX, y);
    doc.setTextColor(22, 163, 74);
    doc.text('Free', valuesX, y, { align: 'right' });
    doc.setTextColor(...darkGray);
  }
  y += 6;

  doc.text('Tax:', totalsX, y);
  doc.text('Included', valuesX, y, { align: 'right' });
  y += 4;

  doc.setDrawColor(...brandColor);
  doc.setLineWidth(0.8);
  doc.line(totalsX - 5, y, pageWidth - margin, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...brandColor);
  doc.text('TOTAL PAID:', totalsX, y);
  doc.text(formatINR(totalAmount), valuesX, y, { align: 'right' });
  y += 16;

  // ── Footer ───────────────────────────────────────────────────────────────────
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setTextColor(...darkGray);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your purchase!', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setTextColor(...lightGray);
  doc.setFontSize(8);
  doc.text(
    'For any queries, please contact us at abhik@andregarciacases.com',
    pageWidth / 2, y, { align: 'center' }
  );

  doc.save(`AG-Invoice-Order-${order.id}.pdf`);
}

function formatINR(amount) {
  return '₹' + parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
