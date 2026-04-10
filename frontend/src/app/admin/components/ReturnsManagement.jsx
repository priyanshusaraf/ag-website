"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import api from '../../../lib/utils';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  refunded: 'bg-green-100 text-green-800',
};

export default function ReturnsManagement({ token }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState({});
  const [notes, setNotes] = useState({});
  const [refundAmounts, setRefundAmounts] = useState({});

  const headers = { Authorization: `Bearer ${token}` };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/returns/admin' : `/returns/admin?status=${filter}`;
      const res = await api.get(url, { headers });
      setRequests(res.data.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [token, filter]);

  const updateStatus = async (id, status) => {
    setUpdating(prev => ({ ...prev, [id]: true }));
    try {
      await api.patch(`/returns/admin/${id}`, {
        status,
        admin_notes: notes[id] || undefined,
        refund_amount: refundAmounts[id] || undefined,
      }, { headers });
      await fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Return & Refund Requests</CardTitle>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm bg-background">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="refunded">Refunded</option>
          </select>
        </CardHeader>
        <CardContent>
          {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
          {loading ? (
            <p>Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-muted-foreground text-sm">No return requests found.</p>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">Return Request #{req.id}</div>
                      <div className="text-sm text-muted-foreground">
                        Order #{req.order_id} · {req.users?.name} ({req.users?.email})
                      </div>
                      <div className="text-sm mt-1">
                        <span className="font-medium">Reason:</span> {req.reason.replace('_', ' ')}
                      </div>
                      {req.description && (
                        <div className="text-sm text-muted-foreground mt-1">{req.description}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Submitted: {new Date(req.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[req.status]}`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">Requested Refund:</span>{' '}
                    ₹{parseFloat(req.refund_amount || req.orders?.total_amount || 0).toLocaleString('en-IN')}
                  </div>

                  {req.admin_notes && (
                    <div className="text-sm bg-muted rounded p-2">
                      <span className="font-medium">Admin Notes:</span> {req.admin_notes}
                    </div>
                  )}

                  {req.status === 'pending' && (
                    <div className="space-y-2 border-t pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Refund Amount (₹)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={refundAmounts[req.id] || ''}
                            onChange={e => setRefundAmounts(prev => ({ ...prev, [req.id]: e.target.value }))}
                            placeholder={parseFloat(req.orders?.total_amount || 0).toFixed(2)}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Admin Notes</Label>
                          <Input
                            value={notes[req.id] || ''}
                            onChange={e => setNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                            placeholder="Optional notes"
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateStatus(req.id, 'approved')} disabled={updating[req.id]}>
                          Approve
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(req.id, 'refunded')} disabled={updating[req.id]}>
                          Approve & Refund
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateStatus(req.id, 'rejected')} disabled={updating[req.id]}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {req.status === 'approved' && (
                    <div className="flex gap-2 border-t pt-3">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(req.id, 'refunded')} disabled={updating[req.id]}>
                        Process Refund via Razorpay
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
