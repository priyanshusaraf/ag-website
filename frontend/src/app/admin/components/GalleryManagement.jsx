'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/image-upload';
import { Trash2, Edit2, Save, X, Plus, GripVertical } from 'lucide-react';
import api from '@/lib/utils';

export default function GalleryManagement({ token }) {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    image_url: '',
    title: '',
    description: '',
    is_active: true,
    sort_order: 0
  });

  // Fetch gallery images
  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/gallery-images', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGalleryImages(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setError('Failed to fetch gallery images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGalleryImages();
    }
  }, [token]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image_url: imageUrl
    }));
  };

  // Add new gallery image
  const handleAdd = async () => {
    try {
      if (!formData.image_url || !formData.title) {
        setError('Image and title are required');
        return;
      }

      const response = await api.post('/admin/gallery-images', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setGalleryImages(prev => [...prev, response.data]);
      setFormData({
        image_url: '',
        title: '',
        description: '',
        is_active: true,
        sort_order: 0
      });
      setShowAddForm(false);
      setError('');
    } catch (error) {
      console.error('Error adding gallery image:', error);
      setError('Failed to add gallery image');
    }
  };

  // Start editing
  const startEditing = (image) => {
    setEditingId(image.id);
    setFormData({
      image_url: image.image_url,
      title: image.title,
      description: image.description || '',
      is_active: image.is_active,
      sort_order: image.sort_order
    });
  };

  // Save edit
  const saveEdit = async () => {
    try {
      if (!formData.image_url || !formData.title) {
        setError('Image and title are required');
        return;
      }

      const response = await api.put(`/admin/gallery-images/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setGalleryImages(prev => 
        prev.map(img => img.id === editingId ? response.data : img)
      );
      setEditingId(null);
      setFormData({
        image_url: '',
        title: '',
        description: '',
        is_active: true,
        sort_order: 0
      });
      setError('');
    } catch (error) {
      console.error('Error updating gallery image:', error);
      setError('Failed to update gallery image');
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      image_url: '',
      title: '',
      description: '',
      is_active: true,
      sort_order: 0
    });
    setError('');
  };

  // Delete gallery image
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;

    try {
      await api.delete(`/admin/gallery-images/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setGalleryImages(prev => prev.filter(img => img.id !== id));
      setError('');
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      setError('Failed to delete gallery image');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Gallery Images Management</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading gallery images...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gallery Images Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage images that appear in the homepage carousel (below Featured Products). Images are displayed in the order shown below.
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Image
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Gallery Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-image">Image</Label>
                <ImageUpload
                  uploadType="banner"
                  onImageUploaded={handleImageUpload}
                  currentImage={formData.image_url}
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="add-title">Title</Label>
                  <Input
                    id="add-title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter image title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-description">Description</Label>
                  <Textarea
                    id="add-description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter image description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-sort-order">Sort Order</Label>
                  <Input
                    id="add-sort-order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                    placeholder="Display order"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="add-active"
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="add-active">Active</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>Add Image</Button>
              <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery Images List */}
      <div className="grid gap-4">
        {galleryImages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No gallery images found. Add your first image to get started!</p>
            </CardContent>
          </Card>
        ) : (
          galleryImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <CardContent className="p-6">
                {editingId === image.id ? (
                  /* Edit Form */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Image</Label>
                        <ImageUpload
                          uploadType="banner"
                          onImageUploaded={handleImageUpload}
                          currentImage={formData.image_url}
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Enter image title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter image description"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Sort Order</Label>
                          <Input
                            type="number"
                            value={formData.sort_order}
                            onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                            placeholder="Display order"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        className="rounded"
                      />
                      <Label>Active</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveEdit} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={cancelEdit} size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div className="relative">
                      {image.image_url && (
                        <img
                          src={image.image_url}
                          alt={image.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <Badge variant={image.is_active ? "default" : "secondary"}>
                          {image.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">#{image.sort_order}</Badge>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{image.title}</h3>
                          {image.description && (
                            <p className="text-sm text-gray-600 mt-1">{image.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">Order: {image.sort_order}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">
                              {new Date(image.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditing(image)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(image.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}