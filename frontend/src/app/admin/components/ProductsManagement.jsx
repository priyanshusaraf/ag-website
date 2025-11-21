"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { ImageUpload } from '../../../components/ui/image-upload';
import api from '../../../lib/utils';

function ProductCard({ product, onEdit, onDelete, onToggleFeatured, onToggleNew, onSetSale, isLoading }) {
  const [saleForm, setSaleForm] = useState({
    discount_percent: product.discount_percent || '',
    sale_start_date: product.sale_start_date ? new Date(product.sale_start_date).toISOString().slice(0, 16) : '',
    sale_end_date: product.sale_end_date ? new Date(product.sale_end_date).toISOString().slice(0, 16) : '',
    on_sale: product.on_sale || false
  });

  const handleSaleSubmit = (e) => {
    e.preventDefault();
    onSetSale(product.id, {
      ...saleForm,
      sale_start_date: saleForm.sale_start_date ? new Date(saleForm.sale_start_date) : null,
      sale_end_date: saleForm.sale_end_date ? new Date(saleForm.sale_end_date) : null
    });
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {product.image_url && (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-20 h-20 object-cover rounded border"
            />
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{product.name}</h3>
              <div className="flex gap-1">
                {product.is_featured && (
                  <Badge variant="default">Featured</Badge>
                )}
                {product.is_new && (
                  <Badge variant="secondary">New</Badge>
                )}
                {product.on_sale && (
                  <Badge variant="destructive">Sale</Badge>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="font-bold">₹{parseFloat(product.price).toLocaleString()}</span>
                {product.sale_price && (
                  <span className="ml-2 text-sm text-green-600">
                    Sale: ₹{parseFloat(product.sale_price).toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                Stock: {product.stock}
              </span>
            </div>

            <div className="space-y-2">
              {/* Quick Actions */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant={product.is_featured ? "default" : "outline"}
                  onClick={() => onToggleFeatured(product.id, !product.is_featured)}
                  disabled={isLoading}
                >
                  {product.is_featured ? "Unfeature" : "Feature"}
                </Button>
                <Button
                  size="sm"
                  variant={product.is_new ? "secondary" : "outline"}
                  onClick={() => onToggleNew(product.id, !product.is_new)}
                  disabled={isLoading}
                >
                  {product.is_new ? "Mark Old" : "Mark New"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(product)}
                  disabled={isLoading}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(product.id, product.name)}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </div>

              {/* Sale Management */}
              <details className="mt-2">
                <summary className="text-sm text-muted-foreground cursor-pointer">
                  Sale Settings
                </summary>
                <form onSubmit={handleSaleSubmit} className="mt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`discount-${product.id}`} className="text-xs">Discount %</Label>
                      <Input
                        id={`discount-${product.id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={saleForm.discount_percent}
                        onChange={(e) => setSaleForm({...saleForm, discount_percent: e.target.value})}
                        className="text-xs h-8"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center space-x-1 text-xs">
                        <input
                          type="checkbox"
                          checked={saleForm.on_sale}
                          onChange={(e) => setSaleForm({...saleForm, on_sale: e.target.checked})}
                        />
                        <span>Active</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`start-${product.id}`} className="text-xs">Start Date</Label>
                      <Input
                        id={`start-${product.id}`}
                        type="datetime-local"
                        value={saleForm.sale_start_date}
                        onChange={(e) => setSaleForm({...saleForm, sale_start_date: e.target.value})}
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`end-${product.id}`} className="text-xs">End Date</Label>
                      <Input
                        id={`end-${product.id}`}
                        type="datetime-local"
                        value={saleForm.sale_end_date}
                        onChange={(e) => setSaleForm({...saleForm, sale_end_date: e.target.value})}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                  <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
                    Update Sale
                  </Button>
                </form>
              </details>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductForm({ product, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    image_url: product?.image_url || '',
    quality: product?.quality || '',
    size: product?.size || '',
    stock: product?.stock || 0,
    category: product?.category || '',
    capacity: product?.capacity || '',
    badge: product?.badge || '',
    badgeVariant: product?.badgeVariant || '',
    rating: product?.rating || 0,
    reviews: product?.reviews || 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean the form data before sending
    const cleanedData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      rating: parseFloat(formData.rating) || 0,
      reviews: parseInt(formData.reviews) || 0,
      // Convert empty strings to null for optional text fields
      description: formData.description?.trim() || null,
      image_url: formData.image_url?.trim() || null,
      quality: formData.quality?.trim() || null,
      size: formData.size?.trim() || null,
      category: formData.category?.trim() || null,
      capacity: formData.capacity?.trim() || null,
      badge: formData.badge?.trim() || null,
      badgeVariant: formData.badgeVariant?.trim() || null
    };
    
    console.log('Sending product data:', cleanedData);
    onSave(cleanedData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'rating' || name === 'reviews' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="quality">Quality</Label>
              <Input
                id="quality"
                name="quality"
                value={formData.quality}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                label="Product Image"
                currentImage={formData.image_url}
                onImageUploaded={(imageUrl) => setFormData(prev => ({ ...prev, image_url: imageUrl || '' }))}
                uploadType="product"
              />
            </div>
            <div>
              <Label htmlFor="badge">Badge Text</Label>
              <Input
                id="badge"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="badgeVariant">Badge Variant</Label>
              <select
                id="badgeVariant"
                name="badgeVariant"
                value={formData.badgeVariant}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">None</option>
                <option value="default">Default</option>
                <option value="secondary">Secondary</option>
                <option value="destructive">Destructive</option>
              </select>
            </div>
            <div>
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="reviews">Number of Reviews</Label>
              <Input
                id="reviews"
                name="reviews"
                type="number"
                min="0"
                value={formData.reviews}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Product'}
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

export default function ProductsManagement({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleSaveProduct = async (productData) => {
    setIsLoading(true);
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/admin/products', productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      await fetchProducts();
      setEditingProduct(null);
      setShowAddForm(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      await api.delete(`/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFeatured = async (id, isFeatured) => {
    setIsLoading(true);
    try {
      await api.patch(`/admin/products/${id}/featured`, { is_featured: isFeatured }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNew = async (id, isNew) => {
    setIsLoading(true);
    try {
      await api.patch(`/admin/products/${id}/new`, { is_new: isNew }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetSale = async (id, saleData) => {
    setIsLoading(true);
    try {
      await api.patch(`/admin/products/${id}/sale`, saleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProducts();
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
            <div className="text-lg">Loading products...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error loading products: {error}</div>
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
              <CardTitle>Products Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your product catalog ({products.length} products)
              </p>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              Add New Product
            </Button>
          </div>
        </CardHeader>
      </Card>

      {(showAddForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setEditingProduct(null);
            setShowAddForm(false);
          }}
          isLoading={isLoading}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={setEditingProduct}
            onDelete={handleDeleteProduct}
                          onToggleFeatured={handleToggleFeatured}
              onToggleNew={handleToggleNew}
              onSetSale={handleSetSale}
              isLoading={isLoading}
          />
        ))}
      </div>

      {!products.length && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground">
              No products found. Add your first product to get started.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 