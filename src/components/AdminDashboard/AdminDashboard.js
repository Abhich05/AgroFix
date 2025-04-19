import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import './AdminDashboard.css';

function AdminDashboard() {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState({});
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    const tkn = localStorage.getItem('adminToken');
    if (!tkn) {
      navigate('/admin-login');
      return;
    }
    setToken(tkn);
    const fetchData = () => {
      axios.get('https://agrofix-2-czmk.onrender.com/api/products', { headers: { Authorization: `Bearer ${tkn}` } })
        .then(res => setInventory(res.data))
        .catch(() => setInventory([
          { id: 1, name: 'Tomato', price: 25, stock: 120, description: 'Fresh farm tomatoes', imageUrl: 'https://img.icons8.com/color/96/tomato.png' },
          { id: 2, name: 'Potato', price: 18, stock: 200, description: 'Organic potatoes', imageUrl: 'https://img.icons8.com/color/96/potato.png' },
          { id: 3, name: 'Carrot', price: 30, stock: 150, description: 'Crunchy carrots', imageUrl: 'https://img.icons8.com/color/96/carrot.png' },
          { id: 4, name: 'Apple', price: 80, stock: 90, description: 'Juicy apples', imageUrl: 'https://img.icons8.com/color/96/apple.png' }
        ]));
      axios.get('https://agrofix-2-czmk.onrender.com/api/orders', { headers: { Authorization: `Bearer ${tkn}` } })
        .then(res => setOrders(res.data))
        .catch(() => setOrders([
          { id: 1, buyer_name: 'Ravi', buyer_contact: '9999999999', delivery_address: '123 Main St', items: [{ name: 'Tomato', quantity: 2 }], status: 'pending' },
          { id: 2, buyer_name: 'Priya', buyer_contact: '8888888888', delivery_address: '456 Side Rd', items: [{ name: 'Potato', quantity: 5 }], status: 'delivered' }
        ]));
      axios.get('https://agrofix-2-czmk.onrender.com/api/admin/dashboard', { headers: { Authorization: `Bearer ${tkn}` } })
        .then(res => setAnalytics(res.data))
        .catch(() => setAnalytics({ totalProducts: 4, totalOrders: 2 }));
    };
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [navigate]);

  // Add inventory
  const addInventory = async (item) => {
    try {
      const res = await axios.post('https://agrofix-2-czmk.onrender.com/api/products', item, { headers: { Authorization: `Bearer ${token}` } });
      setInventory([...inventory, res.data]);
      setSnackbar({ open: true, msg: t('productAdded') || 'Product added', severity: 'success' });
    } catch {
      setSnackbar({ open: true, msg: t('failedToAddProduct') || 'Failed to add product', severity: 'error' });
    }
  };

  // Edit inventory
  const editInventory = async (id, item) => {
    try {
      const res = await axios.put(`https://agrofix-2-czmk.onrender.com/api/products/${id}`, item, { headers: { Authorization: `Bearer ${token}` } });
      setInventory(inventory.map(p => (p.id === id ? res.data : p)));
      setSnackbar({ open: true, msg: t('productUpdated') || 'Product updated', severity: 'success' });
    } catch {
      setSnackbar({ open: true, msg: t('failedToUpdateProduct') || 'Failed to update product', severity: 'error' });
    }
  };

  // Delete inventory
  const deleteInventory = async (id) => {
    try {
      await axios.delete(`https://agrofix-2-czmk.onrender.com/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setInventory(inventory.filter(p => p.id !== id));
      setSnackbar({ open: true, msg: t('productDeleted') || 'Product deleted', severity: 'success' });
    } catch {
      setSnackbar({ open: true, msg: t('failedToDeleteProduct') || 'Failed to delete product', severity: 'error' });
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`https://agrofix-2-czmk.onrender.com/api/orders/${orderId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status } : o));
      setSnackbar({ open: true, msg: t('orderStatusUpdated') || 'Order status updated', severity: 'success' });
    } catch {
      setSnackbar({ open: true, msg: t('failedToUpdateOrderStatus') || 'Failed to update order status', severity: 'error' });
    }
  };

  // --- STATE FOR ADD PRODUCT DIALOG ---
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', description: '', imageUrl: '' });

  // --- HANDLER FOR ADD PRODUCT ---
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setSnackbar({ open: true, msg: t('fillAllFields') || 'Please fill all required fields', severity: 'warning' });
      return;
    }
    await addInventory({ ...newProduct, price: Number(newProduct.price), stock: Number(newProduct.stock) });
    setShowAddProduct(false);
    setNewProduct({ name: '', price: '', stock: '', description: '', imageUrl: '' });
  };

  const navToShop = () => navigate('/catalogue');

  return (
    <Box className="admin-main" sx={{ maxWidth: 1200, mx: 'auto', my: 4, background: '#fffbe7', borderRadius: 3, boxShadow: 3, p: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" className="admin-title" align="center" sx={{ color: '#388e3c', fontWeight: 800, mb: 3 }}>
        {analytics && analytics.adminName ? `Welcome, ${analytics.adminName}!` : (t('adminDashboard') || 'Admin Dashboard')}
      </Typography>
      <Box sx={{ width: '100%', typography: 'body1', background: '#f9fbe7', minHeight: 450, borderRadius: 2, p: { xs: 1, md: 3 }, mt: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#388e3c', mb: 2 }}>
          {t('adminDashboard') || 'Admin Dashboard'}
        </Typography>
        <Button variant="outlined" sx={{ mb: 2, borderRadius: 2, fontWeight: 700 }} onClick={navToShop}>
          🛒 Back to Shop
        </Button>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} aria-label="dashboard tabs" sx={{ mb: 2 }}>
          <Tab label={t('manageProducts') || 'Manage Products'} />
          <Tab label={t('viewOrders') || 'View Orders'} />
        </Tabs>
        {tab === 0 && (
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
            <Table className="admin-table">
              <TableHead>
                <TableRow sx={{ background: '#e8f5e9' }}>
                  <TableCell sx={{ fontWeight: 700 }}>{t('productId') || 'Product ID'}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('name') || 'Name'}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('price') || 'Price'}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('stock') || 'Stock'}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('description') || 'Description'}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('imageUrl') || 'Image'}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{t('actions') || 'Actions'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                      ) : (
                        <span style={{ color: '#aaa' }}>N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" size="small" sx={{ mr: 1, mb: 0.5, background: '#0288d1', borderRadius: 2, fontWeight: 700 }} onClick={() => editInventory(product.id, product)} aria-label="Edit Product">✏️ {t('edit') || 'Edit Product'}</Button>
                      <Button variant="contained" size="small" sx={{ background: '#b71c1c', borderRadius: 2, fontWeight: 700 }} onClick={() => deleteInventory(product.id)} aria-label="Delete Product">🗑️ {t('delete') || 'Delete Product'}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {tab === 1 && (
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
            <Table className="admin-table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('orderId') || 'Order ID'}</TableCell>
                  <TableCell>{t('buyer') || 'Buyer'}</TableCell>
                  <TableCell>{t('contact') || 'Contact'}</TableCell>
                  <TableCell>{t('address') || 'Address'}</TableCell>
                  <TableCell>{t('items') || 'Items'}</TableCell>
                  <TableCell>{t('status') || 'Status'}</TableCell>
                  <TableCell>{t('actions') || 'Actions'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.buyer_name}</TableCell>
                    <TableCell>{order.buyer_contact}</TableCell>
                    <TableCell>{order.delivery_address}</TableCell>
                    <TableCell>
                      <ul style={{margin:0,padding:0,listStyle:'none'}}>
                        {Array.isArray(order.items) && order.items.map((item, idx) => (
                          <li key={idx}>{item.name} x{item.quantity}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <Typography className={`admin-status status-${order.status}`} sx={{ fontWeight: 700 }}>{t(order.status) || order.status}</Typography>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" size="small" sx={{ mr: 1, mb: 0.5, background: '#0288d1', borderRadius: 2, fontWeight: 700 }} onClick={() => updateOrderStatus(order.id, 'in_progress')}>{t('markInProgress') || 'In Progress'}</Button>
                      <Button variant="contained" size="small" sx={{ background: '#388e3c', borderRadius: 2, fontWeight: 700 }} onClick={() => updateOrderStatus(order.id, 'delivered')}>{t('markDelivered') || 'Delivered'}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Add Product Dialog */}
        <Dialog open={showAddProduct} onClose={() => setShowAddProduct(false)}>
          <DialogTitle sx={{ fontWeight: 700, color: '#388e3c' }}>{t('addProduct') || 'Add Product'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label={t('name') || 'Name'}
              fullWidth
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              sx={{ mb: 1 }}
            />
            <TextField
              margin="dense"
              label={t('price') || 'Price'}
              type="number"
              fullWidth
              value={newProduct.price}
              onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
              sx={{ mb: 1 }}
            />
            <TextField
              margin="dense"
              label={t('stock') || 'Stock'}
              type="number"
              fullWidth
              value={newProduct.stock}
              onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
              sx={{ mb: 1 }}
            />
            <TextField
              margin="dense"
              label={t('description') || 'Description'}
              fullWidth
              value={newProduct.description}
              onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
              sx={{ mb: 1 }}
            />
            <TextField
              margin="dense"
              label={t('imageUrl') || 'Image URL'}
              fullWidth
              value={newProduct.imageUrl}
              onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
              sx={{ mb: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddProduct(false)}>{t('cancel') || 'Cancel'}</Button>
            <Button onClick={handleAddProduct} variant="contained" sx={{ background: '#388e3c', fontWeight: 700 }}>{t('add') || 'Add'}</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;
