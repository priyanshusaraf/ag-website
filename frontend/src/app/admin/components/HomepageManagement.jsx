'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import api from '@/lib/utils';
import { defaultLookbookContent } from '@/components/lookbook/defaultLookbookContent';
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';

const BLOCK_TYPES = [
  { value: 'image', label: 'Image' },
  { value: 'headline', label: 'Headline' },
  { value: 'body', label: 'Body' },
  { value: 'kicker', label: 'Kicker' },
  { value: 'quote', label: 'Quote' },
  { value: 'bigNumber', label: 'Big Number' },
];

const VARIANTS_BY_TYPE = {
  image: [
    'full',
    'tall',
    'edgeLeftTall',
    'edgeRightTall',
    'inset',
    'insetRight',
    'bottomRight',
    'center',
    'fullBleedBottom',
    'bottomWide',
  ],
  headline: ['xl', 'lg', 'md', 'sm'],
  body: ['default'],
  kicker: ['default'],
  quote: ['default'],
  bigNumber: ['default'],
};

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function clampSpread(spread) {
  return {
    id: spread?.id || uid('spread'),
    pageLeft: {
      number: spread?.pageLeft?.number ?? '01',
      brand: spread?.pageLeft?.brand ?? 'Andre Garcia',
    },
    pageRight: {
      number: spread?.pageRight?.number ?? '02',
      brand: spread?.pageRight?.brand ?? 'Andre Garcia',
    },
    left: Array.isArray(spread?.left) ? spread.left : [],
    right: Array.isArray(spread?.right) ? spread.right : [],
  };
}

function WebsiteImagePicker({ onPick }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const fetchImages = async (q) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/assets/website-images?q=${encodeURIComponent(q || '')}`);
      const data = await res.json();
      setImages(data.images || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchImages('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => fetchImages(query), 200);
    return () => clearTimeout(t);
  }, [query, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Pick from website images
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Website images (public/website-imgs)</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search filename…"
          />
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-auto pr-2">
              {images.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => {
                    onPick(img.url);
                    setOpen(false);
                  }}
                  className="group border rounded-md overflow-hidden bg-background hover:bg-muted transition-colors"
                  title={img.name}
                >
                  <img src={img.url} alt={img.name} className="h-28 w-full object-cover" />
                  <div className="p-2 text-xs text-muted-foreground truncate">{img.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BlockEditor({ block, onChange, onRemove }) {
  const type = block.type || 'headline';
  const variants = VARIANTS_BY_TYPE[type] || ['default'];

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-44">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(v) => onChange({ ...block, type: v, variant: (VARIANTS_BY_TYPE[v] || ['default'])[0] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {BLOCK_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-44">
              <Label>Variant</Label>
              <Select value={block.variant || variants[0]} onValueChange={(v) => onChange({ ...block, variant: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Variant" />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="button" variant="destructive" size="sm" onClick={onRemove} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>

        {type === 'image' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={block.src || ''} onChange={(e) => onChange({ ...block, src: e.target.value })} placeholder="/website-imgs/…" />
              </div>
              <div className="flex gap-2 md:justify-end">
                <WebsiteImagePicker onPick={(url) => onChange({ ...block, src: url })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Alt text</Label>
              <Input value={block.alt || ''} onChange={(e) => onChange({ ...block, alt: e.target.value })} placeholder="Describe the image" />
            </div>

            <div className="space-y-2">
              <Label>Or upload (stores to backend uploads)</Label>
              <ImageUpload
                label="Upload homepage image"
                uploadType="homepage"
                currentImage={block.src || ''}
                onImageUploaded={(imageUrl) => onChange({ ...block, src: imageUrl || '' })}
              />
              <div className="text-xs text-muted-foreground">
                Uploaded images will look like: <span className="font-mono">http://…/uploads/homepage/…</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Text</Label>
            <Textarea value={block.text || ''} onChange={(e) => onChange({ ...block, text: e.target.value })} rows={3} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PageEditor({ title, page, blocks, onChangePage, onChangeBlocks }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Page number</Label>
              <Input value={page.number || ''} onChange={(e) => onChangePage({ ...page, number: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Brand label</Label>
              <Input value={page.brand || ''} onChange={(e) => onChangePage({ ...page, brand: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Blocks</div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            onChangeBlocks([
              ...blocks,
              { id: uid('block'), type: 'headline', variant: 'md', text: 'New headline' },
            ])
          }
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add block
        </Button>
      </div>

      <div className="space-y-3">
        {blocks.map((b, idx) => (
          <BlockEditor
            key={b.id}
            block={b}
            onChange={(next) => {
              const copy = [...blocks];
              copy[idx] = next;
              onChangeBlocks(copy);
            }}
            onRemove={() => {
              const copy = blocks.filter((x) => x.id !== b.id);
              onChangeBlocks(copy);
            }}
          />
        ))}

        {blocks.length === 0 && (
          <div className="text-sm text-muted-foreground border border-dashed rounded-md p-4">
            No blocks yet. Click “Add block”.
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomepageManagement({ token }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(defaultLookbookContent);
  const [selectedSpreadId, setSelectedSpreadId] = useState(null);

  const spreads = content?.spreads || [];
  const selectedSpread = useMemo(
    () => spreads.find((s) => s.id === selectedSpreadId) || spreads[0] || null,
    [spreads, selectedSpreadId]
  );

  useEffect(() => {
    if (!selectedSpreadId && spreads[0]?.id) setSelectedSpreadId(spreads[0].id);
  }, [spreads, selectedSpreadId]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/homepage', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent(res.data || defaultLookbookContent);
      setSelectedSpreadId((res.data?.spreads?.[0]?.id) || defaultLookbookContent.spreads[0].id);
    } catch (e) {
      // If missing, start from default template
      setContent(defaultLookbookContent);
      setSelectedSpreadId(defaultLookbookContent.spreads[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(
        '/admin/homepage',
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Homepage updated successfully.');
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const publishDefault = async () => {
    if (!confirm('Publish the default template? This will overwrite the current homepage content.')) return;
    setSaving(true);
    try {
      await api.put(
        '/admin/homepage',
        { content: defaultLookbookContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchContent();
      alert('Default template published.');
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm('Reset homepage content? This clears the published homepage and falls back to the built-in template.')) return;
    setSaving(true);
    try {
      await api.delete('/admin/homepage', { headers: { Authorization: `Bearer ${token}` } });
      await fetchContent();
      alert('Homepage reset.');
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const updateSpread = (spreadId, updater) => {
    const next = {
      ...content,
      spreads: spreads.map((s) => (s.id === spreadId ? updater(clampSpread(s)) : s)),
    };
    setContent(next);
  };

  const addSpread = () => {
    const newSpread = clampSpread({
      id: uid('spread'),
      pageLeft: { number: '00', brand: 'Andre Garcia' },
      pageRight: { number: '00', brand: 'Andre Garcia' },
      left: [{ id: uid('block'), type: 'headline', variant: 'md', text: 'New spread' }],
      right: [{ id: uid('block'), type: 'image', variant: 'full', src: '/website-imgs/website-background-img.jpg', alt: 'Image' }],
    });
    const next = { ...content, spreads: [...spreads, newSpread] };
    setContent(next);
    setSelectedSpreadId(newSpread.id);
  };

  const removeSpread = (spreadId) => {
    if (!confirm('Delete this spread?')) return;
    const nextSpreads = spreads.filter((s) => s.id !== spreadId);
    setContent({ ...content, spreads: nextSpreads });
    setSelectedSpreadId(nextSpreads[0]?.id || null);
  };

  const moveSpread = (spreadId, direction) => {
    const idx = spreads.findIndex((s) => s.id === spreadId);
    if (idx < 0) return;
    const nextIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= spreads.length) return;
    const copy = [...spreads];
    const [item] = copy.splice(idx, 1);
    copy.splice(nextIdx, 0, item);
    setContent({ ...content, spreads: copy });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">Loading homepage…</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Homepage (Lookbook)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Edit the homepage exactly like an editorial spread: every block (text/image), order, and placement style is editable.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Save homepage'}
              </Button>
              <Button variant="outline" onClick={publishDefault} disabled={saving}>
                Publish default template
              </Button>
              <Button variant="destructive" onClick={reset} disabled={saving}>
                Reset published homepage
              </Button>
            </div>
            <Button asChild variant="outline">
              <Link href="/" target="_blank" rel="noreferrer">
                View live homepage
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>SEO title</Label>
              <Input
                value={content?.seo?.title || ''}
                onChange={(e) => setContent({ ...content, seo: { ...(content.seo || {}), title: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <Label>SEO description</Label>
              <Input
                value={content?.seo?.description || ''}
                onChange={(e) =>
                  setContent({ ...content, seo: { ...(content.seo || {}), description: e.target.value } })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary CTA</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={content?.cta?.primaryLabel || ''}
                  onChange={(e) =>
                    setContent({ ...content, cta: { ...(content.cta || {}), primaryLabel: e.target.value } })
                  }
                  placeholder="Label"
                />
                <Input
                  value={content?.cta?.primaryHref || ''}
                  onChange={(e) =>
                    setContent({ ...content, cta: { ...(content.cta || {}), primaryHref: e.target.value } })
                  }
                  placeholder="/products"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={content?.cta?.secondaryLabel || ''}
                  onChange={(e) =>
                    setContent({ ...content, cta: { ...(content.cta || {}), secondaryLabel: e.target.value } })
                  }
                  placeholder="Label"
                />
                <Input
                  value={content?.cta?.secondaryHref || ''}
                  onChange={(e) =>
                    setContent({ ...content, cta: { ...(content.cta || {}), secondaryHref: e.target.value } })
                  }
                  placeholder="/about"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spread list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Spreads</div>
            <Button variant="outline" onClick={addSpread} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add spread
            </Button>
          </div>

          <div className="space-y-2">
            {spreads.map((s, idx) => {
              const selected = s.id === selectedSpreadId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSpreadId(s.id)}
                  className={`w-full text-left border rounded-md p-3 transition-colors ${
                    selected ? 'bg-muted border-border' : 'bg-background hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">
                      Spread {idx + 1}{' '}
                      <span className="text-xs text-muted-foreground">
                        ({s.pageLeft?.number}–{s.pageRight?.number})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          moveSpread(s.id, 'up');
                        }}
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          moveSpread(s.id, 'down');
                        }}
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeSpread(s.id);
                        }}
                        title="Delete spread"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Left blocks: {s.left?.length || 0} • Right blocks: {s.right?.length || 0}
                  </div>
                </button>
              );
            })}
          </div>

          {spreads.length === 0 && (
            <div className="text-sm text-muted-foreground border border-dashed rounded-md p-4">
              No spreads yet. Click “Add spread”.
            </div>
          )}
        </div>

        {/* Spread editor */}
        <div className="lg:col-span-8">
          {!selectedSpread ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">Select a spread to edit.</CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PageEditor
                  title="Left page"
                  page={selectedSpread.pageLeft}
                  blocks={selectedSpread.left || []}
                  onChangePage={(nextPage) =>
                    updateSpread(selectedSpread.id, (s) => ({ ...s, pageLeft: nextPage }))
                  }
                  onChangeBlocks={(nextBlocks) =>
                    updateSpread(selectedSpread.id, (s) => ({ ...s, left: nextBlocks }))
                  }
                />
                <PageEditor
                  title="Right page"
                  page={selectedSpread.pageRight}
                  blocks={selectedSpread.right || []}
                  onChangePage={(nextPage) =>
                    updateSpread(selectedSpread.id, (s) => ({ ...s, pageRight: nextPage }))
                  }
                  onChangeBlocks={(nextBlocks) =>
                    updateSpread(selectedSpread.id, (s) => ({ ...s, right: nextBlocks }))
                  }
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Tip: For “image” blocks, use “Pick from website images” to choose from `public/website-imgs` without uploading.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


