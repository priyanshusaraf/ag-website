'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  MessageSquare,
  Bell,
  Mail,
  Clock,
  Truck,
  Package,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/utils';

export default function MessagesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, token } = useAuth();

  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin?redirect=/account/messages');
      return;
    }
    if (token) {
      fetchAll();
    }
  }, [authLoading, isAuthenticated, token]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [msgRes, notifRes] = await Promise.all([
        api.get('/contact/user-messages', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { messages: [] } })),
        api.get('/orders/notifications', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
      ]);

      setMessages(msgRes.data.messages || []);
      setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'shipping-update': return <Truck className="h-4 w-4 text-purple-400" />;
      case 'admin-reply': return <Mail className="h-4 w-4 text-green-400" />;
      case 'custom-order': return <Package className="h-4 w-4 text-orange-400" />;
      default: return <MessageSquare className="h-4 w-4 text-blue-400" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'shipping-update': return 'Shipping Update';
      case 'admin-reply': return 'Reply from Andre Garcia';
      case 'custom-order': return 'Custom Order';
      default: return 'Message';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const allItems = [
    ...messages.map(m => ({ ...m, itemType: 'message', date: m.created_at })),
    ...notifications.map(n => ({ ...n, itemType: 'notification', date: n.created_at })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredItems = allItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'messages') return item.itemType === 'message';
    if (activeTab === 'notifications') return item.itemType === 'notification';
    if (activeTab === 'shipping') return item.type === 'shipping-update';
    return true;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-light">Messages & Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View shipping updates, order notifications, and replies from our team
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'notifications', 'messages', 'shipping'].map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'all' ? 'All' : tab === 'notifications' ? 'Order Updates' : tab === 'messages' ? 'Messages' : 'Shipping'}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No messages yet</h3>
              <p className="text-muted-foreground">
                Messages from our team, shipping updates, and order notifications will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, idx) => (
              <Card key={`${item.itemType}-${item.id}-${idx}`}>
                <CardContent className="p-4">
                  {item.itemType === 'notification' ? (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
                        <Bell className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{item.message}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.date)}
                        </p>
                      </div>
                      {!item.read && (
                        <Badge className="bg-primary/20 text-primary text-[10px]">New</Badge>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted/50 rounded-lg flex-shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px]">
                            {getTypeLabel(item.type)}
                          </Badge>
                          {item.is_admin && (
                            <Badge className="bg-green-500/10 text-green-400 text-[10px]">From Team</Badge>
                          )}
                        </div>
                        <h4 className="text-sm font-medium">{item.subject}</h4>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{item.body}</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.date)}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
