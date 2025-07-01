import { useCart } from '../../context/CartContext';
import { useRef } from 'react';
import './Cart.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

function Cart() {
  const { cart, removeFromCart, totalItems, totalPrice, isCartOpen, toggleCart } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ANIMATION
  useGSAP(() => {
    if (cartRef.current && containerRef.current) {
      if (isCartOpen) {
        cartRef.current.style.display = 'block';
        gsap.to(cartRef.current, { opacity: 1, duration: 0.3 });
        gsap.to(containerRef.current, { x: '0%', duration: 0.4, ease: 'power2.out' });
      } else {
        gsap.to(containerRef.current, { x: '100%', duration: 0.3, ease: 'power2.in' });
        gsap.to(cartRef.current, { 
          opacity: 0, 
          duration: 0.2,
          onComplete: () => {
            if (cartRef.current) cartRef.current.style.display = 'none';
          }
        });
      }
    }
  }, [isCartOpen]);

  const pluralItems = totalItems === 1 ? 'item' : 'items';

  const cleanTitle = (title: string) => {
    if (title.length > 40) {
      return `${title.substring(0, 40)}...`;
    }
    return title;
  };

  if (cart.length === 0) {
    return (
      <div className="cart" ref={cartRef}>
        <div className="cart-container" ref={containerRef}>
          <button className='cart-close' onClick={toggleCart}>
            <i className='fi fi-rr-cross'></i>
          </button>
          <p>Tu carrito está vacío.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart" ref={cartRef}>
      <div className="cart-container" ref={containerRef}>
        <button className='cart-close' onClick={toggleCart}>
          <i className='fi fi-rr-cross'></i>
        </button>
        <div className="cart-items">
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="cart-item">
              <img src={item.image} alt={item.title} />
              <div className="cart-item-details">
                <p className='quantity'>x{item.quantity}</p>
                <h3>{cleanTitle(item.title)}</h3>
                <p className='price'>${item.price.toLocaleString('es-CO')}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="cart-remove"
                >
                  Eliminar <i className='fi fi-rr-cross-small'></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <p>{totalItems} {pluralItems}</p>
          <h3>Total: ${totalPrice.toLocaleString('es-CO')}</h3>
          <a href="/">Comprar</a>
        </div>
      </div>
    </div>
  );
}

export default Cart;