import React, { useState } from 'react';
import axios from 'axios';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Grow from '@mui/material/Grow';
import { useLanguage } from '../../context/LanguageContext';
import './TrackOrderPage.css';

function TrackOrderPage() {
  const { t } = useLanguage();

  // Accept both legacy and new statuses for compatibility
  const statusMap = {
    pending: { icon: <HourglassEmptyIcon className="track-status-icon track-status-pending" />, label: t('waiting'), color: 'var(--track-status-pending)' },
    waiting: { icon: <HourglassEmptyIcon className="track-status-icon track-status-pending" />, label: t('waiting'), color: 'var(--track-status-pending)' },
    packed: { icon: <LocalShippingIcon className="track-status-icon track-status-inprogress" />, label: t('packed'), color: 'var(--track-status-inprogress)' },
    in_progress: { icon: <LocalShippingIcon className="track-status-icon track-status-inprogress" />, label: t('packed'), color: 'var(--track-status-inprogress)' },
    village_reached: { icon: <LocalShippingIcon className="track-status-icon track-status-inprogress" />, label: t('villageReached'), color: 'var(--track-status-inprogress)' },
    delivered: { icon: <CheckCircleIcon className="track-status-icon track-status-delivered" />, label: t('villageReached'), color: 'var(--track-status-inprogress)' },
    cancelled: { icon: <CancelIcon className="track-status-icon track-status-cancelled" />, label: t('cancelled'), color: 'var(--track-status-cancelled)' }
  };

  const statusSteps = [
    { key: 'pending', label: t('waiting') || 'Waiting' },
    { key: 'packed', label: t('packed') || 'Packed' },
    { key: 'village_reached', label: t('villageReached') || 'Reached Village' },
    { key: 'cancelled', label: t('cancelled') || 'Cancelled' },
  ];

  function getActiveSteps(status) {
    switch (status) {
      case 'pending':
      case 'waiting':
        return [0];
      case 'packed':
      case 'in_progress':
        return [0, 1];
      case 'village_reached':
      case 'delivered':
        return [0, 1, 2];
      case 'cancelled':
        if (order && order.history && Array.isArray(order.history)) {
          let lastIdx = 0;
          for (const s of ['pending', 'waiting', 'packed', 'in_progress', 'village_reached', 'delivered']) {
            if (order.history.includes(s)) lastIdx = statusSteps.findIndex(st => st.key === s || st.key === 'packed' && s === 'in_progress' || st.key === 'village_reached' && s === 'delivered');
          }
          return Array.from({length: lastIdx+2}, (_, i) => i);
        }
        return [3];
      default:
        return [];
    }
  }

  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'error' });
  const handleTrack = async () => {
    try {
      const res = await axios.get(`https://agrofix-2-czmk.onrender.com/api/orders/${orderId}`);
      setOrder(res.data);
      setError('');
      setSnackbar({ open: true, msg: t('orderFound') || 'Order found', severity: 'success' });
    } catch {
      setOrder(null);
      setError(t('orderNotFound'));
      setSnackbar({ open: true, msg: t('orderNotFound') || 'Order not found', severity: 'error' });
    }
  };
  const status = order && order.status && statusMap[order.status] ? statusMap[order.status] : null;
  const highlightedSteps = order ? getActiveSteps(order.status) : [];
  return (
    <div className="track-main">
      <div className="track-brand">
        <img src="/logo-dummy.svg" alt="AgroFix Logo" className="track-brand-logo" />
        <span className="track-brand-title">AgroFix</span>
      </div>
      <div className="track-title">
        <TrackChangesIcon className="track-title-icon" /> {t('trackOrder') || 'Track My Order'}
      </div>
      <div className="track-form">
        <input
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          placeholder={t('enterTrackingId') || 'Enter your Tracking ID (from order slip)'}
          className="track-input"
        />
        <button className="btn-primary track-btn" type="button" onClick={handleTrack}>{t('track') || 'Track My Order'}</button>
      </div>
      {error && <Grow in={!!error}><div className="track-error">{error}</div></Grow>}
      {order && (
        <Grow in={!!order} timeout={500}>
          <div className="track-details">
            <div className={`track-status track-status-${order.status}`}>{status ? status.icon : null} {status ? status.label : ''}</div>
            <Stepper alternativeLabel className="track-stepper">
              {statusSteps.map((step, idx) => (
                <Step key={step.key} completed={highlightedSteps.includes(idx)} active={highlightedSteps.includes(idx)}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div className="track-details-address"><strong>{t('deliveryAddress') || 'Delivery Address'}:</strong> {order.delivery_address}</div>
            <div className="track-details-items"><strong>{t('items') || 'Items'}:</strong></div>
            <ul>
              {Array.isArray(order.items) && order.items.map((item, idx) => (
                <li key={idx}>{item.name} x{item.quantity} — ₹{item.price}</li>
              ))}
            </ul>
          </div>
        </Grow>
      )}
      {snackbar.open && (
        <div className={`track-snackbar track-snackbar-${snackbar.severity}`}>{snackbar.msg}</div>
      )}
    </div>
  );
}

export default TrackOrderPage;
