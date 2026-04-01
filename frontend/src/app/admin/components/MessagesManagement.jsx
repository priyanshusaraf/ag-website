'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MessageSquare,
  Mail,
  Clock,
  CheckCircle,
  Reply,
  Eye,
  Filter,
  Phone,
  User,
  ShoppingCart,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/utils';

const MessagesManagement = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contact/messages', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error('Fetch messages error:', err);
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/contact/messages/${id}/read`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setMessages(msgs => msgs.map(m => m.id === id ? { ...m, is_read: true } : m));
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    try {
      setReplyLoading(true);
      await api.post(`/contact/messages/${selectedMessage.id}/reply`, {
        replyBody: replyText.trim(),
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setReplyText('');
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      console.error('Reply error:', err);
      setError('Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !m.is_read;
    return m.type === filter;
  });

  const unreadCount = messages.filter(m => !m.is_read && !m.is_admin).length;
  const customOrderCount = messages.filter(m => m.type === 'custom-order' && !m.is_read).length;

  const getTypeColor = (type) => {
    switch (type) {
      case 'custom-order': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'contact': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'admin-reply': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'shipping-update': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'custom-order': return 'Custom Order';
      case 'contact': return 'Contact';
      case 'admin-reply': return 'Admin Reply';
      case 'shipping-update': return 'Shipping Update';
      default: return type;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Mail className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Custom Orders</p>
                <p className="text-2xl font-bold">{customOrderCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Messages & Contact Submissions</CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="custom-order">Custom Orders</SelectItem>
                <SelectItem value="contact">Contact Forms</SelectItem>
                <SelectItem value="admin-reply">Admin Replies</SelectItem>
                <SelectItem value="shipping-update">Shipping Updates</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-8">
              <MessageSquare className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No messages found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((msg) => (
                <Card
                  key={msg.id}
                  className={`border-l-4 ${!msg.is_read && !msg.is_admin ? 'border-l-primary bg-primary/5' : 'border-l-transparent'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge className={getTypeColor(msg.type)}>
                            {getTypeLabel(msg.type)}
                          </Badge>
                          {!msg.is_read && !msg.is_admin && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/20 text-[10px]">New</Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm truncate">{msg.subject}</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {msg.sender_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {msg.sender_email}
                          </span>
                          {msg.sender_phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {msg.sender_phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(msg.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 whitespace-pre-line">
                          {msg.body}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!msg.is_read && !msg.is_admin && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(msg.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}

                        {!msg.is_admin && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedMessage(msg);
                                  setReplyText('');
                                  if (!msg.is_read) markAsRead(msg.id);
                                }}
                              >
                                <Reply className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Reply to {msg.sender_name}</DialogTitle>
                                <DialogDescription>
                                  Re: {msg.subject}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4">
                                <div className="bg-muted/30 p-3 rounded text-sm">
                                  <p className="font-medium mb-1">Original Message:</p>
                                  <p className="text-muted-foreground whitespace-pre-line">{msg.body}</p>
                                </div>

                                <div>
                                  <Label>Your Reply</Label>
                                  <Textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply..."
                                    rows={4}
                                  />
                                </div>
                              </div>

                              <DialogFooter>
                                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleReply} disabled={replyLoading || !replyText.trim()}>
                                  {replyLoading ? 'Sending...' : 'Send Reply'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesManagement;
