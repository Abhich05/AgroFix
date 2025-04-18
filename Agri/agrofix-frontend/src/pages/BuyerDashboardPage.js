import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './BuyerDashboard.module.css';

export default function BuyerDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('buyerToken');
    navigate('/buyer-login');
  };

  useEffect(() => {
    const token = localStorage.getItem('buyerToken');
    if (!token) {
      navigate('/buyer-login');
      return;
    }
    // Fetch profile
    axios.get('/api/buyers/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
    // Fetch orders
    axios.get('/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data.orders || []))
      .catch(err => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div>Loading your orders...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <main className={styles['buyer-dashboard-main']}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Orders</h2>
        <button onClick={handleLogout} className="btn-secondary">Logout</button>
      </div>
      {profile && (
        <div className={styles['buyer-profile-card']}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Welcome, {profile.name}!</div>
          <div>Email: {profile.email}</div>
          <div>Contact: {profile.contact}</div>
        </div>
      )}
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <table className={styles['buyer-orders-table']}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Items</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                <td>{order.status || '-'}</td>
                <td>{order.products?.map(p => p.name).join(', ')}</td>
                <td>₹{order.total || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
