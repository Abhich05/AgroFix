import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

function CartPage() {
  const { t } = useLanguage();
  const { cart, dispatch } = useCart();
  const handleQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  };
  const handleRemove = id => {
    dispatch({ type: 'REMOVE_FROM_CART', id });
  };
  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return (
    <main className="cart-main">
      <h2 className="cart-title"><AddShoppingCartIcon className="cart-icon" /> {t('yourCart')}</h2>
      {cart.items.length === 0 ? <div className="cart-empty">{t('cartIsEmpty')}</div> : (
        <table className="cart-table">
          <thead>
            <tr>
              <th className="cart-table-header">{t('product')}</th>
              <th className="cart-table-header">{t('price')}</th>
              <th className="cart-table-header">{t('quantity')}</th>
              <th className="cart-table-header">{t('total')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map(item => (
              <tr key={item.id}>
                <td className="cart-table-data">{item.name}</td>
                <td className="cart-table-data">₹{item.price}</td>
                <td className="cart-table-data">
                  <input type="number" min={1} value={item.quantity} onChange={e => handleQuantity(item.id, Number(e.target.value))} className="cart-quantity-input" />
                </td>
                <td className="cart-table-data">₹{item.price * item.quantity}</td>
                <td className="cart-table-data"><button onClick={() => handleRemove(item.id)} className="cart-remove-btn">{t('remove')}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {cart.items.length > 0 && (
        <>
          <div className="cart-total-summary">
            <strong>Total: ₹{total}</strong>
          </div>
          <a href="/order" className="btn-primary cart-proceed-btn">{t('proceedToCheckout')}</a>
        </>
      )}
    </main>
  );
}
export default CartPage;
