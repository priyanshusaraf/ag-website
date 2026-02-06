import Link from 'next/link';

export default function PolicyPage({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-light mb-3">{title}</h1>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-sm prose-neutral dark:prose-invert prose-headings:font-light prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            {children}
          </div>
        </div>
      </section>

      {/* Policy navigation */}
      <section className="py-8 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-muted-foreground mb-3">Other Policies</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms &amp; Conditions</Link>
              <Link href="/refund-policy" className="text-muted-foreground hover:text-foreground transition-colors">Refund &amp; Cancellation Policy</Link>
              <Link href="/shipping-policy" className="text-muted-foreground hover:text-foreground transition-colors">Shipping &amp; Delivery Policy</Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
