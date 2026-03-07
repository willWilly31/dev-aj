import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatPrice, categories } from '@/lib/menuData';
import { toast } from '@/components/ui/sonner';
import type { Database } from '@/integrations/supabase/types';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'nasi',
  image_url: '',
  is_popular: false,
  is_available: true,
};

export function AdminMenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .order('category')
      .order('name');
    if (data) setItems(data);
    setLoading(false);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      image_url: item.image_url || '',
      is_popular: item.is_popular,
      is_available: item.is_available,
    });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error('Nama, harga, dan kategori wajib diisi');
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseInt(form.price),
      category: form.category,
      image_url: form.image_url || null,
      is_popular: form.is_popular,
      is_available: form.is_available,
    };

    if (editingId) {
      const { error } = await supabase.from('menu_items').update(payload).eq('id', editingId);
      if (error) {
        toast.error('Gagal mengupdate menu');
      } else {
        toast.success('Menu berhasil diupdate');
      }
    } else {
      const { error } = await supabase.from('menu_items').insert(payload);
      if (error) {
        toast.error('Gagal menambah menu');
      } else {
        toast.success('Menu berhasil ditambahkan');
      }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus menu ini?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) {
      toast.error('Gagal menghapus menu');
    } else {
      toast.success('Menu berhasil dihapus');
      fetchItems();
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    await supabase
      .from('menu_items')
      .update({ is_available: !item.is_available })
      .eq('id', item.id);
    fetchItems();
  };

  const categoryOptions = categories.filter(c => c.id !== 'all');

  if (loading) {
    return <div className="animate-pulse text-muted-foreground text-center py-8">Memuat menu...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-lg font-bold text-foreground">{items.length} Menu</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Tambah
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingId ? 'Edit Menu' : 'Tambah Menu Baru'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Nama Menu *</Label>
                <Input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nasi Goreng Spesial"
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Deskripsi singkat menu"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Harga (Rp) *</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="15000"
                  />
                </div>
                <div>
                  <Label>Kategori *</Label>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.icon} {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>URL Gambar</Label>
                <Input
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch
                    checked={form.is_popular}
                    onCheckedChange={v => setForm(f => ({ ...f, is_popular: v }))}
                  />
                  <span className="text-sm">Populer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch
                    checked={form.is_available}
                    onCheckedChange={v => setForm(f => ({ ...f, is_available: v }))}
                  />
                  <span className="text-sm">Tersedia</span>
                </label>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? 'Menyimpan...' : editingId ? 'Update Menu' : 'Tambah Menu'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <Card key={item.id} className={`border-border/20 bg-card/80 ${!item.is_available ? 'opacity-60' : ''}`}>
            <CardContent className="p-3 flex items-center gap-3">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                  {item.is_popular && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">🔥</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Switch
                  checked={item.is_available}
                  onCheckedChange={() => toggleAvailability(item)}
                  className="scale-75"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
