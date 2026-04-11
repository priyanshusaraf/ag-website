import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// $75 USD flat international shipping fee — must match paymentController constant
const INTERNATIONAL_SHIPPING_USD = 75;

/**
 * Generates a professional admin packing/dispatch invoice.
 * - Shows INTERNATIONAL ORDER banner when order.is_international is true.
 * - Includes full product details: name, material/quality, size, capacity,
 *   description, all customisation/engraving details.
 * - Includes complete shipment details (customer name, address, contact).
 * - Shows coupon/discount code applied if any.
 * - Shows shipping fee breakdown for international orders.
 */
export function generateAdminInvoicePDF(order) {
  const doc       = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin    = 20;
  let y           = margin;

  const brandColor = [139, 69, 19]; // #8b4513
  const darkGray   = [51, 51, 51];
  const lightGray  = [128, 128, 128];
  const white      = [255, 255, 255];
  const amber      = [180, 100, 0];
  const alertBg    = [255, 245, 220];

  const shippingCharge = parseFloat(order.shipping_charge || 0);
  const isIntl         = order.is_international === true || shippingCharge > 0;

  // ── Header band ─────────────────────────────────────────────────────────────
  doc.setFillColor(...brandColor);
  doc.rect(0, 0, pageWidth, 36, 'F');

  doc.setTextColor(...white);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ANDRE GARCIA CASES', pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Cigar Containers', pageWidth / 2, 23, { align: 'center' });

  doc.setFontSize(8);
  doc.text('www.andregarciacases.com  |  abhik@andregarciacases.com', pageWidth / 2, 31, { align: 'center' });

  // International order banner strip directly below the brand header
  if (isIntl) {
    doc.setFillColor(...amber);
    doc.rect(0, 36, pageWidth, 8, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `⚠  INTERNATIONAL ORDER  —  Country: ${order.country || 'N/A'}  —  Shipping Fee: $${INTERNATIONAL_SHIPPING_USD} USD`,
      pageWidth / 2, 41.5,
      { align: 'center' }
    );
  }

  y = isIntl ? 52 : 48;

  // ── Document title + order meta ─────────────────────────────────────────────
  doc.setTextColor(...darkGray);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('DISPATCH ORDER', margin, y);

  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightGray);
  const rightX = pageWidth - margin;
  doc.text(`Order #${order.id}`,                                                rightX, y - 8, { align: 'right' });
  doc.text(`Date: ${orderDate}`,                                                rightX, y - 3, { align: 'right' });
  doc.text(`Status: ${(order.status || 'pending').replace(/_/g, ' ').toUpperCase()}`, rightX, y + 2, { align: 'right' });

  y += 10;

  doc.setDrawColor(...brandColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ── Customer + Shipping info ─────────────────────────────────────────────────
  const colW = (pageWidth - margin * 2) / 2;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...brandColor);
  doc.text('CUSTOMER', margin, y);

  doc.setTextColor(...darkGray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  let leftY = y + 5;
  if (order.users?.name) {
    doc.text(order.users.name, margin, leftY);
    leftY += 4.5;
  }
  if (order.users?.email) {
    doc.text(order.users.email, margin, leftY);
    leftY += 4.5;
  }
  // Use the dedicated phone column first, fall back to users.phone
  const phone = order.phone || order.users?.phone;
  if (phone) {
    doc.text(`Ph: ${phone}`, margin, leftY);
    leftY += 4.5;
  }

  // Shipping column
  const shipX = margin + colW + 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...brandColor);
  doc.text('SHIP TO', shipX, y);

  doc.setTextColor(...darkGray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  let rightY = y + 5;
  if (order.shipping_address) {
    const addressLines = order.shipping_address.split('\n');
    for (const line of addressLines) {
      if (line.trim()) {
        doc.text(line.trim(), shipX, rightY);
        rightY += 4.5;
      }
    }
  }

  y = Math.max(leftY, rightY) + 6;

  // ── International shipping fee box ─────────────────────────────────────────
  if (isIntl) {
    doc.setFillColor(...alertBg);
    doc.setDrawColor(...amber);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 14, 2, 2, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...amber);
    doc.text('INTERNATIONAL SHIPPING FEE', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);
    const totalAmount    = parseFloat(order.total_amount);
    const discountAmount = parseFloat(order.discount_amount || 0);
    const subtotal       = totalAmount + discountAmount - shippingCharge;

    doc.text(
      `Subtotal: ${formatINR(subtotal)}   |   ` +
      `Shipping: ${formatINR(shippingCharge)} ($${INTERNATIONAL_SHIPPING_USD} USD)   |   ` +
      `Total Paid: ${formatINR(totalAmount)}`,
      margin + 4, y + 10
    );

    y += 20;
  }

  // ── Shipment details (tracking, carrier) ───────────────────────────────────
  if (order.tracking_number || order.carrier || order.estimated_delivery) {
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.rect(margin, y, pageWidth - margin * 2, 2, 'D');
    y += 5;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...brandColor);
    doc.text('SHIPMENT DETAILS', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkGray);
    const shipDetails = [
      order.tracking_number    && `Tracking Number: ${order.tracking_number}`,
      order.carrier            && `Carrier: ${order.carrier}`,
      order.estimated_delivery && `Estimated Delivery: ${order.estimated_delivery}`,
    ].filter(Boolean);
    for (const line of shipDetails) {
      doc.setFontSize(8);
      doc.text(line, margin, y);
      y += 4.5;
    }
    y += 3;
  }

  // ── Coupon / Discount info ──────────────────────────────────────────────────
  const discountAmount = parseFloat(order.discount_amount || 0);
  if (discountAmount > 0 || order.discount_code) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 130, 50);
    const discountText = order.discount_code
      ? `Discount Applied — Coupon: ${order.discount_code}`
      : 'Discount Applied';
    doc.text(discountText, margin, y);
    y += 6;
    doc.setTextColor(...darkGray);
  }

  y += 2;

  // ── Items table ─────────────────────────────────────────────────────────────
  const tableRows = (order.order_items || []).map((item, idx) => {
    const p = item.products || {};

    const specLines = [
      p.category && `Category: ${p.category}`,
      p.quality  && `Material / Quality: ${p.quality}`,
      p.size     && `Size: ${p.size}`,
      p.capacity && `Capacity: ${p.capacity}`,
    ].filter(Boolean);

    let customLines = [];
    if (item.customization_details) {
      try {
        const custom = JSON.parse(item.customization_details);
        customLines = Object.entries(custom)
          .filter(([, v]) => v && v !== 'N/A')
          .map(([k, v]) => `${capitalize(k)}: ${v}`);
      } catch {}
    }

    const allLines  = [...specLines, ...(customLines.length ? ['', 'Personalisation', ...customLines] : [])];
    const description = allLines.join('\n');

    return [
      idx + 1,
      p.name + (description ? '\n' + description : ''),
      item.quantity,
    ];
  });

  autoTable(doc, {
    startY: y,
    head:   [['#', 'Item & Details', 'Qty']],
    body:   tableRows,
    theme:  'striped',
    headStyles: { fillColor: brandColor, textColor: white, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8, textColor: darkGray },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 18, halign: 'center' },
    },
    margin: { left: margin, right: margin },
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 1) {
        const raw = data.cell.raw || '';
        if (raw.includes('\n'))                    data.cell.styles.minCellHeight = 10;
        if (raw.includes('\nPersonalisation\n'))   data.cell.styles.fontStyle = 'italic';
      }
    },
  });

  y = doc.lastAutoTable.finalY + 12;

  // ── Footer note for international dispatch ──────────────────────────────────
  if (isIntl) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...lightGray);
    doc.text(
      `International dispatch — ensure customs documentation is complete. Country: ${order.country || 'N/A'}`,
      pageWidth / 2, y, { align: 'center' }
    );
  }

  doc.save(`AG-Dispatch-Order-${order.id}.pdf`);
}

function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatINR(amount) {
  return '₹' + parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
