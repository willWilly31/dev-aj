import { ShoppingCart, MapPin, User, LogOut, QrCode, LayoutDashboard, ExternalLink } from 'lucide-react';
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

const GMAPS_URL = 'https://maps.app.goo.gl/hCAaJokZitSpsvoL7';

export function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border/30 bg-background/90 backdrop-blur-xl">
      <div className="container flex items-center justify-between py-3 px-4">
        <div className="flex flex-col min-w-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full gradient-warm flex items-center justify-center shadow-glow shrink-0">
              <span className="text-base sm:text-lg">☕</span>
            </div>
            <h1 className="font-display text-lg sm:text-xl tracking-tight text-foreground whitespace-nowrap">
              Warkop<span className="text-gold">AJ</span>
            </h1>
          </Link>
          <a
            href={GMAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground mt-0.5 ml-10 sm:ml-11 hover:text-foreground transition-colors group"
          >
            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
            <span className="font-medium truncate">Jl. Sei Bahorok No.66, Medan Baru</span>
            <ExternalLink className="h-2 w-2 sm:h-2.5 sm:w-2.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
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
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin"><LayoutDashboard className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/pos">🧾 Kasir / POS</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">Masuk</Button>
            </Link>
          )}

          <Link
            to="/cart"
            className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full gradient-warm text-primary-foreground shadow-md transition-all hover:shadow-glow active:scale-95 border border-primary/20"
          >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
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