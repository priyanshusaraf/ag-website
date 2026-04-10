"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import api from '../../../lib/utils';

const emptyForm = {
  code: '',
  description: '',
  discount_type: 'percent',
  discount_value: '',
  min_order_amount: '',
  max_uses: '',
  expires_at: '',
};

export default function CouponsManagement({ token }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/coupons', { headers });
      setCoupons(res.data.coupons || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, [token]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await api.put(`/admin/coupons/${editing}`, form, { headers });
        setSuccessMsg('Coupon updated successfully');
      } else {
        await api.post('/admin/coupons', form, { headers });
        setSuccessMsg('Coupon created successfully');
      }
      setForm(emptyForm);
      setEditing(null);
      await fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditing(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount || '',
      max_uses: coupon.max_uses || '',
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : '',
    });
  };

  const handleDelete = async (id, code) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      await api.delete(`/admin/coupons/${id}`, { headers });
      await fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleToggle = async (coupon) => {
    try {
      await api.put(`/admin/coupons/${coupon.id}`, { ...coupon, is_active: !coupon.is_active }, { headers });
      await fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create / Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit Coupon' : 'Create Coupon'}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
          {successMsg && <Alert className="mb-4"><AlertDescription>{successMsg}</AlertDescription></Alert>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Code *</Label>
              <Input name="code" value={form.code} onChange={handleChange} placeholder="SUMMER20" required disabled={!!editing} className="uppercase" />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input name="description" value={form.description} onChange={handleChange} placeholder="Summer sale discount" />
            </div>
            <div className="space-y-1">
              <Label>Discount Type *</Label>
              <select name="discount_type" value={form.discount_type} onChange={handleChange} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Discount Value *</Label>
              <Input name="discount_value" type="number" step="0.01" min="0" value={form.discount_value} onChange={handleChange} placeholder={form.discount_type === 'percent' ? '20' : '500'} required />
            </div>
            <div className="space-y-1">
              <Label>Min. Order Amount (₹)</Label>
              <Input name="min_order_amount" type="number" step="0.01" min="0" value={form.min_order_amount} onChange={handleChange} placeholder="Leave blank for none" />
            </div>
            <div className="space-y-1">
              <Label>Max Uses</Label>
              <Input name="max_uses" type="number" min="1" value={form.max_uses} onChange={handleChange} placeholder="Leave blank for unlimited" />
            </div>
            <div className="space-y-1">
              <Label>Expires At</Label>
              <Input name="expires_at" type="datetime-local" value={form.expires_at} onChange={handleChange} />
            </div>
            <div className="flex gap-2 items-end">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Saving...' : editing ? 'Update Coupon' : 'Create Coupon'}
              </Button>
              {editing && (
                <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(emptyForm); }}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>All Coupons ({coupons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : coupons.length === 0 ? (
            <p className="text-muted-foreground text-sm">No coupons yet. Create one above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Code</th>
                    <th className="text-left py-2 px-3">Discount</th>
                    <th className="text-left py-2 px-3">Min. Order</th>
                    <th className="text-left py-2 px-3">Uses</th>
                    <th className="text-left py-2 px-3">Expires</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(coupon => (
                    <tr key={coupon.id} className="border-b hover:bg-muted/30">
                      <td className="py-2 px-3 font-mono font-bold">{coupon.code}</td>
                      <td className="py-2 px-3">
                        {coupon.discount_type === 'percent'
                          ? `${coupon.discount_value}%`
                          : `₹${parseFloat(coupon.discount_value).toLocaleString('en-IN')}`}
                      </td>
                      <td className="py-2 px-3">
                        {coupon.min_order_amount ? `₹${parseFloat(coupon.min_order_amount).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="py-2 px-3">
                        {coupon.uses_count}{coupon.max_uses ? `/${coupon.max_uses}` : ''}
                      </td>
                      <td className="py-2 px-3 text-xs">
                        {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(coupon)}>Edit</Button>
                          <Button size="sm" variant="outline" onClick={() => handleToggle(coupon)}>
                            {coupon.is_active ? 'Disable' : 'Enable'}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(coupon.id, coupon.code)}>Del</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
