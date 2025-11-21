'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Package,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
  Filter,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/utils';

const OrdersManagement = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 20
  });

  const [updateForm, setUpdateForm] = useState({
    status: 'pending',
    trackingNumber: '',
    notes: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchDashboardStats();
  }, [filters.status, filters.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await api.get(`/admin/orders?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // The backend returns orders directly, not wrapped in success/orders
      setOrders(response.data);
      // Stats are handled separately
    } catch (error) {
      console.error('Fetch orders error:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // The backend returns stats directly
      setStats(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    // Validate tracking number for in_transit status
    if (updateForm.status === 'in_transit' && !updateForm.trackingNumber.trim()) {
      setError('Tracking number is required when status is In Transit');
      return;
    }

    try {
      setUpdateLoading(true);
      // Only send the fields that the backend expects
      const requestData = {
        status: updateForm.status
      };
      
      // Only include tracking number if it's not empty
      if (updateForm.trackingNumber && updateForm.trackingNumber.trim() !== '') {
        requestData.trackingNumber = updateForm.trackingNumber;
      }
      
      console.log('Sending request data:', requestData);
      console.log('Selected order ID:', selectedOrder.id);
      console.log('Current order status:', selectedOrder.status);
      console.log('New status being sent:', updateForm.status);
      
      const response = await api.patch(`/admin/orders/${selectedOrder.id}`, requestData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Update the order in the list
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? response.data.order : order
      ));
      setSelectedOrder(null);
      setUpdateForm({ status: 'pending', trackingNumber: '', notes: '' });
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Update order error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Show more specific error messages
      if (error.response?.status === 400) {
        setError(error.response?.data?.message || 'Invalid request data');
      } else if (error.response?.status === 404) {
        setError('Order not found');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again.');
      } else {
        setError(error.response?.data?.message || 'Failed to update order');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_transit':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">₹{stats.monthlyRevenue?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold">{stats.pendingOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalCompletedOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Orders Management</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
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
              <Package className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.users?.name || 'Unknown User'} • {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getStatusColor(order.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {order.payment_status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{order.order_items.length} items</p>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setUpdateForm({
                                  status: order.status || 'pending',
                                  trackingNumber: order.tracking_number || '',
                                  notes: order.notes || ''
                                });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Order #{order.id}</DialogTitle>
                              <DialogDescription>
                                Update the order status and add notes for the customer.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="status">Order Status</Label>
                                <Select value={updateForm.status} onValueChange={(value) => setUpdateForm(prev => ({ ...prev, status: value }))}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="rejected">Reject Order</SelectItem>
                                    <SelectItem value="in_transit">In Transit</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {updateForm.status === 'in_transit' && (
                                <div>
                                  <Label htmlFor="trackingNumber">Tracking Number *</Label>
                                  <Input
                                    id="trackingNumber"
                                    value={updateForm.trackingNumber}
                                    onChange={(e) => setUpdateForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                                    placeholder="Enter tracking number"
                                    required
                                  />
                                </div>
                              )}
                              
                              <div>
                                <Label htmlFor="notes">Order Notes</Label>
                                <Textarea
                                  id="notes"
                                  value={updateForm.notes}
                                  onChange={(e) => setUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                                  placeholder="Add notes for the customer..."
                                  rows={3}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateOrder} disabled={updateLoading}>
                                {updateLoading ? 'Updating...' : 'Update Order'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleOrderExpansion(order.id)}
                        >
                          {expandedOrders.has(order.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {expandedOrders.has(order.id) && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Order Items */}
                          <div>
                            <h4 className="font-semibold text-sm mb-3">Order Items</h4>
                            <div className="space-y-2">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex gap-3 p-2 border rounded">
                                  <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    {item.products.image_url ? (
                                      <img 
                                        src={item.products.image_url} 
                                        alt={item.products.name} 
                                        className="w-full h-full object-cover" 
                                      />
                                    ) : (
                                      <div className="w-4 h-4 bg-primary/20 rounded"></div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-xs truncate">{item.products.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {item.quantity} × ₹{parseFloat(item.price_at_purchase).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Customer & Payment Info */}
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Customer Information</h4>
                              <div className="text-xs space-y-1">
                                <p><span className="font-medium">Name:</span> {order.users?.name || 'Unknown User'}</p>
                                <p><span className="font-medium">Email:</span> {order.users?.email || 'No email'}</p>
                                {order.payment_id && (
                                  <p><span className="font-medium">Payment ID:</span> {order.payment_id}</p>
                                )}
                              </div>
                            </div>

                            {order.shipping_address && (
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Shipping Address</h4>
                                <div className="text-xs bg-muted/30 p-2 rounded">
                                  <pre className="whitespace-pre-wrap font-sans">{order.shipping_address}</pre>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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

export default OrdersManagement; 