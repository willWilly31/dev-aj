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
  { id: 'nasi', name: 'Nasi', icon: '🍚' },
  { id: 'mie-ayam', name: 'Mie Ayam', icon: '🍜' },
  { id: 'indomie', name: 'Indomie', icon: '🍲' },
  { id: 'ifumie', name: 'Ifumie', icon: '🥡' },
  { id: 'lainnya', name: 'Lainnya', icon: '✨' },
];

export const menuItems: MenuItem[] = [
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
  {
    id: 'bihun-goreng',
    name: 'Bihun Goreng',
    description: 'Bihun goreng dengan ayam dan sayuran segar',
    price: 15000,
    category: 'lainnya',
    image: 'https://wnl2osjferkgajci.public.blob.vercel-storage.com/bihun%20goreng.png',
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
