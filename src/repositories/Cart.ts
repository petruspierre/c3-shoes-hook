const STORAGE_KEY = '@RocketShoes:cart'

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const getStoragedCart = () => {
  const storagedCart = localStorage.getItem(STORAGE_KEY) || '[]';

  return JSON.parse(storagedCart) as Product[];
}

const setStoragedCart = (cart: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export { getStoragedCart, setStoragedCart };
