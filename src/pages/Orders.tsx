import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice } from '@/lib/menuData';
import type { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'] & {
  menu_items: { name: string; image_url: string | null } | null;
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Menunggu', color: 'bg-yellow-500', icon: <Clock className="h-4 w-4" /> },
  confirmed: { label: 'Dikonfirmasi', color: 'bg-blue-500', icon: <CheckCircle className="h-4 w-4" /> },
  preparing: { label: 'Sedang Dibuat', color: 'bg-orange-500', icon: <Package className="h-4 w-4" /> },
  ready: { label: 'Siap Diambil', color: 'bg-green-500', icon: <CheckCircle className="h-4 w-4" /> },
  completed: { label: 'Selesai', color: 'bg-gray-500', icon: <CheckCircle className="h-4 w-4" /> },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-500', icon: <XCircle className="h-4 w-4" /> },
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<(Order & { order_items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (name, image_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data as (Order & { order_items: OrderItem[] })[]);
      }
      setLoading(false);
    };

    fetchOrders();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('orders-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setOrders(prev => 
            prev.map(order => 
              order.id === payload.new.id 
                ? { ...order, ...payload.new as Order }
                : order
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-display font-bold text-foreground">Pesanan Saya</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Belum Ada Pesanan</h2>
            <p className="text-muted-foreground mb-6">Ayo pesan makanan favoritmu!</p>
            <Button onClick={() => navigate('/')}>Lihat Menu</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              
              return (
                <Card key={order.id} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <Badge className={`${status.color} text-white gap-1`}>
                        {status.icon}
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.menu_items?.image_url && (
                            <img
                              src={item.menu_items.image_url}
                              alt={item.menu_items?.name || ''}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.menu_items?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity}x {formatPrice(item.unit_price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-bold text-lg text-primary">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
