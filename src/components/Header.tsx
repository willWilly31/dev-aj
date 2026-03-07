import { ShoppingCart, MapPin, User, LogOut, QrCode, LayoutDashboard } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border/30 bg-background/90 backdrop-blur-xl">
      <div className="container flex h-18 items-center justify-between py-3">
        <div className="flex flex-col">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full gradient-warm flex items-center justify-center shadow-glow">
              <span className="text-lg">🍜</span>
            </div>
            <div>
              <h1 className="font-display text-xl tracking-tight text-foreground">
                Warung<span className="text-gold">Medan</span>
              </h1>
            </div>
          </Link>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 ml-12">
            <MapPin className="h-3 w-3" />
            <span className="font-medium tracking-wide uppercase">Sumatera Utara</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/orders">Pesanan Saya</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/qrcode"><QrCode className="mr-2 h-4 w-4" />QR Code Menu</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><LayoutDashboard className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
          )}

          <Link
            to="/cart"
            className="relative flex h-12 w-12 items-center justify-center rounded-full gradient-warm text-primary-foreground shadow-md transition-all hover:shadow-glow active:scale-95 border border-primary/20"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-md ring-2 ring-background">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
