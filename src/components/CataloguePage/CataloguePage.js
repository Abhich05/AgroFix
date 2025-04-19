import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import './CataloguePage.css';

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
  const [addedId, setAddedId] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  useEffect(() => {
    axios.get('https://agrofix-2-czmk.onrender.com/api/products')
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts(DUMMY_PRODUCTS);
        }
      })
      .catch(() => setProducts(DUMMY_PRODUCTS));
  }, []);
  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', product });
    setAddedId(product.id);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 1500);
  };
  console.log("Products state in CataloguePage:", products, "Type:", typeof products);
  return (
    <div className="catalogue-main" >
      <div className="catalogue-header-row">
        {/* Removed Fresh Produce Catalogue Title and basket info as per user request */}
      </div>
      <div className="catalogue-list">
        {Array.isArray(products) && products.map((p) => (
          <div className="catalogue-card" key={p.id}>
            <div className="catalogue-img">
              <img src={p.imageUrl || 'https://img.icons8.com/color/96/vegetarian-food-symbol.png'} alt={p.name} />
            </div>
            <div className="catalogue-card-content">
              <div className="catalogue-name">{p.name}</div>
              <div className="catalogue-price">₹{p.price} <span style={{fontWeight:400, fontSize:13, color:'#888'}}>per crate</span></div>
              <div className="catalogue-description">
                <InfoOutlinedIcon className="catalogue-info-icon" /> {p.description}
              </div>
              <div className="catalogue-stock">{p.stock} {t('crates_available') || 'crates available'}</div>
            </div>
            <button
              className="btn-addtocart"
              type="button"
              onClick={() => handleAddToCart(p)}
              disabled={addedId===p.id && showSnackbar}
            >
              <AddShoppingCartIcon style={{ fontSize: 22, marginRight: 6, verticalAlign: 'middle' }} />
              <span>{addedId===p.id && showSnackbar ? t('added_to_basket') || 'Added to basket!' : t('add_to_basket') || 'Add to basket'}</span>
            </button>
          </div>
        ))}
      </div>
      {showSnackbar && (
        <div className="catalogue-snackbar">
          {t('added_to_basket') || 'Added to basket!'}
          <button className="btn-view-basket-inline" onClick={() => window.location.href='/order'}>{t('view_basket') || 'View your basket'}</button>
        </div>
      )}
    </div>
  );
}

export default CataloguePage;
