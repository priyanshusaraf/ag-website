import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found | André García Premium Cigar Containers',
  description: 'The page you are looking for could not be found. Return to our homepage or explore our premium cigar container collection.',
};

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/30 to-background leather-texture">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-luxury border-0 bg-card/80 backdrop-blur">
            <CardContent className="p-12 text-center space-y-8">
              {/* 404 Number */}
              <div className="space-y-4">
                <div className="text-8xl md:text-9xl font-display font-bold premium-text leading-none">
                  404
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
              </div>

              {/* Message */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-serif font-bold">
                  Page Not <span className="premium-text">Found</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
                  The page you're looking for seems to have wandered off. 
                  Like a perfectly aged cigar, sometimes the best things 
                  require a little patience to find.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="shadow-md">
                    <Link href="/">
                      <Home className="mr-2 h-4 w-4" />
                      Return Home
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/products">
                      <Search className="mr-2 h-4 w-4" />
                      Browse Products
                    </Link>
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span>Need help? </span>
                  <Link 
                    href="/contact" 
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Contact our team
                  </Link>
                </div>
              </div>

              {/* Suggestions */}
              <div className="pt-8 border-t border-border/50">
                <h3 className="font-serif text-lg font-semibold mb-4">
                  Popular <span className="premium-text">Destinations</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link 
                    href="/products?category=Desktop Humidors" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded hover:bg-muted/50"
                  >
                    Desktop Humidors
                  </Link>
                  <Link 
                    href="/products?category=Travel Cases" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded hover:bg-muted/50"
                  >
                    Travel Cases
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded hover:bg-muted/50"
                  >
                    Our Story
                  </Link>
                  <Link 
                    href="/contact" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors p-2 rounded hover:bg-muted/50"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
