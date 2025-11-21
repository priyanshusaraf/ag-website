"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ImageUpload } from '../../../components/ui/image-upload';
import { X, Plus, Eye, EyeOff } from 'lucide-react';
import api from '../../../lib/utils';

function HeroImageCard({ image, index, onUpdate, onRemove, isLoading }) {
  const [imageData, setImageData] = useState({
    url: image.url || '',
    title: image.title || '',
    active: image.active !== false
  });

  const handleChange = (field, value) => {
    const newData = { ...imageData, [field]: value };
    setImageData(newData);
    onUpdate(index, newData);
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <ImageUpload
              label={`Hero Image ${index + 1}`}
              currentImage={imageData.url}
              onImageUploaded={(imageUrl) => handleChange('url', imageUrl || '')}
              uploadType="hero"
              className="mb-4"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => onRemove(index)}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div>
            <Label htmlFor={`title-${index}`}>Image Title (Optional)</Label>
            <Input
              id={`title-${index}`}
              value={imageData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Descriptive title for the image"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant={imageData.active ? "default" : "outline"}
              size="sm"
              onClick={() => handleChange('active', !imageData.active)}
              disabled={isLoading}
              className="flex items-center space-x-1"
            >
              {imageData.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>{imageData.active ? 'Active' : 'Inactive'}</span>
            </Button>
          </div>
          
          {imageData.url && (
            <div className="text-xs text-muted-foreground">
              Preview: This image will appear as background in the homepage hero section
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function HeroImagesManagement({ token }) {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHeroImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/hero-images', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const images = res.data || [];
      setHeroImages(images.length > 0 ? images : [{ url: '', title: '', active: true }]);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      // Initialize with one empty image if fetch fails
      setHeroImages([{ url: '', title: '', active: true }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroImages();
  }, [token]);

  const handleSaveImages = async () => {
    setIsLoading(true);
    try {
      // Filter out images without URLs and ensure at least one active image
      const validImages = heroImages.filter(img => img.url);
      if (validImages.length === 0) {
        alert('Please add at least one hero image');
        return;
      }

      const hasActiveImage = validImages.some(img => img.active);
      if (!hasActiveImage) {
        alert('Please ensure at least one image is set to active');
        return;
      }

      await api.put('/admin/hero-images', { images: validImages }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Hero images updated successfully!');
      await fetchHeroImages();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewImage = () => {
    setHeroImages([...heroImages, { url: '', title: '', active: true }]);
  };

  const updateImage = (index, imageData) => {
    const newImages = [...heroImages];
    newImages[index] = imageData;
    setHeroImages(newImages);
  };

  const removeImage = (index) => {
    if (heroImages.length <= 1) {
      alert('At least one hero image slot is required');
      return;
    }
    const newImages = heroImages.filter((_, i) => i !== index);
    setHeroImages(newImages);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-lg">Loading hero images...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Background Images</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage the background images that appear in the homepage hero section (top of the page). 
            Active images will automatically rotate every 10 seconds behind the main text.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroImages.map((image, index) => (
              <HeroImageCard
                key={index}
                image={image}
                index={index}
                onUpdate={updateImage}
                onRemove={removeImage}
                isLoading={isLoading}
              />
            ))}
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button
              onClick={addNewImage}
              variant="outline"
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Image</span>
            </Button>
            
            <Button
              onClick={handleSaveImages}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <span>{isLoading ? 'Saving...' : 'Save Hero Images'}</span>
            </Button>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              Error: {error}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Preview Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Hero images appear as background images in the top hero section</p>
            <p>• Images automatically rotate every 10 seconds behind the main headline</p>
            <p>• Only active images will be displayed to visitors</p>
            <p>• At least one image must be active at all times</p>
            <p>• Images are optimized and cropped to fit the hero section</p>
            <p>• Changes take effect immediately after saving</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 