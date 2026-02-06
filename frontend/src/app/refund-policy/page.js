import PolicyPage from '@/components/layout/PolicyPage';

export const metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Refund and Cancellation Policy for Andre Garcia Cases — timelines, eligibility, and refund process via Razorpay.',
};

export default function RefundPolicy() {
  return (
    <PolicyPage title="Refund & Cancellation Policy" lastUpdated="6 February 2026">
      <h2>1. Introduction</h2>
      <p>
        This Refund &amp; Cancellation Policy outlines the terms under which customers may cancel orders and
        request refunds for products purchased from <strong>Andre Garcia Cases</strong> (&quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;) through the website <strong>www.andregarciacases.com</strong> (the &quot;Website&quot;).
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

      <h2>3. Order Cancellation</h2>
      <h3>3.1 Cancellation by Customer</h3>
      <ul>
        <li>
          <strong>Before dispatch:</strong> You may request cancellation of your order at any time before the
          order has been dispatched. To cancel, contact us at{' '}
          <a href="mailto:abhik@andregarciacases.com">abhik@andregarciacases.com</a> with your order number.
        </li>
        <li>
          <strong>After dispatch:</strong> Once the order has been dispatched, cancellation is not possible.
          You may, however, refuse delivery or initiate a return after receiving the product, subject to the
          conditions outlined in Section 4 below.
        </li>
      </ul>

      <h3>3.2 Cancellation by Andre Garcia Cases</h3>
      <p>We reserve the right to cancel any order for the following reasons:</p>
      <ul>
        <li>Product is out of stock or discontinued</li>
        <li>Pricing error on the Website</li>
        <li>Suspected fraudulent or unauthorised transaction</li>
        <li>Inability to verify payment or customer information</li>
        <li>Any other reason at our sole discretion</li>
      </ul>
      <p>
        In the event of cancellation by us, a full refund will be processed to your original payment method.
      </p>

      <h2>4. Returns and Eligibility</h2>
      <h3>4.1 Return Window</h3>
      <p>
        You may initiate a return request within <strong>7 (seven) calendar days</strong> from the date of
        delivery. Return requests made after this period will not be accepted.
      </p>

      <h3>4.2 Eligibility Conditions</h3>
      <p>To be eligible for a return, the product must:</p>
      <ul>
        <li>Be unused, undamaged, and in its original condition</li>
        <li>Be returned in its original packaging with all tags, labels, and accessories intact</li>
        <li>Not be a custom-made or personalised product (unless defective)</li>
      </ul>
      <p>We reserve the right to reject return requests for products that do not meet these conditions.</p>

      <h3>4.3 Damaged or Defective Products</h3>
      <p>
        If you receive a product that is damaged, defective, or materially different from what was ordered,
        please contact us within <strong>48 hours of delivery</strong> at{' '}
        <a href="mailto:abhik@andregarciacases.com">abhik@andregarciacases.com</a> with your order number and
        photographic evidence of the issue. We will arrange for a replacement or full refund at no additional cost.
      </p>

      <h3>4.4 Non-Returnable Items</h3>
      <p>The following products are not eligible for return:</p>
      <ul>
        <li>Custom-made or personalised products (unless received damaged or defective)</li>
        <li>Products that have been used, altered, or are not in their original condition</li>
        <li>Products returned without original packaging</li>
      </ul>

      <h2>5. Refund Process</h2>
      <h3>5.1 Refund Initiation</h3>
      <p>
        Once we receive and inspect the returned product, we will notify you of the approval or rejection of
        your refund request via email.
      </p>

      <h3>5.2 Refund Method</h3>
      <p>
        All approved refunds will be processed through <strong>Razorpay</strong> to your <strong>original payment
        method</strong> used at the time of purchase. This includes credit cards, debit cards, UPI, net banking,
        or any other payment method processed through Razorpay.
      </p>
      <p>
        <strong>We do not issue refunds via cash, cheque, or alternative payment methods.</strong>
      </p>

      <h3>5.3 Refund Timelines</h3>
      <table className="w-full border-collapse border border-border text-sm">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Scenario</th>
            <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">Refund Timeline</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-border px-4 py-2">Order cancelled before dispatch</td>
            <td className="border border-border px-4 py-2">5–7 business days from cancellation</td>
          </tr>
          <tr>
            <td className="border border-border px-4 py-2">Return approved (product received by us)</td>
            <td className="border border-border px-4 py-2">7–10 business days from receipt of returned product</td>
          </tr>
          <tr>
            <td className="border border-border px-4 py-2">Damaged/defective product reported</td>
            <td className="border border-border px-4 py-2">5–7 business days from approval of claim</td>
          </tr>
          <tr>
            <td className="border border-border px-4 py-2">Failed/duplicate payment</td>
            <td className="border border-border px-4 py-2">5–7 business days (automatic via Razorpay)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Actual credit to your account may take additional time depending on your bank or financial institution.
        Razorpay processes refunds within 5–7 business days; however, banks may take an additional 5–10 business
        days to reflect the credit in your account.
      </p>

      <h3>5.4 Partial Refunds</h3>
      <p>Partial refunds may be issued in the following circumstances:</p>
      <ul>
        <li>The returned product shows signs of use or is not in its original condition</li>
        <li>Components, accessories, or packaging are missing</li>
        <li>The return is initiated after the 7-day return window but is accepted at our discretion</li>
      </ul>

      <h2>6. Return Shipping</h2>
      <ul>
        <li>
          <strong>Defective or wrong products:</strong> Return shipping costs will be borne by Andre Garcia Cases.
          We will arrange for pickup or provide a prepaid shipping label.
        </li>
        <li>
          <strong>Change of mind or other returns:</strong> Return shipping costs are the responsibility of the
          customer. We recommend using a trackable shipping service, as we are not responsible for products lost
          in return transit.
        </li>
      </ul>

      <h2>7. Exchange</h2>
      <p>
        We do not offer direct exchanges at this time. If you wish to exchange a product, please initiate a
        return as described above and place a new order for the desired product.
      </p>

      <h2>8. How to Initiate a Return or Refund</h2>
      <p>To request a return or refund, please follow these steps:</p>
      <ol>
        <li>
          Email us at <a href="mailto:abhik@andregarciacases.com">abhik@andregarciacases.com</a> with the
          subject line: <strong>&quot;Return/Refund Request — [Your Order Number]&quot;</strong>
        </li>
        <li>Include the following in your email:
          <ul>
            <li>Order number</li>
            <li>Product name and quantity</li>
            <li>Reason for return/refund</li>
            <li>Photographs (if the product is damaged or defective)</li>
          </ul>
        </li>
        <li>Our team will review your request and respond within <strong>2 business days</strong>.</li>
        <li>If approved, we will provide instructions for returning the product.</li>
      </ol>

      <h2>9. Governing Law</h2>
      <p>
        This Refund &amp; Cancellation Policy is governed by the <strong>laws of India</strong>. Any disputes
        arising from this policy shall be subject to the <strong>exclusive jurisdiction of the courts in
        Kolkata, West Bengal, India</strong>.
      </p>

      <h2>10. Contact Us</h2>
      <p>For any questions regarding refunds or cancellations, please contact us at:</p>
      <p>
        <strong>Andre Garcia Cases</strong><br />
        Email: <a href="mailto:abhik@andregarciacases.com">abhik@andregarciacases.com</a><br />
        Website: <a href="https://www.andregarciacases.com">www.andregarciacases.com</a>
      </p>
    </PolicyPage>
  );
}
