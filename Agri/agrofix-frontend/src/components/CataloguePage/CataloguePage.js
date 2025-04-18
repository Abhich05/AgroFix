import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
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
    <Box className="catalogue-main-pro" sx={{ px: { xs: 1, sm: 2, md: 4 }, py: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <pre style={{background:'#eee',padding:'8px',borderRadius:'4px',marginBottom:'16px'}}>{JSON.stringify(products)}</pre>
      <div className="catalogue-header-row-pro">
        <Typography variant="h4" align="left" sx={{ color: '#245c2a', fontWeight: 800, mb: 2, letterSpacing: 1.5, fontSize: { xs: 24, sm: 32 }, textShadow: '0 1px 4px #e8f5e9' }}>
          {t('fresh_produce_catalogue') || 'Fresh produce catalogue'}
        </Typography>
        <div className="catalogue-basket-info-pro">
          <span className="catalogue-basket-count-pro">
            <ShoppingCartIcon style={{ fontSize: 22, marginRight: 6, verticalAlign: 'middle' }} />
            {cart.items.reduce((sum, i) => sum + i.quantity, 0)} {t('crates_in_basket') || 'crates in basket'}
          </span>
          <button className="btn-view-basket-pro" onClick={() => window.location.href='/order'}>{t('order_or_cart') || 'Order / Cart'}</button>
        </div>
      </div>
      <Grid container spacing={3} className="catalogue-list-pro">
        {Array.isArray(products) && products.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
            <Card className={`catalogue-card-pro${addedId===p.id && showSnackbar ? ' catalogue-card-added-pro' : ''}`} elevation={4}>
              <div className="catalogue-img-pro">
                <img src={p.imageUrl || 'https://img.icons8.com/color/96/vegetarian-food-symbol.png'} alt={p.name} />
              </div>
              <CardContent className="catalogue-card-content-pro">
                <Typography variant="h6" className="catalogue-name-pro" sx={{ fontWeight: 700, fontSize: 20 }}>{p.name}</Typography>
                <Typography variant="body1" className="catalogue-price-pro" sx={{ color: '#245c2a', fontWeight: 800, fontSize: 18 }}>₹{p.price} <span style={{fontWeight:400, fontSize:13, color:'#888'}}>per crate</span></Typography>
                <Typography variant="body2" className="catalogue-description-pro" sx={{ color: '#555', minHeight: 38 }}>
                  <InfoOutlinedIcon className="catalogue-info-icon-pro" /> {p.description}
                </Typography>
                <Typography variant="body2" className="catalogue-stock-pro" sx={{ color: '#388e3c', fontWeight: 600 }}>{p.stock} {t('crates_available') || 'crates available'}</Typography>
              </CardContent>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <button
                  className="btn-primary-pro btn-addtobasket-pro"
                  type="button"
                  onClick={() => handleAddToCart(p)}
                  disabled={addedId===p.id && showSnackbar}
                >
                  <AddShoppingCartIcon className="btn-addtobasket-icon-pro" />
                  <span className="btn-addtobasket-text-pro">{addedId===p.id && showSnackbar ? t('added_to_basket') || 'Added to basket!' : t('add_to_basket') || 'Add to basket'}</span>
                </button>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
      {!Array.isArray(products) && (
        <Typography color="error">Products is not an array. Type: {typeof products}. Value: {JSON.stringify(products)}</Typography>
      )}
      {showSnackbar && (
        <div className="catalogue-snackbar-pro">
          {t('added_to_basket') || 'Added to basket!'}
          <button className="btn-view-basket-inline-pro" onClick={() => window.location.href='/order'}>{t('view_basket') || 'View your basket'}</button>
        </div>
      )}
    </Box>
  );
}

export default CataloguePage;
