'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import api from '@/lib/utils';
import { hardcodedCollections } from '@/app/collections/[slug]/collectionDefaults';
import {
  Plus, Trash2, Edit2, Save, X, ArrowUp, ArrowDown, Image as ImageIcon,
  ChevronDown, ChevronRight, Package, Layers, GripVertical, Copy, Eye,
  Star, FolderPlus, Settings2
} from 'lucide-react';

/**
 * Convert the hardcoded collections object (keyed by slug) into the admin
 * array format used by CollectionsManagement.
 */
function convertDefaultsToAdminFormat(defaults) {
  if (!defaults || typeof defaults !== 'object') return [];
  return Object.entries(defaults)
    .filter(([, col]) => !col.redirect) // skip redirect-only entries
    .map(([slug, col]) => ({
      id: uid('col'),
      slug,
      name: col.name || '',
      tagline: col.tagline || '',
      description: col.description || '',
      heroImage: col.heroImage || '',
      featured: col.featured || false,
      startingPrice: col.startingPrice || (col.products?.[0]?.basePrice) || 0,
      products: (col.products || []).map((p) => ({
        id: p.id || uid('prod'),
        name: p.name || '',
        basePrice: p.basePrice || 0,
        images: p.images || [],
        availability: p.availability || '',
        description: p.description || '',
      })),
      features: col.features || [],
      leatherOptions: (col.leatherOptions || []).map((o) => ({
        id: uid('leather'),
        value: o.value || '',
        label: o.label || '',
        price: o.price || 0,
      })),
      sizeOptions: (col.sizeOptions || []).map((o) => ({
        id: uid('size'),
        value: o.value || '',
        label: o.label || '',
        description: o.description || '',
        price: o.price || 0,
      })),
      capacityOptions: (col.capacityOptions || []).map((o) => ({
        id: uid('cap'),
        value: o.value || '',
        label: o.label || '',
        price: o.price || 0,
      })),
      leatherLabel: col.leatherLabel || 'Leather',
      zodiacOptions: col.zodiacOptions || false,
      boneCarvingOptions: col.boneCarvingOptions || false,
      carouselImages: (col.carouselImages || []).map((img) => ({
        id: img.id || uid('carousel'),
        src: img.src || '',
        alt: img.alt || '',
        title: img.title || '',
      })),
    }));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Default empty structures
const emptyProduct = () => ({
  id: uid('prod'),
  name: '',
  basePrice: 0,
  images: [],
  availability: 'Usually ships in 4-6 weeks',
  description: '',
});

const emptyLeatherOption = () => ({
  id: uid('leather'),
  value: '',
  label: '',
  price: 0,
});

const emptySizeOption = () => ({
  id: uid('size'),
  value: '',
  label: '',
  description: '',
  price: 0,
});

const emptyCapacityOption = () => ({
  id: uid('cap'),
  value: '',
  label: '',
  price: 0,
});

const emptyCollection = () => ({
  id: uid('col'),
  slug: '',
  name: '',
  tagline: '',
  description: '',
  heroImage: '',
  featured: false,
  startingPrice: 0,
  products: [emptyProduct()],
  features: [''],
  leatherOptions: [emptyLeatherOption()],
  sizeOptions: [emptySizeOption()],
  capacityOptions: [],
  leatherLabel: 'Leather',
  zodiacOptions: false,
  boneCarvingOptions: false,
  carouselImages: [],
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2 font-medium text-sm">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          {title}
          {badge && <Badge variant="outline" className="ml-2 text-xs">{badge}</Badge>}
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="p-4 space-y-4 border-t border-border">{children}</div>}
    </div>
  );
}

function ImageListEditor({ images, onChange, label = 'Images' }) {
  const addImage = () => onChange([...images, '']);
  const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx));
  const updateImage = (idx, val) => {
    const copy = [...images];
    copy[idx] = val;
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addImage} className="flex items-center gap-1">
          <Plus className="h-3 w-3" /> Add Image
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="border border-border rounded-lg p-3 bg-muted/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Image {idx + 1}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(idx)} className="text-destructive h-6 w-6">
                <X className="h-3 w-3" />
              </Button>
            </div>
            <ImageUpload
              label=""
              uploadType="collection"
              currentImage={img || null}
              onImageUploaded={(url) => updateImage(idx, url || '')}
              className="[&>div>div]:h-32"
            />
          </div>
        ))}
      </div>
      {images.length === 0 && (
        <p className="text-xs text-muted-foreground">No images added yet. Click "Add Image" to upload one.</p>
      )}
    </div>
  );
}

function StringListEditor({ items, onChange, label, placeholder = 'Enter value...' }) {
  const addItem = () => onChange([...items, '']);
  const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));
  const updateItem = (idx, val) => {
    const copy = [...items];
    copy[idx] = val;
    onChange(copy);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="flex items-center gap-1">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => updateItem(idx, e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)} className="text-destructive">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function OptionListEditor({ items, onChange, label, fields }) {
  const addItem = () => {
    const newItem = { id: uid('opt') };
    fields.forEach((f) => { newItem[f.key] = f.default ?? ''; });
    onChange([...items, newItem]);
  };
  const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));
  const updateItem = (idx, key, val) => {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [key]: val };
    onChange(copy);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="flex items-center gap-1">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      {items.map((item, idx) => (
        <div key={item.id || idx} className="grid gap-2 p-3 border border-border rounded-md bg-muted/20" style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr) auto` }}>
          {fields.map((f) => (
            <div key={f.key}>
              {idx === 0 && <Label className="text-xs text-muted-foreground mb-1 block">{f.label}</Label>}
              <Input
                type={f.type || 'text'}
                value={item[f.key] ?? ''}
                onChange={(e) => updateItem(idx, f.key, f.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                placeholder={f.placeholder || f.label}
                className="text-sm"
                step={f.step}
              />
            </div>
          ))}
          <div className={idx === 0 ? 'pt-5' : ''}>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)} className="text-destructive">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-xs text-muted-foreground">No options added. Click "Add" to create one.</p>
      )}
    </div>
  );
}

function ProductEditor({ product, onChange, onRemove, index }) {
  const update = (key, val) => onChange({ ...product, [key]: val });

  return (
    <div className="border border-border rounded-lg p-4 space-y-4 bg-muted/10">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          Product {index + 1}: {product.name || '(unnamed)'}
        </h4>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-1" /> Remove
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Product Name</Label>
          <Input value={product.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Manhattan 3 Finger Case" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Product Slug/ID</Label>
          <Input value={product.id} onChange={(e) => update('id', e.target.value)} placeholder="e.g. manhattan-3" className="font-mono text-sm" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Base Price (₹)</Label>
          <Input type="number" step="0.01" min="0" value={product.basePrice} onChange={(e) => update('basePrice', parseFloat(e.target.value) || 0)} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Availability</Label>
          <Input value={product.availability || ''} onChange={(e) => update('availability', e.target.value)} placeholder="Usually ships in 4-6 weeks" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Product Description</Label>
        <Textarea value={product.description || ''} onChange={(e) => update('description', e.target.value)} rows={3} placeholder="Detailed product description..." />
      </div>

      <ImageListEditor
        images={product.images || []}
        onChange={(imgs) => update('images', imgs)}
        label="Product Images"
      />
    </div>
  );
}

function CarouselEditor({ images, onChange }) {
  const addImage = () => onChange([...images, { id: uid('carousel'), src: '', alt: '', title: '' }]);
  const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx));
  const updateImage = (idx, key, val) => {
    const copy = [...images];
    copy[idx] = { ...copy[idx], [key]: val };
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm">Carousel Images</Label>
        <Button type="button" variant="outline" size="sm" onClick={addImage} className="flex items-center gap-1">
          <Plus className="h-3 w-3" /> Add Image
        </Button>
      </div>
      {images.map((img, idx) => (
        <div key={img.id || idx} className="p-4 border border-border rounded-lg bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Carousel Image {idx + 1}</span>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(idx)} className="text-destructive h-6 w-6">
              <X className="h-3 w-3" />
            </Button>
          </div>
          <ImageUpload
            label="Upload Image"
            uploadType="collection"
            currentImage={img.src || null}
            onImageUploaded={(url) => updateImage(idx, 'src', url || '')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Alt Text</Label>
              <Input value={img.alt || ''} onChange={(e) => updateImage(idx, 'alt', e.target.value)} placeholder="Image description" className="text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input value={img.title || ''} onChange={(e) => updateImage(idx, 'title', e.target.value)} placeholder="Image title" className="text-sm" />
            </div>
          </div>
        </div>
      ))}
      {images.length === 0 && (
        <p className="text-xs text-muted-foreground">No carousel images. Add images to create a rotating gallery for this collection.</p>
      )}
    </div>
  );
}

// ─── Collection Editor ────────────────────────────────────────────────────────

function CollectionEditor({ collection, onChange, onSave, onCancel, saving }) {
  const update = (key, val) => onChange({ ...collection, [key]: val });

  const autoSlug = (name) => {
    if (!collection.slug || collection.slug === slugify(collection._prevName || '')) {
      update('slug', slugify(name));
    }
    onChange((prev) => ({ ...prev, name, _prevName: name }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Layers className="h-5 w-5" />
          {collection.name || 'New Collection'}
        </h3>
        <div className="flex gap-2">
          <Button type="button" onClick={onSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save All Collections'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" /> Close
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <CollapsibleSection title="Basic Information" icon={Edit2} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Collection Name *</Label>
            <Input
              value={collection.name}
              onChange={(e) => {
                const name = e.target.value;
                // Auto-generate slug from name
                const prevSlug = slugify(collection._prevName || collection.name || '');
                const shouldAutoSlug = !collection.slug || collection.slug === prevSlug;
                const updates = { name, _prevName: name };
                if (shouldAutoSlug) updates.slug = slugify(name);
                onChange({ ...collection, ...updates });
              }}
              placeholder="e.g. Manhattan Collection"
            />
          </div>
          <div className="space-y-2">
            <Label>URL Slug *</Label>
            <Input
              value={collection.slug}
              onChange={(e) => update('slug', slugify(e.target.value))}
              placeholder="e.g. manhattan"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">URL: /collections/{collection.slug || '...'}</p>
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={collection.tagline}
              onChange={(e) => update('tagline', e.target.value)}
              placeholder="e.g. Urban Sophistication"
            />
          </div>
          <div className="space-y-2">
            <Label>Starting Price (₹)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={collection.startingPrice}
              onChange={(e) => update('startingPrice', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Description</Label>
            <Textarea
              value={collection.description}
              onChange={(e) => update('description', e.target.value)}
              rows={4}
              placeholder="Detailed collection description..."
            />
          </div>
          <div className="space-y-2">
            <ImageUpload
              label="Hero Image"
              uploadType="collection"
              currentImage={collection.heroImage || null}
              onImageUploaded={(url) => update('heroImage', url || '')}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`featured-${collection.id}`}
                checked={collection.featured}
                onChange={(e) => update('featured', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor={`featured-${collection.id}`}>Featured Collection</Label>
            </div>
            <div className="space-y-2">
              <Label>Leather Label Override</Label>
              <Input
                value={collection.leatherLabel || 'Leather'}
                onChange={(e) => update('leatherLabel', e.target.value)}
                placeholder="Leather"
              />
              <p className="text-xs text-muted-foreground">Customize the label shown for leather selection (e.g. "Finish", "Material")</p>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Products */}
      <CollapsibleSection title="Products" icon={Package} badge={`${(collection.products || []).length}`} defaultOpen={true}>
        <div className="space-y-4">
          {(collection.products || []).map((product, idx) => (
            <ProductEditor
              key={product.id}
              product={product}
              index={idx}
              onChange={(updated) => {
                const copy = [...(collection.products || [])];
                copy[idx] = updated;
                update('products', copy);
              }}
              onRemove={() => {
                if (!confirm(`Remove product "${product.name || 'unnamed'}"?`)) return;
                update('products', (collection.products || []).filter((_, i) => i !== idx));
              }}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => update('products', [...(collection.products || []), emptyProduct()])}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </CollapsibleSection>

      {/* Customization Options */}
      <CollapsibleSection title="Customization Options" icon={Settings2}>
        {/* Leather Options */}
        <OptionListEditor
          label="Leather / Finish Options"
          items={collection.leatherOptions || []}
          onChange={(items) => update('leatherOptions', items)}
          fields={[
            { key: 'value', label: 'Value (slug)', placeholder: 'croco-brown' },
            { key: 'label', label: 'Display Label', placeholder: 'Croco Brown' },
            { key: 'price', label: 'Extra Price (₹)', type: 'number', default: 0, step: '1' },
          ]}
        />

        <div className="border-t border-border my-4" />

        {/* Size Options */}
        <OptionListEditor
          label="Size Options"
          items={collection.sizeOptions || []}
          onChange={(items) => update('sizeOptions', items)}
          fields={[
            { key: 'value', label: 'Value', placeholder: 'robusto' },
            { key: 'label', label: 'Label', placeholder: 'Robusto' },
            { key: 'description', label: 'Description', placeholder: '5" x 50 ring' },
            { key: 'price', label: 'Extra (₹)', type: 'number', default: 0, step: '1' },
          ]}
        />

        <div className="border-t border-border my-4" />

        {/* Capacity Options */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id={`has-capacity-${collection.id}`}
              checked={(collection.capacityOptions || []).length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  update('capacityOptions', [emptyCapacityOption()]);
                } else {
                  update('capacityOptions', []);
                }
              }}
              className="rounded"
            />
            <Label htmlFor={`has-capacity-${collection.id}`}>Enable Capacity Selection</Label>
          </div>
          {(collection.capacityOptions || []).length > 0 && (
            <OptionListEditor
              label="Capacity Options"
              items={collection.capacityOptions}
              onChange={(items) => update('capacityOptions', items)}
              fields={[
                { key: 'value', label: 'Value', placeholder: '3-finger' },
                { key: 'label', label: 'Label', placeholder: '3 Finger' },
                { key: 'price', label: 'Extra (₹)', type: 'number', default: 0, step: '1' },
              ]}
            />
          )}
        </div>

        <div className="border-t border-border my-4" />

        {/* Zodiac & Bone Carving Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id={`zodiac-${collection.id}`}
              checked={collection.zodiacOptions}
              onChange={(e) => update('zodiacOptions', e.target.checked)}
              className="rounded"
            />
            <div>
              <Label htmlFor={`zodiac-${collection.id}`}>Zodiac Sign Selection</Label>
              <p className="text-xs text-muted-foreground">Customers can choose a zodiac sign for their case</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id={`bone-${collection.id}`}
              checked={collection.boneCarvingOptions}
              onChange={(e) => update('boneCarvingOptions', e.target.checked)}
              className="rounded"
            />
            <div>
              <Label htmlFor={`bone-${collection.id}`}>Bone Carving Options</Label>
              <p className="text-xs text-muted-foreground">Enable bone carving customization</p>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Features */}
      <CollapsibleSection title="Features" icon={Star} badge={`${(collection.features || []).filter(Boolean).length}`}>
        <StringListEditor
          label="Collection Features"
          items={collection.features || []}
          onChange={(items) => update('features', items)}
          placeholder="e.g. Cedar wood lining"
        />
      </CollapsibleSection>

      {/* Collection Carousel Images */}
      <CollapsibleSection title="Collection Carousel / Gallery" icon={ImageIcon} badge={`${(collection.carouselImages || []).length}`}>
        <p className="text-sm text-muted-foreground mb-3">
          Add rotating gallery images that showcase this collection. These will be displayed as a carousel on the collection page.
        </p>
        <CarouselEditor
          images={collection.carouselImages || []}
          onChange={(imgs) => update('carouselImages', imgs)}
        />
      </CollapsibleSection>
    </div>
  );
}

// ─── Collection List Card ─────────────────────────────────────────────────────

function CollectionCard({ collection, onSelect, onDuplicate, onDelete }) {
  return (
    <Card className="hover:border-primary/30 transition-colors cursor-pointer" onClick={onSelect}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {collection.heroImage ? (
            <div className="w-20 h-20 rounded border border-border overflow-hidden bg-muted flex-shrink-0">
              <img src={collection.heroImage} alt={collection.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
          ) : (
            <div className="w-20 h-20 rounded border border-border bg-muted flex items-center justify-center flex-shrink-0">
              <Layers className="h-8 w-8 text-muted-foreground/30" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold truncate">{collection.name || 'Unnamed Collection'}</h3>
                <p className="text-xs text-muted-foreground font-mono">/{collection.slug || '...'}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {collection.featured && <Badge variant="default" className="text-[10px]">Featured</Badge>}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{collection.tagline}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Package className="h-3 w-3" />{(collection.products || []).length} products</span>
              <span>From ₹{collection.startingPrice || 0}</span>
              {(collection.carouselImages || []).length > 0 && (
                <span className="flex items-center gap-1"><ImageIcon className="h-3 w-3" />{collection.carouselImages.length} carousel imgs</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button type="button" variant="ghost" size="icon" onClick={onDuplicate} title="Duplicate">
              <Copy className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={onDelete} title="Delete" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CollectionsManagement({ token }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  // Fetch collections from backend
  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/collections', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      if (data && Array.isArray(data.collections) && data.collections.length > 0) {
        setCollections(data.collections);
      } else {
        // No collections saved yet — auto-load from hardcoded defaults
        const defaults = convertDefaultsToAdminFormat(hardcodedCollections);
        setCollections(defaults);
        setHasUnsaved(true); // Mark so admin can review & save
      }
    } catch (e) {
      // If endpoint returns 404 or error, auto-load defaults
      console.log('No saved collections found, loading defaults');
      const defaults = convertDefaultsToAdminFormat(hardcodedCollections);
      setCollections(defaults);
      setHasUnsaved(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchCollections();
  }, [token, fetchCollections]);

  // Save all collections
  const saveCollections = async () => {
    setSaving(true);
    try {
      // Clean _prevName helper fields before saving
      const cleaned = collections.map((c) => {
        const { _prevName, ...rest } = c;
        return rest;
      });
      await api.put(
        '/admin/collections',
        { collections: cleaned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasUnsaved(false);
      alert('Collections saved successfully! The collections and product pages will now reflect these changes.');
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  // Import from hardcoded defaults
  const importDefaults = () => {
    if (collections.length > 0 && !confirm('This will merge default collections with your current data. Existing collections with the same slug will NOT be overwritten. Continue?')) {
      return;
    }
    const defaults = convertDefaultsToAdminFormat(hardcodedCollections);
    const existingSlugs = new Set(collections.map((c) => c.slug));
    const newCollections = defaults.filter((c) => !existingSlugs.has(c.slug));
    if (newCollections.length === 0) {
      alert('All default collections already exist.');
      return;
    }
    setCollections((prev) => [...prev, ...newCollections]);
    setHasUnsaved(true);
    alert(`Imported ${newCollections.length} new collection(s). Don't forget to save!`);
  };

  // Add new collection
  const addCollection = () => {
    const newCol = emptyCollection();
    setCollections((prev) => [...prev, newCol]);
    setEditingIdx(collections.length);
    setHasUnsaved(true);
  };

  // Duplicate collection
  const duplicateCollection = (idx) => {
    const col = collections[idx];
    const dup = {
      ...JSON.parse(JSON.stringify(col)),
      id: uid('col'),
      slug: `${col.slug}-copy`,
      name: `${col.name} (Copy)`,
    };
    // Generate new IDs for products
    dup.products = (dup.products || []).map((p) => ({ ...p, id: uid('prod') }));
    setCollections((prev) => [...prev, dup]);
    setHasUnsaved(true);
  };

  // Delete collection
  const deleteCollection = (idx) => {
    const col = collections[idx];
    if (!confirm(`Delete "${col.name || 'unnamed'}" collection? This cannot be undone.`)) return;
    setCollections((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) setEditingIdx(null);
    else if (editingIdx > idx) setEditingIdx(editingIdx - 1);
    setHasUnsaved(true);
  };

  // Move collection
  const moveCollection = (idx, direction) => {
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= collections.length) return;
    const copy = [...collections];
    [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
    setCollections(copy);
    if (editingIdx === idx) setEditingIdx(newIdx);
    else if (editingIdx === newIdx) setEditingIdx(idx);
    setHasUnsaved(true);
  };

  // Update a specific collection
  const updateCollection = (idx, updated) => {
    setCollections((prev) => {
      const copy = [...prev];
      copy[idx] = typeof updated === 'function' ? updated(copy[idx]) : updated;
      return copy;
    });
    setHasUnsaved(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-48 mx-auto" />
            <div className="h-4 bg-muted rounded w-64 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Editing mode
  if (editingIdx !== null && editingIdx < collections.length) {
    return (
      <CollectionEditor
        collection={collections[editingIdx]}
        onChange={(updated) => updateCollection(editingIdx, updated)}
        onSave={saveCollections}
        onCancel={() => setEditingIdx(null)}
        saving={saving}
      />
    );
  }

  // List mode
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Collections Management
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create and manage product collections. Each collection gets its own page at <span className="font-mono">/collections/[slug]</span>.
                {' '}({collections.length} collection{collections.length !== 1 ? 's' : ''})
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={addCollection} className="flex items-center gap-2">
                <FolderPlus className="h-4 w-4" /> New Collection
              </Button>
              <Button variant="outline" onClick={importDefaults} className="flex items-center gap-2">
                <Copy className="h-4 w-4" /> Import Defaults
              </Button>
              {hasUnsaved && (
                <Button onClick={saveCollections} disabled={saving} variant="default" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {hasUnsaved && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-4 py-3 rounded-md text-sm flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          You have unsaved changes. Click "Save Changes" to persist.
        </div>
      )}

      {collections.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Layers className="h-16 w-16 text-muted-foreground/30 mx-auto" />
            <div>
              <h3 className="font-semibold text-lg">No Collections Yet</h3>
              <p className="text-muted-foreground mt-1">
                Create your first collection or import the default ones to get started.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={addCollection}>
                <FolderPlus className="h-4 w-4 mr-2" /> Create Collection
              </Button>
              <Button variant="outline" onClick={importDefaults}>
                <Copy className="h-4 w-4 mr-2" /> Import Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {collections.map((col, idx) => (
            <div key={col.id || idx} className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => moveCollection(idx, 'up')}
                  disabled={idx === 0}
                  className="h-6 w-6"
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => moveCollection(idx, 'down')}
                  disabled={idx === collections.length - 1}
                  className="h-6 w-6"
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1">
                <CollectionCard
                  collection={col}
                  onSelect={() => setEditingIdx(idx)}
                  onDuplicate={() => duplicateCollection(idx)}
                  onDelete={() => deleteCollection(idx)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {collections.length > 0 && (
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={addCollection}>
            <FolderPlus className="h-4 w-4 mr-2" /> Add Another Collection
          </Button>
          <Button onClick={saveCollections} disabled={saving}>
            <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save All Collections'}
          </Button>
        </div>
      )}
    </div>
  );
}
