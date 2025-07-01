import './App.css'

import Navbar from './components/navbar/Navbar';
import Product from './components/product/Product';
import Cart from './components/cart/Cart';

import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Navbar />
      <div className='container'>
        <Cart />
        <div className='wrapper'>
          <Product />
        </div>
      </div>
    </CartProvider>
  )
}

export default App
