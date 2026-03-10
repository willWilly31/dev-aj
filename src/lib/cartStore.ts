import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem } from './menuData';

export interface CartItem extends MenuItem {
  quantity: number;
  note?: string | null;
}

export type OrderType = 'dine' | 'takeaway';
export type PaymentMethod = 'cash' | 'transfer' | 'qris';

interface CartStore {
  items: CartItem[];
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateNote: (itemId: string, note: string | null) => void;
  setOrderType: (type: OrderType) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTax: () => number;
  getGrandTotal: () => number;
}

const TAX_RATE = 0.11;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      orderType: 'dine',
      paymentMethod: 'cash',
      
      addItem: (item: MenuItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1, note: null }] };
        });
      },
      
      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },
      
      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        }));
      },

      updateNote: (itemId: string, note: string | null) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, note } : i
          ),
        }));
      },

      setOrderType: (type: OrderType) => set({ orderType: type }),
      setPaymentMethod: (method: PaymentMethod) => set({ paymentMethod: method }),
      
      clearCart: () => set({ items: [], paymentMethod: 'cash' }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTax: () => {
        return Math.round(get().getTotalPrice() * TAX_RATE);
      },

      getGrandTotal: () => {
        return get().getTotalPrice() + get().getTax();
      },
    }),
    {
      name: 'warkopaj-cart',
    }
  )
);
