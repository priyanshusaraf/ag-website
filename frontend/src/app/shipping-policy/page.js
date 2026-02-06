import PolicyPage from '@/components/layout/PolicyPage';

export const metadata = {
  title: 'Shipping & Delivery Policy',
  description: 'Shipping and Delivery Policy for Andre Garcia Cases — timelines, charges, and delivery terms for orders within India.',
};

export default function ShippingPolicy() {
  return (
    <PolicyPage title="Shipping & Delivery Policy" lastUpdated="6 February 2026">
      <h2>1. Introduction</h2>
      <p>
        This Shipping &amp; Delivery Policy outlines the terms governing the dispatch, shipping, and delivery
        of products purchased from <strong>Andre Garcia Cases</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) through
        the website <strong>www.andregarciacases.com</strong> (the &quot;Website&quot;).
      </p>
      <p>
        By placing an order on the Website, you acknowledge and agree to the terms of this policy.
      </p>

      <h2>2. Important Disclaimer — No Sale of Tobacco or Smoking Products</h2>
      <p>
        <strong>Andre Garcia Cases does not sell cigars, tobacco, nicotine, or any smoking products.</strong> We
        exclusively sell cigar cases, accessories, and related storage products. Any images of cigars on the
        Website are used <strong>strictly for representational and illustrative purposes only</strong>.
      </p>

      <h2>3. Shipping Coverage</h2>
      <h3>3.1 Domestic Shipping (India)</h3>
      <p>
        We ship to all serviceable pin codes within India through our logistics partners. Delivery to certain
        remote areas may take additional time.
      </p>

      <h3>3.2 International Shipping</h3>
      <p>
        International shipping is available to select countries. International orders may be subject to customs
        duties, import taxes, and other charges levied by the destination country. These charges are the sole
        responsibility of the customer and are not included in the product price or shipping charges displayed
        on the Website.
      </p>
      <p>
        We are not responsible for delays caused by customs clearance processes.
      </p>

      <h2>4. Shipping Charges</h2>
      <p>
        Shipping charges, if applicable, are calculated based on the delivery location, weight of the package,
        and the shipping method selected. Shipping charges will be displayed at checkout before payment is
        confirmed. We may offer free shipping on orders above a certain value, as indicated on the Website from
        time to time.
      </p>

      <h2>5. Order Processing Time</h2>
      <table className="w-full border-collapse border border-border text-sm">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Order Type</th>
            <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Processing Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-border px-4 py-2">Standard orders (in-stock products)</td>
            <td className="border border-border px-4 py-2">1–3 business days</td>
          </tr>
          <tr>
            <td className="border border-border px-4 py-2">Custom or made-to-order products</td>
            <td className="border border-border px-4 py-2">7–21 business days (varies by product)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Processing time begins after successful payment confirmation. Orders placed on weekends or public
        holidays will be processed on the next business day.
      </p>

      <h2>6. Estimated Delivery Timelines</h2>
      <table className="w-full border-collapse border border-border text-sm">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Destination</th>
            <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Estimated Delivery Time (after dispatch)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-border px-4 py-2">Metro cities (Delhi, Mumbai, Bangalore, Kolkata, Chennai, Hyderabad)</td>
            <td className="border border-border px-4 py-2">3–5 business days</td>
          </tr>
          <tr>
            <td className="border border-border px-4 py-2">Tier 2 and Tier 3 cities</td>
            <td className="border border-border px-4 py-2">5–8 business days</td>
          </tr>
          <tr>
            <td className="border border-border px-4 py-2">Remote / rural areas</td>
            <td className="border border-border px-4 py-2">8–12 business days</td>
          </tr>
          <tr>
            <td className="border border-border px-4 py-2">International destinations</td>
            <td className="border border-border px-4 py-2">10–21 business days (varies by country)</td>
          </tr>
        </tbody>
      </table>
      <p>
        These timelines are estimates only and do not constitute a guarantee. Actual delivery times may vary
        due to factors beyond our control, including logistics partner performance, weather conditions,
        government restrictions, or force majeure events.
      </p>

      <h2>7. Order Tracking</h2>
      <p>
        Once your order has been dispatched, you will receive a confirmation email with the tracking number
        and a link to track your shipment. You may also track your order by logging into your account on the
        Website and visiting the &quot;Orders&quot; section.
      </p>
      <p>
        If you do not receive tracking information within 3 business days of order confirmation, please contact
        us at <a href="mailto:abhik@andregarciacases.com">abhik@andregarciacases.com</a>.
      </p>

      <h2>8. Delivery Attempts and Failed Deliveries</h2>
      <ul>
        <li>
          Our logistics partners will make up to <strong>2–3 delivery attempts</strong> at the shipping address
          provided by you.
        </li>
        <li>
          If delivery cannot be completed after all attempts (due to incorrect address, unavailability of
          recipient, or refusal to accept), the package will be returned to us.
        </li>
        <li>
          In such cases, we will contact you to arrange re-shipment. Additional shipping charges may apply for
          re-delivery.
        </li>
        <li>
          If re-delivery is not requested within 15 days, the order may be cancelled and a refund will be
          processed after deducting applicable shipping charges.
        </li>
      </ul>

      <h2>9. Incorrect or Incomplete Address</h2>
      <p>
        It is your responsibility to provide a correct and complete shipping address at the time of order
        placement. We are not responsible for delays or non-delivery resulting from incorrect, incomplete, or
        outdated address information. Address changes after dispatch may not be possible.
      </p>

      <h2>10. Inspection at Delivery</h2>
      <p>
        We recommend that you inspect the package at the time of delivery. If the outer packaging appears
        damaged or tampered with, please note the condition on the delivery receipt and contact us within
        <strong> 48 hours of delivery</strong> with photographs of the packaging and product.
      </p>

      <h2>11. Risk of Loss</h2>
      <p>
        Risk of loss and title for products passes to you upon delivery of the product to the shipping address
        provided by you, or upon handover to you or a person authorised by you at the delivery address.
      </p>

      <h2>12. Shipping Restrictions</h2>
      <p>
        Certain products may be subject to shipping restrictions based on applicable laws and regulations. We
        reserve the right to refuse shipment to any address or region where delivery is not feasible or is
        restricted by law.
      </p>

      <h2>13. Delays and Force Majeure</h2>
      <p>
        We shall not be held liable for any delays in shipping or delivery caused by circumstances beyond our
        reasonable control, including but not limited to natural disasters, pandemics, government restrictions,
        strikes, supply chain disruptions, or logistics partner delays.
      </p>

      <h2>14. Governing Law</h2>
      <p>
        This Shipping &amp; Delivery Policy is governed by the <strong>laws of India</strong>. Any disputes
        arising from this policy shall be subject to the <strong>exclusive jurisdiction of the courts in
        Kolkata, West Bengal, India</strong>.
      </p>

      <h2>15. Contact Us</h2>
      <p>For any shipping or delivery-related enquiries, please contact us at:</p>
      <p>
        <strong>Andre Garcia Cases</strong><br />
        Email: <a href="mailto:abhik@andregarciacases.com">abhik@andregarciacases.com</a><br />
        Website: <a href="https://www.andregarciacases.com">www.andregarciacases.com</a>
      </p>
    </PolicyPage>
  );
}
