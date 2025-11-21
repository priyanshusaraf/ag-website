import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Hammer, Leaf, Award, Users } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Hammer,
      title: "Handcrafted Excellence",
      description: "Each piece is meticulously crafted by skilled artisans using traditional techniques passed down through generations."
    },
    {
      icon: Leaf,
      title: "Premium Materials",
      description: "We source only the finest woods, including mahogany, walnut, and exotic hardwoods, combined with Spanish cedar linings."
    },
    {
      icon: Award,
      title: "Award-Winning Design",
      description: "Our humidors have won numerous international awards for design excellence and functional innovation."
    },
    {
      icon: Users,
      title: "Trusted by Connoisseurs",
      description: "Over 10,000 satisfied customers worldwide trust us to preserve their most precious cigar collections."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                The Art of <span className="premium-text">Preservation</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Since 1985, André García has been synonymous with uncompromising quality 
                and artisan craftsmanship. What began as a passion project in a small 
                Miami workshop has evolved into the world's most trusted name in premium 
                cigar storage solutions.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-display font-bold text-primary">39</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Years of Excellence</h3>
                  <p className="text-muted-foreground text-sm">
                    Nearly four decades of perfecting the art of cigar preservation, 
                    serving collectors and connoisseurs worldwide.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-display font-bold text-primary">100%</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Handcrafted Quality</h3>
                  <p className="text-muted-foreground text-sm">
                    Every single piece is meticulously handcrafted by master artisans, 
                    ensuring unparalleled quality and attention to detail.
                  </p>
                </div>
              </div>
            </div>

            <Button asChild size="lg">
              <Link href="/about">
                Discover Our Story
              </Link>
            </Button>
          </div>

          {/* Visual/Features */}
          <div className="space-y-6">
            {/* Hero Image Placeholder */}
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center shadow-luxury">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                    <Hammer className="w-12 h-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-semibold">Master Craftsman</h3>
                    <p className="text-sm text-muted-foreground">At work in our Miami atelier</p>
                  </div>
                </div>
              </div>
              
              {/* Floating card */}
              <Card className="absolute -bottom-6 -right-6 w-48 shadow-luxury">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">10,000+</div>
                    <div className="text-sm text-muted-foreground">Happy Customers</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-4 hover:shadow-premium transition-shadow">
                  <CardContent className="p-0 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 