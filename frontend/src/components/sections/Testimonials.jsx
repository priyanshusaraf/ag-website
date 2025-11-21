import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marcus Bellweather",
      role: "Cigar Connoisseur",
      location: "New York, NY",
      rating: 5,
      text: "The craftsmanship is absolutely exceptional. My André García humidor has maintained perfect humidity for over 5 years now. It's not just functional—it's a work of art that enhances my study.",
      initials: "MB"
    },
    {
      name: "Elena Rodriguez",
      role: "Luxury Collector",
      location: "Miami, FL",
      rating: 5,
      text: "I've owned several high-end humidors, but nothing compares to the quality and attention to detail of my André García cabinet. The Spanish cedar lining and precision engineering are unmatched.",
      initials: "ER"
    },
    {
      name: "James Patterson",
      role: "Executive",
      location: "Chicago, IL",
      rating: 5,
      text: "The travel case has been my constant companion for years. It's survived countless trips while keeping my cigars in perfect condition. The leather craftsmanship is absolutely stunning.",
      initials: "JP"
    }
  ];

  return (
    <section className="py-20 bg-muted/30 leather-texture">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            What Our <span className="premium-text">Collectors</span> Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust André García 
            to preserve their most precious cigar collections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative bg-card border-border/50 shadow-premium hover:shadow-luxury transition-shadow duration-300">
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-12 h-12 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-card rounded-lg p-8 shadow-luxury">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-display font-bold premium-text">10,000+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-display font-bold premium-text">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-display font-bold premium-text">99%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-display font-bold premium-text">39</div>
              <div className="text-sm text-muted-foreground">Years in Business</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 