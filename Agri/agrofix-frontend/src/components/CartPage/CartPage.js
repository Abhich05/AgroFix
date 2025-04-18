import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './CartPage.css';

function CartPage() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = React.useState({ open: false, msg: '', severity: 'success' });
  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', id });
    setSnackbar({ open: true, msg: 'Item removed from cart', severity: 'info' });
  };

  if (cart.items.length === 0) {
    return <div className="cart-main cart-empty"><RemoveShoppingCartIcon className="cart-empty-icon" /><br />Your cart is empty.</div>;
  }

  return (
    <div className="cart-main">
      <div className="cart-title"><ShoppingCartIcon className="cart-title-icon" /> Your Cart</div>
      <ul className="cart-list">
        {cart.items.map(item => (
          <li className="cart-item" key={item.id}>
            <div className="cart-item-details">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-qty">x{item.quantity}</span>
              <span className="cart-item-price">₹{item.price * item.quantity}</span>
            </div>
            <button className="cart-remove-btn" aria-label="Remove" onClick={() => handleRemove(item.id)}><DeleteIcon /></button>
          </li>
        ))}
      </ul>
      <div className="cart-total">Total: ₹{total}</div>
      <button className="cart-checkout-btn" onClick={() => navigate('/order')}>Proceed to Checkout</button>
      {snackbar.open && (
        <div className={`cart-snackbar cart-snackbar-${snackbar.severity}`}>{snackbar.msg}</div>
      )}
    </div>
  );
}

export default CartPage;
