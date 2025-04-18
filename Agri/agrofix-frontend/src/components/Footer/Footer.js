import React from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';

const farmerTips = [
  '🌱 Tip: Rotate crops for healthier soil!',
  '💧 Save water by irrigating early morning or late evening.',
  '🌾 Share your best harvest photo in our gallery!',
  '🤝 Join the community – comment and connect with other farmers!',
  '📱 Use Agrofix on mobile for updates on the go!'
];

const regions = [
  'Punjab', 'Haryana', 'Bihar', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'Andhra Pradesh', 'West Bengal', 'Uttar Pradesh'
];

export default function Footer() {
  const { t } = useTranslation();
  const [tip, setTip] = React.useState(farmerTips[0]);
  const [region, setRegion] = React.useState(() => {
    return localStorage.getItem('selectedRegion') || regions[0];
  });
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTip(farmerTips[Math.floor(Math.random() * farmerTips.length)]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  React.useEffect(() => {
    localStorage.setItem('selectedRegion', region);
    window.dispatchEvent(new Event('storage', { bubbles: true, cancelable: false }));
    // Custom event for cross-tab sync
    localStorage.setItem('agrofixRegionChange', Date.now().toString());
  }, [region]);
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/logo-dummy.svg" alt={t('logoAlt')} className="footer-logo" />
          <span className="footer-title">Agrofix</span>
        </div>
        <div className="footer-links">
          <a href="/" className="footer-link">Home</a>
          <a href="/catalogue" className="footer-link">Catalogue</a>
          <a href="/order" className="footer-link">Order</a>
          <a href="/track" className="footer-link">Track</a>
        </div>
        <div className="footer-tip">{tip}</div>
        <div className="footer-region">
          <label htmlFor="region-select">Region:</label>
          <select id="region-select" value={region} onChange={e => setRegion(e.target.value)}>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
    </footer>
  );
}
