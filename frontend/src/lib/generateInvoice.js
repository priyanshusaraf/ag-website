import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generateInvoicePDF(order) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Brand colors
  const brandColor = [139, 69, 19]; // #8b4513
  const darkGray = [51, 51, 51];
  const lightGray = [128, 128, 128];

  // --- Header ---
  doc.setFillColor(...brandColor);
  doc.rect(0, 0, pageWidth, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ANDRE GARCIA CASES', pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Cigar Containers', pageWidth / 2, 24, { align: 'center' });

  doc.setFontSize(8);
  doc.text('www.andregarciacases.com', pageWidth / 2, 31, { align: 'center' });

  y = 46;

  // --- INVOICE Title ---
  doc.setTextColor(...darkGray);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', margin, y);

  // Order info on the right
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightGray);

  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const rightX = pageWidth - margin;
  doc.text(`Order #${order.id}`, rightX, y - 10, { align: 'right' });
  doc.text(`Date: ${orderDate}`, rightX, y - 5, { align: 'right' });
  doc.text(`Status: ${(order.status || 'pending').replace(/_/g, ' ').toUpperCase()}`, rightX, y, { align: 'right' });

  y += 10;

  // --- Divider ---
  doc.setDrawColor(...brandColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // --- Customer & Shipping Info ---
  const colWidth = contentWidth / 2;

  // Bill To
  doc.setTextColor(...brandColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', margin, y);

  doc.setTextColor(...darkGray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  y += 5;
  doc.text(order.users?.name || 'Customer', margin, y);
  y += 4;
  doc.text(order.users?.email || '', margin, y);

  // Ship To
  let shipY = y - 9;
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
      doc.text(line, shipX, shipY);
      shipY += 4;
    }
  }

  y = Math.max(y, shipY) + 8;

  // --- Payment Info ---
  if (order.payment_id) {
    doc.setTextColor(...lightGray);
    doc.setFontSize(8);
    doc.text(`Payment ID: ${order.payment_id}`, margin, y);
    y += 4;
  }

  y += 4;

  // --- Items Table ---
  const tableRows = (order.order_items || []).map((item, idx) => {
    const name = item.products?.name || 'Product';
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
    const unitPrice = parseFloat(item.price_at_purchase);
    const lineTotal = unitPrice * item.quantity;

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
    head: [['#', 'Item', 'Qty', 'Unit Price', 'Total']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: brandColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: darkGray,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
    margin: { left: margin, right: margin },
    didParseCell: function (data) {
      // Style the description lines lighter
      if (data.section === 'body' && data.column.index === 1) {
        const text = data.cell.raw || '';
        if (text.includes('\n')) {
          data.cell.styles.fontSize = 8;
        }
      }
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  // --- Totals ---
  const shippingCharge = parseFloat(order.shipping_charge || 0);
  const totalAmount = parseFloat(order.total_amount);
  const subtotal = totalAmount - shippingCharge;

  const totalsX = pageWidth - margin - 70;
  const valuesX = pageWidth - margin;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkGray);

  doc.text('Subtotal:', totalsX, y);
  doc.text(formatINR(subtotal), valuesX, y, { align: 'right' });
  y += 6;

  doc.text('Shipping:', totalsX, y);
  if (shippingCharge > 0) {
    doc.text(formatINR(shippingCharge), valuesX, y, { align: 'right' });
  } else {
    doc.setTextColor(22, 163, 74); // green
    doc.text('Free', valuesX, y, { align: 'right' });
    doc.setTextColor(...darkGray);
  }
  y += 6;

  doc.text('Tax:', totalsX, y);
  doc.text('Included', valuesX, y, { align: 'right' });
  y += 4;

  // Total divider
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

  // --- Footer ---
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
  doc.text('For any queries, please contact us at abhik@andregarciacases.com', pageWidth / 2, y, { align: 'center' });

  // --- Save ---
  doc.save(`AG-Invoice-Order-${order.id}.pdf`);
}

function formatINR(amount) {
  return '₹' + parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
