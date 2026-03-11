import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { menuItems, categories, formatPrice, MenuItem } from '@/lib/menuData';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Search, X, Minus, Plus, Trash2, Printer, Bluetooth } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { connectPrinter, isPrinterConnected, getPrinterName, printReceipt as btPrintReceipt, ReceiptData } from '@/lib/bluetoothPrinter';

type OrderType = 'dine' | 'takeaway';
type PaymentMethod = 'cash' | 'transfer' | 'qris';

interface POSItem extends MenuItem {
  quantity: number;
  note?: string | null;
}

const TAX_RATE = 0.11;

const POS = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<POSItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('dine');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [printerConnected, setPrinterConnected] = useState(isPrinterConnected());
  const [printing, setPrinting] = useState(false);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, note: null }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.id !== id));
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    }
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + tax;
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cashNum = parseFloat(cashAmount) || 0;
  const change = cashNum - grandTotal;

  const handleConnectPrinter = async () => {
    try {
      await connectPrinter();
      setPrinterConnected(true);
      toast.success(`✅ Printer ${getPrinterName()} terhubung!`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handlePrint = async () => {
    if (!isPrinterConnected()) {
      toast.error('Hubungkan printer dulu!');
      return;
    }
    setPrinting(true);
    try {
      const receiptData: ReceiptData = {
        orderId: String(Date.now()).slice(-4),
        orderType,
        paymentMethod,
        items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity, note: i.note })),
        subtotal,
        tax,
        total: grandTotal,
        cashPaid: paymentMethod === 'cash' ? cashNum : undefined,
      };
      await btPrintReceipt(receiptData);
      toast.success('🖨️ Struk dicetak!');
    } catch (e: any) {
      toast.error('Gagal cetak: ' + e.message);
    } finally {
      setPrinting(false);
    }
  };

  const handleConfirm = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'cash' && cashNum < grandTotal) {
      toast.error(`Uang kurang ${formatPrice(grandTotal - cashNum)}`);
      return;
    }
    setShowReceipt(true);
  };

  const handleNewOrder = () => {
    setCart([]);
    setCashAmount('');
    setPaymentMethod('cash');
    setShowReceipt(false);
    toast.success('Pesanan baru siap!');
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Memuat...</div></div>;
  }
  if (!user || !isAdmin) {
    navigate('/');
    return null;
  }

  const quickCash = [10000, 20000, 50000, 100000, 200000].filter(n => n >= grandTotal).slice(0, 4);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="border-b border-border/30 bg-background/90 backdrop-blur-xl px-3 sm:px-4 py-2 flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-base sm:text-lg font-bold text-foreground">🧾 Kasir POS</h1>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Warkop AJ — Jl. Sei Bahorok No.66</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={handleConnectPrinter}
        >
          <Bluetooth className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{printerConnected ? getPrinterName() : 'Printer'}</span>
          <span className={cn('h-2 w-2 rounded-full', printerConnected ? 'bg-green-500' : 'bg-muted-foreground/30')} />
        </Button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Menu Grid */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-border/20">
          {/* Search + Categories */}
          <div className="p-3 sm:p-4 space-y-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border/50 bg-card py-2.5 pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full transition-all',
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
                  )}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
              {filteredItems.map((item) => {
                const inCart = cart.find(i => i.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className="relative flex flex-col rounded-xl bg-card border border-border/30 overflow-hidden text-left hover:shadow-md transition-all active:scale-[0.97] group"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-secondary">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2 sm:p-2.5 flex-1 flex flex-col">
                      <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-1">{item.name}</p>
                      <p className="text-xs font-bold text-primary mt-auto pt-1">{formatPrice(item.price)}</p>
                    </div>
                    {inCart && (
                      <span className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-md">
                        {inCart.quantity}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Cart Panel */}
        <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col border-t lg:border-t-0 bg-card/50 shrink-0 max-h-[45vh] lg:max-h-none overflow-hidden">
          {/* Order Type */}
          <div className="flex gap-1.5 p-3 shrink-0">
            <button
              onClick={() => setOrderType('dine')}
              className={cn('flex-1 py-2 text-xs rounded-lg font-bold transition-all', orderType === 'dine' ? 'bg-foreground text-background' : 'border border-border text-muted-foreground')}
            >
              🍽️ Dine In
            </button>
            <button
              onClick={() => setOrderType('takeaway')}
              className={cn('flex-1 py-2 text-xs rounded-lg font-bold transition-all', orderType === 'takeaway' ? 'bg-foreground text-background' : 'border border-border text-muted-foreground')}
            >
              🥡 Take Away
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-3 space-y-1.5">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="text-3xl">🛒</span>
                <p className="mt-2 text-sm text-muted-foreground">Tap menu untuk menambahkan</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-2 rounded-lg bg-background p-2 border border-border/20">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{formatPrice(item.price)} × {item.quantity} = {formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="h-6 w-6 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-80 transition-opacity">
                      <Plus className="h-3 w-3" />
                    </button>
                    <button onClick={() => updateQty(item.id, 0)} className="h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors ml-1">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary & Payment */}
          {cart.length > 0 && (
            <div className="p-3 border-t border-border/30 space-y-2 shrink-0">
              <div className="space-y-0.5 text-xs">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal ({totalItems} item)</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>PPN 11%</span><span>{formatPrice(tax)}</span></div>
                <div className="flex justify-between font-bold text-base pt-1 border-t border-border/30"><span>Total</span><span className="text-primary">{formatPrice(grandTotal)}</span></div>
              </div>

              {/* Payment */}
              <div className="grid grid-cols-3 gap-1.5">
                {([
                  { id: 'cash' as const, icon: '💵', label: 'Cash' },
                  { id: 'transfer' as const, icon: '🏦', label: 'Transfer' },
                  { id: 'qris' as const, icon: '📱', label: 'QRIS' },
                ]).map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={cn(
                      'py-2 rounded-lg border text-xs font-bold transition-all text-center',
                      paymentMethod === pm.id ? 'border-foreground bg-secondary' : 'border-border'
                    )}
                  >
                    {pm.icon} {pm.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'cash' && (
                <div className="space-y-1.5">
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="Jumlah bayar..."
                    className="w-full rounded-lg border border-border bg-background py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex gap-1.5 flex-wrap">
                    {quickCash.map((amt) => (
                      <button key={amt} onClick={() => setCashAmount(String(amt))} className="px-2 py-1 text-[10px] rounded-md bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors">
                        {formatPrice(amt)}
                      </button>
                    ))}
                    <button onClick={() => setCashAmount(String(grandTotal))} className="px-2 py-1 text-[10px] rounded-md bg-primary text-primary-foreground font-semibold">
                      Uang Pas
                    </button>
                  </div>
                  {cashNum >= grandTotal && (
                    <p className="text-xs text-center font-bold text-foreground">Kembalian: {formatPrice(change)}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => { setCart([]); setCashAmount(''); }}>
                  <Trash2 className="h-3 w-3 mr-1" /> Batal
                </Button>
                <Button size="sm" className="flex-1 text-xs font-bold" onClick={handleConfirm} disabled={cart.length === 0}>
                  Bayar {formatPrice(grandTotal)}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="font-display text-center">✅ Pembayaran Berhasil</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-2 py-2">
            <p className="text-2xl font-bold text-foreground">{formatPrice(grandTotal)}</p>
            <p className="text-xs text-muted-foreground">{orderType === 'dine' ? 'Dine In' : 'Take Away'} • {paymentMethod.toUpperCase()}</p>
            {paymentMethod === 'cash' && cashNum > grandTotal && (
              <p className="text-sm font-semibold text-foreground">Kembalian: {formatPrice(change)}</p>
            )}
          </div>
          <div className="space-y-2">
            {printerConnected ? (
              <Button onClick={handlePrint} disabled={printing} className="w-full gap-2 text-xs">
                <Printer className="h-4 w-4" />
                {printing ? 'Mencetak...' : `Cetak Struk (${getPrinterName()})`}
              </Button>
            ) : (
              <Button variant="outline" onClick={handleConnectPrinter} className="w-full gap-2 text-xs">
                <Bluetooth className="h-4 w-4" />
                Hubungkan Printer
              </Button>
            )}
            <Button onClick={handleNewOrder} variant="secondary" className="w-full text-xs">
              Pesanan Baru
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;