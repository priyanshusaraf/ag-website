import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Phone } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 leather-texture">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold">
              Ready to Preserve Your <span className="premium-text">Collection?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Join thousands of collectors who trust André García to preserve 
              their most precious cigars. Experience the difference that true 
              craftsmanship makes.
            </p>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="shadow-luxury">
              <Link href="/products" className="flex items-center">
                Shop Our Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">
                Learn Our Story
              </Link>
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center space-x-4 py-8">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground font-medium">or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Contact Options */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-semibold">
              Need Personal Consultation?
            </h3>
            <p className="text-muted-foreground">
              Our experts are here to help you find the perfect storage solution 
              for your collection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="ghost" asChild className="flex items-center">
                <Link href="tel:+1-305-555-0123">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Us: (305) 555-0123
                </Link>
              </Button>
              <Button variant="ghost" asChild className="flex items-center">
                <Link href="mailto:info@andregarcia.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Email: info@andregarcia.com
                </Link>
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 border-t border-border/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">FREE SHIPPING</div>
                <div className="text-xs text-muted-foreground">
                  On orders over $500
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">LIFETIME WARRANTY</div>
                <div className="text-xs text-muted-foreground">
                  Quality guaranteed
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">30-DAY RETURNS</div>
                <div className="text-xs text-muted-foreground">
                  No questions asked
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA; 