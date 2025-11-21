"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ImageUpload } from '../../../components/ui/image-upload';
import api from '../../../lib/utils';

function BannerCard({ banner, onEdit, onDelete, onToggleActive, isLoading }) {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {banner.image_url && (
            <img 
              src={banner.image_url} 
              alt={banner.title}
              className="w-full h-32 object-cover rounded"
            />
          )}
          
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{banner.title}</h3>
              <Badge variant={banner.is_active ? "default" : "secondary"}>
                {banner.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            
            {banner.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {banner.description}
              </p>
            )}
            
            <div className="text-xs text-muted-foreground space-y-1">
              {banner.start_date && (
                <div>Start: {new Date(banner.start_date).toLocaleDateString()}</div>
              )}
              {banner.end_date && (
                <div>End: {new Date(banner.end_date).toLocaleDateString()}</div>
              )}
              {banner.link_url && (
                <div>Link: {banner.link_url}</div>
              )}
              <div>Created: {new Date(banner.created_at).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={banner.is_active ? "default" : "outline"}
              onClick={() => onToggleActive(banner.id, !banner.is_active)}
              disabled={isLoading}
            >
              {banner.is_active ? "Deactivate" : "Activate"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(banner)}
              disabled={isLoading}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(banner.id, banner.title)}
              disabled={isLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BannerForm({ banner, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    description: banner?.description || '',
    image_url: banner?.image_url || '',
    link_url: banner?.link_url || '',
    is_active: banner?.is_active ?? true,
    start_date: banner?.start_date ? new Date(banner.start_date).toISOString().slice(0, 16) : '',
    end_date: banner?.end_date ? new Date(banner.end_date).toISOString().slice(0, 16) : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      start_date: formData.start_date ? new Date(formData.start_date) : null,
      end_date: formData.end_date ? new Date(formData.end_date) : null
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{banner ? 'Edit Sale Banner' : 'Create New Sale Banner'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Banner Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Summer Sale 50% Off!"
              />
            </div>
            <div>
              <Label htmlFor="link_url">Link URL (Optional)</Label>
              <Input
                id="link_url"
                name="link_url"
                type="url"
                value={formData.link_url}
                onChange={handleChange}
                placeholder="https://example.com/sale"
              />
            </div>
            <div>
              <Label htmlFor="start_date">Start Date (Optional)</Label>
              <Input
                id="start_date"
                name="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input
                id="end_date"
                name="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <ImageUpload
              label="Banner Image"
              currentImage={formData.image_url}
              onImageUploaded={(imageUrl) => setFormData(prev => ({ ...prev, image_url: imageUrl || '' }))}
              uploadType="banner"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded"
              placeholder="Don't miss our biggest sale of the year! Get up to 50% off on all products."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <Label htmlFor="is_active">Active (show on website)</Label>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Banner'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function SaleBannersManagement({ token }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/sale-banners', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBanners(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [token]);

  const handleSaveBanner = async (bannerData) => {
    setIsLoading(true);
    try {
      if (editingBanner) {
        await api.put(`/admin/sale-banners/${editingBanner.id}`, bannerData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/admin/sale-banners', bannerData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      await fetchBanners();
      setEditingBanner(null);
      setShowAddForm(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBanner = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      await api.delete(`/admin/sale-banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchBanners();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    setIsLoading(true);
    try {
      await api.patch(`/admin/sale-banners/${id}/active`, { is_active: isActive }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchBanners();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-lg">Loading sale banners...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error loading sale banners: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Sale Banners Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create and manage promotional banners for your website ({banners.length} banners)
              </p>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              Create New Banner
            </Button>
          </div>
        </CardHeader>
      </Card>

      {(showAddForm || editingBanner) && (
        <BannerForm
          banner={editingBanner}
          onSave={handleSaveBanner}
          onCancel={() => {
            setEditingBanner(null);
            setShowAddForm(false);
          }}
          isLoading={isLoading}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map(banner => (
          <BannerCard
            key={banner.id}
            banner={banner}
            onEdit={setEditingBanner}
            onDelete={handleDeleteBanner}
            onToggleActive={handleToggleActive}
            isLoading={isLoading}
          />
        ))}
      </div>

      {!banners.length && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              No sale banners found. Create your first promotional banner to get started.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 