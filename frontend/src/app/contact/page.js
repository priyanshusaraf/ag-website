'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Mail, Clock, MessageSquare, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    // Message length validation
    if (formData.message.trim().length < 10) {
      setError('Message must be at least 10 characters long.');
      setIsSubmitting(false);
      return;
    }

    // Construct mailto link
    const recipient = 'abhik@andregarciacases.com';
    const subjectLine = `Contact Form: ${formData.subject.trim()} - from ${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const body = [
      `Name: ${formData.firstName.trim()} ${formData.lastName.trim()}`,
      `Email: ${formData.email.trim()}`,
      formData.phone.trim() ? `Phone: ${formData.phone.trim()}` : '',
      `Subject: ${formData.subject.trim()}`,
      '',
      'Message:',
      formData.message.trim(),
    ].filter(Boolean).join('\n');

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;

    // Open the user's email client
    window.location.href = mailtoLink;

    setIsSubmitted(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-secondary/10 leather-texture">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              For enquiries regarding our cigar cases, accessories, orders, or any other matter,
              please reach out to us using the contact details or the form below.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-3xl mx-auto">
            <strong>Disclaimer:</strong> Andre Garcia Cases does not sell cigars, tobacco, nicotine, or any smoking products.
            We exclusively sell cigar cases, accessories, and storage products. Any images of cigars on this website are
            used strictly for representational and illustrative purposes only.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-light mb-6">
                  Andre Garcia Cases
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We are available Monday through Saturday during business hours.
                  For order-related queries, please include your order number in
                  your correspondence for faster resolution.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1.5 text-sm">Registered Address</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Andre Garcia Cases<br />
                        Kolkata, West Bengal<br />
                        India
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1.5 text-sm">Email</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed break-all">
                        <a href="mailto:abhik@andregarciacases.com" className="hover:text-primary transition-colors">
                          abhik@andregarciacases.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1.5 text-sm">Business Hours</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Mon – Sat: 10:00 AM – 6:00 PM IST<br />
                        Sun: Closed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1.5 text-sm">Response Time</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        We aim to respond to all enquiries within 24–48 hours on business days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-light mb-6">
                  Send Us a <span className="premium-text">Message</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Have a question about our products or need a custom solution? 
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <Card className="p-8 shadow-luxury">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">Email Client Opened!</h3>
                    <p className="text-muted-foreground mb-4">
                      Your email client should have opened with the message pre-filled. 
                      Simply hit send and we'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="">Select a subject</option>
                        <option value="product-inquiry">Product Inquiry</option>
                        <option value="custom-order">Custom Order</option>
                        <option value="consultation">Personal Consultation</option>
                        <option value="warranty">Warranty Claim</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        required
                        disabled={isSubmitting}
                        placeholder="Tell us about your needs, collection size, preferences, or any questions you might have..."
                        className="resize-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full shadow-luxury" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30 leather-texture">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-light mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions about our products and services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">Do you sell cigars or tobacco products?</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    No. Andre Garcia Cases exclusively sells cigar cases, accessories, and storage products.
                    We do not sell cigars, tobacco, nicotine, or any smoking products. Images of cigars on the
                    website are for representational purposes only.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    All payments are processed securely through Razorpay. We accept credit cards,
                    debit cards, UPI, net banking, and other methods supported by Razorpay.
                    We do not store your payment card details.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">How long does delivery take?</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Standard in-stock orders are dispatched within 1–3 business days. Delivery to metro cities
                    takes 3–5 business days; other locations may take 5–12 business days. Please see our{' '}
                    <a href="/shipping-policy" className="text-primary hover:underline">Shipping Policy</a> for details.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg">What is your return and refund policy?</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Returns may be initiated within 7 days of delivery for unused products in original
                    condition. Refunds are processed via Razorpay to your original payment method within
                    7–10 business days. See our{' '}
                    <a href="/refund-policy" className="text-primary hover:underline">Refund &amp; Cancellation Policy</a> for full details.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Links */}
      <section className="py-8 border-t border-border bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm">
            <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms &amp; Conditions</a>
            <a href="/refund-policy" className="text-muted-foreground hover:text-foreground transition-colors">Refund &amp; Cancellation Policy</a>
            <a href="/shipping-policy" className="text-muted-foreground hover:text-foreground transition-colors">Shipping &amp; Delivery Policy</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 