"use client";

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useEffect, useState } from 'react';
import api from '../../lib/utils';

// Import chart components
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Component imports
import StatsOverview from './components/StatsOverview';
import OrdersManagement from './components/OrdersManagement';
import UsersManagement from './components/UsersManagement';
import ProductsManagement from './components/ProductsManagement';
import SaleBannersManagement from './components/SaleBannersManagement';
import GalleryManagement from './components/GalleryManagement';
import ReviewsManagement from './components/ReviewsManagement';
import CollectionsManagement from './components/CollectionsManagement';
import MessagesManagement from './components/MessagesManagement';
import CouponsManagement from './components/CouponsManagement';
import ReturnsManagement from './components/ReturnsManagement';
import AuditLogsManagement from './components/AuditLogsManagement';

export default function AdminPanel() {
  const { isLoading, isSuperAdmin, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stats');

  // Redirect to admin login if not authenticated as super admin
  useEffect(() => {
    if (!isLoading && !isSuperAdmin) {
      router.push('/admin/login');
    }
  }, [isLoading, isSuperAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm lg:text-base text-muted-foreground mt-1">Manage your e-commerce platform</p>
        </div>

        {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Tabs */}
          <TabsList className="hidden lg:flex w-full flex-wrap gap-1 h-auto p-1">
            <TabsTrigger value="stats">Dashboard</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="banners">Sale Banners</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>
          
          {/* Mobile Tabs - Responsive Grid */}
          <div className="lg:hidden space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <TabsList className="grid grid-cols-1">
                <TabsTrigger value="stats" className="text-xs">Dashboard</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1">
                <TabsTrigger value="orders" className="text-xs">Orders</TabsTrigger>
              </TabsList>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <TabsList className="grid grid-cols-1">
                <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1">
                <TabsTrigger value="products" className="text-xs">Products</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1">
                <TabsTrigger value="collections" className="text-xs">Collections</TabsTrigger>
              </TabsList>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <TabsList className="grid grid-cols-1">
                <TabsTrigger value="reviews" className="text-xs">Reviews</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1">
                <TabsTrigger value="banners" className="text-xs">Banners</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-1">
                <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
              </TabsList>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <TabsList className="grid grid-cols-1">
                <TabsTrigger value="gallery" className="text-xs">Carousel</TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <TabsContent value="stats" className="mt-6">
            <StatsOverview token={token} />
          </TabsContent>
          
          <TabsContent value="orders" className="mt-6">
            <OrdersManagement token={token} />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UsersManagement token={token} />
          </TabsContent>
          
          <TabsContent value="products" className="mt-6">
            <ProductsManagement token={token} />
          </TabsContent>
          
          <TabsContent value="collections" className="mt-6">
            <CollectionsManagement token={token} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ReviewsManagement token={token} />
          </TabsContent>
          
          <TabsContent value="banners" className="mt-6">
            <SaleBannersManagement token={token} />
          </TabsContent>
          
          <TabsContent value="messages" className="mt-6">
            <MessagesManagement token={token} />
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <GalleryManagement token={token} />
          </TabsContent>

          <TabsContent value="coupons" className="mt-6">
            <CouponsManagement token={token} />
          </TabsContent>

          <TabsContent value="returns" className="mt-6">
            <ReturnsManagement token={token} />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <AuditLogsManagement token={token} />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
} 