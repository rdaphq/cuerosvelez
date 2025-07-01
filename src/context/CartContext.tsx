import { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Error al cargar los productos guardados en localStorage:', err);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // useEffect(() => {
  //   const savedCart = localStorage.getItem('cart');
  //   if (savedCart) setCart(JSON.parse(savedCart));
  // }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Error al guardar los productos en localStorage:', err);
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.id === item.id && cartItem.size === item.size
      );

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id && cartItem.size === item.size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, totalItems, totalPrice, isCartOpen, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};