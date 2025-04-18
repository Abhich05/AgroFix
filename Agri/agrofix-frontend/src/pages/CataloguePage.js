import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StoreIcon from '@mui/icons-material/Store';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const DUMMY_PRODUCTS = [
  { id: 1, name: 'Tomato', price: 25, description: 'Fresh farm tomatoes', stock: 120, imageUrl: 'https://img.icons8.com/color/96/tomato.png' },
  { id: 2, name: 'Potato', price: 18, description: 'Organic potatoes', stock: 200, imageUrl: 'https://img.icons8.com/color/96/potato.png' },
  { id: 3, name: 'Carrot', price: 30, description: 'Crunchy carrots', stock: 150, imageUrl: 'https://img.icons8.com/color/96/carrot.png' },
  { id: 4, name: 'Apple', price: 80, description: 'Juicy apples', stock: 90, imageUrl: 'https://img.icons8.com/color/96/apple.png' }
];

function CataloguePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const { cart, dispatch } = useCart();
  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(() => setProducts(DUMMY_PRODUCTS));
  }, []);
  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };
  return (
    <main className="catalogue-main">
      <div className="catalogue-header" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <StoreIcon style={{ fontSize: 32, color: '#388e3c' }} />
        <h2 className="catalogue-title">{t('catalogue')}</h2>
        <span style={{ marginLeft: 18, fontWeight: 700, color: '#388e3c', fontSize: 20, letterSpacing: 1 }}>
          {products.length} {t('products') || 'Products'}
        </span>
      </div>
      <div className="catalogue-grid">
        {products.map((p) => (
          <div key={p.id} className="catalogue-card">
            <div className="catalogue-img-container">
              <img src={p.imageUrl || 'https://img.icons8.com/ios-filled/100/388e3c/vegetarian-food.png'} alt={p.name} className="catalogue-img" />
            </div>
            <div className="catalogue-name">{p.name}</div>
            <div className="catalogue-price">₹{p.price}</div>
            <div className="catalogue-description">
              <InfoOutlinedIcon style={{ verticalAlign: 'middle', fontSize: 18, color: '#388e3c' }} /> {p.description}
            </div>
            <div className="catalogue-stock">{p.stock} {t('inStock')}</div>
            <button onClick={() => handleAddToCart(p)} className="btn-primary">{t('addToCart')}</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default CataloguePage;
