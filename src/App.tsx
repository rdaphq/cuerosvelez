import './App.css'

import Navbar from './components/navbar/Navbar';
import Product from './components/product/Product';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Navbar />
      <div className='container'>
        <div className='wrapper'>
          <Product />
        </div>
      </div>
    </CartProvider>
  )
}

export default App
