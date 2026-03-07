import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/menuData';
import { TrendingUp, ShoppingBag, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalMenuItems: number;
}

export function AdminStats() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalMenuItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [ordersRes, menuRes] = await Promise.all([
      supabase.from('orders').select('status, total_amount'),
      supabase.from('menu_items').select('id', { count: 'exact', head: true }),
    ]);

    const orders = ordersRes.data || [];
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total_amount, 0);

    setStats({
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders: orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status)).length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
      totalMenuItems: menuRes.count || 0,
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-border/20 bg-card/80 animate-pulse">
            <CardContent className="p-5 h-24" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    { title: 'Total Pesanan', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'text-primary' },
    { title: 'Pendapatan', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'text-green-500' },
    { title: 'Sedang Diproses', value: stats.pendingOrders.toString(), icon: Clock, color: 'text-yellow-500' },
    { title: 'Selesai', value: stats.completedOrders.toString(), icon: CheckCircle, color: 'text-emerald-500' },
    { title: 'Dibatalkan', value: stats.cancelledOrders.toString(), icon: XCircle, color: 'text-red-500' },
    { title: 'Menu Tersedia', value: stats.totalMenuItems.toString(), icon: TrendingUp, color: 'text-accent' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/20 bg-card/80 backdrop-blur-sm shadow-card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <card.icon className={`h-4 w-4 ${card.color}`} />
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className={`text-xl font-display font-bold ${card.color}`}>{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
