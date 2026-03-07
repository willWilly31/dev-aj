import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '@/lib/menuData';
import { toast } from '@/components/ui/sonner';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];
type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'] & {
  menu_items: { name: string } | null;
};
type OrderWithItems = Order & { order_items: OrderItem[] };

const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Menunggu', color: 'bg-yellow-500' },
  { value: 'confirmed', label: 'Dikonfirmasi', color: 'bg-blue-500' },
  { value: 'preparing', label: 'Sedang Dibuat', color: 'bg-orange-500' },
  { value: 'ready', label: 'Siap Diambil', color: 'bg-green-500' },
  { value: 'completed', label: 'Selesai', color: 'bg-muted-foreground' },
  { value: 'cancelled', label: 'Dibatalkan', color: 'bg-red-500' },
];

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('active');

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*, menu_items(name))')
      .order('created_at', { ascending: false });
    if (data) setOrders(data as OrderWithItems[]);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) {
      toast.error('Gagal mengupdate status');
    } else {
      toast.success(`Status diubah ke ${statusOptions.find(s => s.value === status)?.label}`);
      fetchOrders();
    }
  };

  const filtered = orders.filter(o => {
    if (filter === 'active') return !['completed', 'cancelled'].includes(o.status);
    if (filter === 'completed') return o.status === 'completed';
    if (filter === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  if (loading) {
    return <div className="animate-pulse text-muted-foreground text-center py-8">Memuat pesanan...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-lg font-bold text-foreground">{filtered.length} Pesanan</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Tidak ada pesanan
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const statusInfo = statusOptions.find(s => s.value === order.status) || statusOptions[0];
            return (
              <Card key={order.id} className="border-border/20 bg-card/80">
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-sm font-medium">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {order.customer_name || 'Pelanggan'} • {new Date(order.created_at).toLocaleString('id-ID', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Select
                      value={order.status}
                      onValueChange={(v) => updateStatus(order.id, v as OrderStatus)}
                    >
                      <SelectTrigger className="w-auto h-7 text-xs gap-1 px-2">
                        <Badge className={`${statusInfo.color} text-white text-[10px] px-1.5`}>
                          {statusInfo.label}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <div className="space-y-1">
                    {order.order_items.map(item => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {item.quantity}x {item.menu_items?.name || 'Menu'}
                        </span>
                        <span className="text-foreground">{formatPrice(item.unit_price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-border/30 flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-bold text-primary">{formatPrice(order.total_amount)}</span>
                  </div>
                  {order.notes && (
                    <p className="mt-2 text-xs text-muted-foreground italic">📝 {order.notes}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
