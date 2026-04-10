'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, PackageX, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/utils';

const REASONS = [
  { value: 'defective', label: 'Defective or damaged product' },
  { value: 'wrong_item', label: 'Wrong item received' },
  { value: 'not_as_described', label: 'Not as described' },
  { value: 'changed_mind', label: 'Changed my mind' },
  { value: 'other', label: 'Other' },
];

const STATUS_BADGE = {
  pending: { label: 'Pending Review', class: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Approved', class: 'bg-blue-100 text-blue-800' },
  rejected: { label: 'Rejected', class: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refunded', class: 'bg-green-100 text-green-800' },
};

export default function ReturnsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const [tab, setTab] = useState('my-requests');
  const [orders, setOrders] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState({ order_id: '', reason: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?redirect=/returns');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingData(true);
    Promise.all([
      api.get('/payment/orders').catch(() => ({ data: { orders: [] } })),
      api.get('/returns/my').catch(() => ({ data: { requests: [] } })),
    ]).then(([ordersRes, returnsRes]) => {
      const allOrders = ordersRes.data.orders || [];
      // Only show returnable orders
      setOrders(allOrders.filter(o => ['confirmed', 'in_transit', 'completed'].includes(o.status)));
      setMyRequests(returnsRes.data.requests || []);
    }).finally(() => setLoadingData(false));
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.order_id || !form.reason) {
      setError('Please select an order and a reason');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post('/returns', form);
      setSuccess(true);
      // Refresh requests
      const res = await api.get('/returns/my');
      setMyRequests(res.data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <section className="py-4 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground">Returns & Refunds</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h1 className="text-3xl font-light mb-2">Returns & Refunds</h1>
          <p className="text-muted-foreground mb-8">
            We stand behind our craftsmanship. If you're not fully satisfied, we'll make it right.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${tab === 'my-requests' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
              onClick={() => setTab('my-requests')}
            >
              My Requests ({myRequests.length})
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${tab === 'new' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
              onClick={() => setTab('new')}
            >
              New Request
            </button>
          </div>

          {tab === 'my-requests' && (
            <div className="space-y-4">
              {myRequests.length === 0 ? (
                <div className="text-center py-12">
                  <PackageX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No return requests yet.</p>
                  <Button className="mt-4" onClick={() => setTab('new')}>Submit a Return Request</Button>
                </div>
              ) : (
                myRequests.map(req => {
                  const badge = STATUS_BADGE[req.status] || STATUS_BADGE.pending;
                  return (
                    <Card key={req.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <div className="font-semibold">Return Request #{req.id}</div>
                            <div className="text-sm text-muted-foreground">Order #{req.order_id}</div>
                            <div className="text-sm mt-1">
                              Reason: {REASONS.find(r => r.value === req.reason)?.label || req.reason}
                            </div>
                            {req.description && (
                              <div className="text-sm text-muted-foreground mt-1">{req.description}</div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                              Submitted {new Date(req.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                            {badge.label}
                          </span>
                        </div>
                        {req.admin_notes && (
                          <div className="mt-3 p-2 bg-muted rounded text-sm">
                            <span className="font-medium">Note from us:</span> {req.admin_notes}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {tab === 'new' && (
            <Card>
              <CardHeader>
                <CardTitle>Submit a Return Request</CardTitle>
                <CardDescription>
                  Return requests can be submitted for confirmed, in-transit, or completed orders.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Request Submitted</h3>
                    <p className="text-muted-foreground">We'll review your request and respond within 2-3 business days.</p>
                    <Button className="mt-4" onClick={() => { setSuccess(false); setTab('my-requests'); }}>View My Requests</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

                    <div className="space-y-1">
                      <Label>Select Order *</Label>
                      {orders.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-2">No eligible orders found. Only confirmed, in-transit, or completed orders can be returned.</p>
                      ) : (
                        <select
                          value={form.order_id}
                          onChange={e => setForm(f => ({ ...f, order_id: e.target.value }))}
                          className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                          required
                        >
                          <option value="">— Select an order —</option>
                          {orders.map(o => (
                            <option key={o.id} value={o.id}>
                              Order #{o.id} — ₹{parseFloat(o.total_amount).toLocaleString('en-IN')} ({o.status})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label>Reason for Return *</Label>
                      <select
                        value={form.reason}
                        onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                        className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                        required
                      >
                        <option value="">— Select a reason —</option>
                        {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label>Additional Details</Label>
                      <textarea
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        rows={3}
                        placeholder="Please describe the issue in detail..."
                        className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
                      />
                    </div>

                    <Button type="submit" disabled={submitting || orders.length === 0} className="w-full">
                      {submitting ? 'Submitting...' : 'Submit Return Request'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
