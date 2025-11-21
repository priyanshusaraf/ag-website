'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Hammer, Award, Users, Clock, Leaf, Shield, Heart, Globe } from 'lucide-react';
import BrandCarousel from '@/components/sections/BrandCarousel';

const About = () => {
  const values = [
    {
      icon: Hammer,
      title: "Master Craftsmanship",
      description: "Every piece is handcrafted by skilled artisans using techniques passed down through generations."
    },
    {
      icon: Leaf,
      title: "Premium Materials",
      description: "We source only the finest woods and materials from sustainable, responsibly managed forests."
    },
    {
      icon: Heart,
      title: "Passion for Excellence",
      description: "Our love for the craft drives us to continuously innovate and perfect our designs."
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "Each product comes with our lifetime warranty, reflecting our confidence in our work."
    }
  ];

  const timeline = [
    {
      year: "1985",
      title: "The Beginning",
      description: "André García opens his first workshop in Miami with a simple mission: create the perfect cigar storage solution."
    },
    {
      year: "1992",
      title: "First Award",
      description: "Our signature mahogany humidor wins the International Tobacco Excellence Award."
    },
    {
      year: "2001",
      title: "Global Expansion",
      description: "We begin serving collectors worldwide, establishing partnerships with luxury retailers."
    },
    {
      year: "2010",
      title: "Innovation",
      description: "Introduction of our revolutionary climate control technology for large cabinet humidors."
    },
    {
      year: "2020",
      title: "Sustainability",
      description: "Launch of our eco-friendly collection using certified sustainable materials."
    },
    {
      year: "2024",
      title: "Legacy Continues",
      description: "Celebrating 39 years of excellence with over 10,000 satisfied collectors worldwide."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel Background */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0">
          <BrandCarousel asBackground={true} />
        </div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">Since 1985</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white drop-shadow-2xl">
              The Story Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">André García</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
              What began as one man's passion for preserving the perfect cigar has evolved 
              into a legacy of uncompromising craftsmanship, serving collectors and 
              connoisseurs worldwide for nearly four decades.
            </p>
          </div>
        </div>
      </section>

      {/* Founder's Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                Meet the <span className="premium-text">Master</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  André García's journey began in 1985 when, as a young craftsman in Miami, 
                  he became frustrated with the poor quality of cigar storage solutions 
                  available in the market. His own precious collection was suffering, 
                  and he knew there had to be a better way.
                </p>
                <p>
                  Drawing from his background in fine woodworking and his deep understanding 
                  of cigar preservation, André set out to create the perfect humidor. 
                  What started as a personal project soon caught the attention of fellow 
                  enthusiasts who recognized the exceptional quality of his work.
                </p>
                <p>
                  Today, André's dedication to perfection continues to drive our workshop. 
                  Every piece that bears his name represents not just superior craftsmanship, 
                  but a deep respect for the cigars they protect and the collectors who 
                  cherish them.
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-primary">AG</span>
                </div>
                <div>
                  <div className="font-semibold">André García</div>
                  <div className="text-sm text-muted-foreground">Founder & Master Craftsman</div>
                </div>
              </div>
            </div>

            {/* Founder Image Placeholder */}
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center shadow-luxury">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                    <Hammer className="w-16 h-16 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-semibold">André García</h3>
                    <p className="text-sm text-muted-foreground">In his Miami workshop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Our <span className="premium-text">Values</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide every decision we make and every piece we create.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-premium transition-shadow">
                <CardContent className="p-0 space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Our <span className="premium-text">Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From a small Miami workshop to serving collectors worldwide.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-premium">
                      <span className="text-primary-foreground font-bold text-sm">{item.year}</span>
                    </div>
                  </div>
                  <div className="flex-grow pb-8 border-l border-border ml-8 pl-8 relative">
                    <div className="absolute left-0 top-6 w-4 h-4 bg-primary/20 rounded-full transform -translate-x-2"></div>
                    <h3 className="font-serif text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary/5 leather-texture">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-display font-bold premium-text">39</div>
              <div className="text-muted-foreground">Years of Excellence</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-display font-bold premium-text">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-display font-bold premium-text">25+</div>
              <div className="text-muted-foreground">Countries Served</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-display font-bold premium-text">100%</div>
              <div className="text-muted-foreground">Handcrafted</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Experience the <span className="premium-text">Difference</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Join the thousands of collectors who trust André García to preserve 
              their most precious cigars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="shadow-luxury">
                <Link href="/products">Explore Our Collection</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 