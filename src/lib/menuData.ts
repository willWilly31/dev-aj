export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
}

export const categories = [
  { id: 'all', name: 'Semua', icon: '🍽️' },
  { id: 'kopi', name: 'Kopi', icon: '☕' },
  { id: 'teh', name: 'Teh', icon: '🍵' },
  { id: 'nasi', name: 'Nasi', icon: '🍚' },
  { id: 'mie-ayam', name: 'Mie Ayam', icon: '🍜' },
  { id: 'indomie', name: 'Indomie', icon: '🍲' },
  { id: 'ifumie', name: 'Ifumie', icon: '🥡' },
  { id: 'minuman', name: 'Minuman', icon: '🥤' },
  { id: 'lainnya', name: 'Lainnya', icon: '✨' },
];

export const menuItems: MenuItem[] = [
  // === KOPI ===
  {
    id: 'kopi-hitam',
    name: 'Kopi Hitam',
    description: 'Kopi tubruk khas Medan, pahit dan nikmat',
    price: 8000,
    category: 'kopi',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
    popular: true,
  },
  {
    id: 'kopi-susu',
    name: 'Kopi Susu',
    description: 'Kopi susu creamy dengan susu kental manis',
    price: 10000,
    category: 'kopi',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80',
    popular: true,
  },
  {
    id: 'kopi-gula-aren',
    name: 'Kopi Gula Aren',
    description: 'Kopi dengan gula aren asli, manis alami',
    price: 12000,
    category: 'kopi',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&q=80',
  },
  {
    id: 'es-kopi-susu',
    name: 'Es Kopi Susu',
    description: 'Es kopi susu segar, cocok untuk siang hari',
    price: 14000,
    category: 'kopi',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80',
    popular: true,
  },
  {
    id: 'kopi-vietnam',
    name: 'Kopi Vietnam',
    description: 'Kopi drip ala Vietnam dengan susu kental',
    price: 13000,
    category: 'kopi',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&q=80',
  },

  // === TEH ===
  {
    id: 'teh-tarik',
    name: 'Teh Tarik',
    description: 'Teh tarik khas dengan busa lembut',
    price: 7000,
    category: 'teh',
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80',
    popular: true,
  },
  {
    id: 'teh-manis',
    name: 'Teh Manis',
    description: 'Teh manis hangat, klasik dan menyegarkan',
    price: 5000,
    category: 'teh',
    image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&q=80',
  },
  {
    id: 'teh-lemon',
    name: 'Teh Lemon',
    description: 'Teh segar dengan perasan lemon asli',
    price: 8000,
    category: 'teh',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80',
  },

  // === NASI ===
  {
    id: 'nasi-goreng',
    name: 'Nasi Goreng',
    description: 'Nasi goreng spesial dengan telur, ayam, dan sayuran segar',
    price: 15000,
    category: 'nasi',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/nasi%20goreng.png',
    popular: true,
  },
  {
    id: 'nasi-goreng-kampung',
    name: 'Nasi Goreng Kampung',
    description: 'Nasi goreng dengan bumbu kampung autentik dan pete',
    price: 18000,
    category: 'nasi',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/nasi%20goreng%20kampung.png',
    popular: true,
  },

  // === MIE AYAM ===
  {
    id: 'mie-ayam',
    name: 'Mie Ayam',
    description: 'Mie ayam klasik dengan topping ayam cincang dan pangsit',
    price: 17000,
    category: 'mie-ayam',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/mie%20ayam.png',
    popular: true,
  },
  {
    id: 'mie-ayam-jamur',
    name: 'Mie Ayam Jamur',
    description: 'Mie ayam dengan tambahan jamur segar dan kuah kaldu',
    price: 18000,
    category: 'mie-ayam',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/mie%20ayam%20jamur.png',
  },
  {
    id: 'mie-ayam-jamur-bakso',
    name: 'Mie Ayam Jamur Bakso',
    description: 'Mie ayam komplit dengan jamur dan bakso kenyal',
    price: 20000,
    category: 'mie-ayam',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/mie%20ayam%20jamur%20bakso.png',
    popular: true,
  },
  {
    id: 'mie-ayam-bakso',
    name: 'Mie Ayam Bakso',
    description: 'Mie ayam dengan bakso sapi pilihan',
    price: 18000,
    category: 'mie-ayam',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/mie%20ayam%20bakso.png',
  },

  // === INDOMIE ===
  {
    id: 'indomie-kuah',
    name: 'Indomie Kuah',
    description: 'Indomie kuah dengan telur dan sayuran',
    price: 15000,
    category: 'indomie',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/indomie%20kuah.png',
  },
  {
    id: 'indomie-goreng',
    name: 'Indomie Goreng',
    description: 'Indomie goreng spesial dengan telur ceplok',
    price: 15000,
    category: 'indomie',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/indomie%20goreng.png',
    popular: true,
  },

  // === IFUMIE ===
  {
    id: 'ifumie-ayam-jamur',
    name: 'Ifumie Ayam Jamur',
    description: 'Ifumie dengan topping ayam dan jamur melimpah',
    price: 18000,
    category: 'ifumie',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/ifumie%20ayam%20jamur.png',
  },
  {
    id: 'ifumie-ayam-jamur-bakso',
    name: 'Ifumie Ayam Jamur Bakso',
    description: 'Ifumie komplit dengan ayam, jamur, dan bakso',
    price: 20000,
    category: 'ifumie',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/ifumie%20ayam%20jamur%20bakso.png',
  },
  {
    id: 'ifumie-goreng',
    name: 'Ifumie Goreng',
    description: 'Ifumie goreng dengan bumbu spesial',
    price: 15000,
    category: 'ifumie',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/ifumie%20%20goreng.png',
  },

  // === MINUMAN ===
  {
    id: 'aqua',
    name: 'Air Mineral',
    description: 'Air mineral segar',
    price: 5000,
    category: 'minuman',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80',
  },
  {
    id: 'jeruk-peras',
    name: 'Jeruk Peras',
    description: 'Jus jeruk peras segar tanpa pengawet',
    price: 8000,
    category: 'minuman',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80',
  },

  // === LAINNYA ===
  {
    id: 'kwetiaw-goreng',
    name: 'Kwetiaw Goreng',
    description: 'Kwetiaw goreng dengan seafood dan sayuran',
    price: 15000,
    category: 'lainnya',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/kwetiaw%20goreng.png',
    popular: true,
  },
  {
    id: 'bihun-goreng',
    name: 'Bihun Goreng',
    description: 'Bihun goreng dengan ayam dan sayuran segar',
    price: 15000,
    category: 'lainnya',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/bihun%20goreng.png',
  },
  {
    id: 'roti-bakar',
    name: 'Roti Bakar',
    description: 'Roti bakar dengan selai coklat dan keju',
    price: 12000,
    category: 'lainnya',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80',
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
