import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { getStoragedCart, setStoragedCart } from '../repositories/Cart';
import { getProductById } from '../services/product';
import { getStockById } from '../services/stock';
import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = getStoragedCart()

    if (storagedCart) {
      return storagedCart;
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const productData = await getProductById(productId);
      const stockData = await getStockById(productId);

      const productInCart = cart.find(p => p.id === productData.id);

      if (productInCart) {
        updateProductAmount({
          productId: productInCart.id,
          amount: productInCart.amount + 1
        })
        return;
      };

      if(!stockData.amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      const newCart = [...cart, { ...productData, amount: 1 }];

      setCart(newCart);
      setStoragedCart(newCart);
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const newCart = cart.filter(product => product.id !== productId);

      if(newCart.length === cart.length) throw new Error('out of stock');

      setCart(newCart);
      setStoragedCart(newCart);
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    if(amount <= 0) return;

    try {
      const stockData = await getStockById(productId);
      const product = cart.find(p => p.id === productId);

      if(!product) return;

      if(stockData.amount < amount) {
        return toast.error('Quantidade solicitada fora de estoque');
      }

      const newCart = cart.map(p =>
        p.id === productId ? { ...p, amount: amount } : p
      )

      setCart(newCart);
      setStoragedCart(newCart);
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >c
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
