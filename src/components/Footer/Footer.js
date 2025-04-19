import React from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';

const farmerTips = [
  ' Tip: Rotate crops for healthier soil!',
  ' Save water by irrigating early morning or late evening.',
  ' Share your best harvest photo in our gallery!',
  ' Join the community – comment and connect with other farmers!',
  ' Use Agrofix on mobile for updates on the go!'
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
          <img src="/logo-dummy.svg" alt={t('logoAlt') || 'Agrofix Logo'} className="footer-logo" />
          <span className="footer-title">Agrofix</span>
        </div>
        <div className="footer-links">
          <a href="/" className="footer-link"> Home</a>
          <a href="/catalogue" className="footer-link"> Shop</a>
          <a href="/order" className="footer-link"> My Basket</a>
          <a href="/track" className="footer-link"> Track Order</a>
        </div>
        <div className="footer-social-policy-row">
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-icon">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" style={{width:'26px',height:'26px'}} />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="footer-social-icon">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" alt="X" style={{width:'26px',height:'26px'}} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-icon">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" style={{width:'26px',height:'26px'}} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer-social-icon">
              <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" alt="YouTube" style={{width:'26px',height:'26px'}} />
            </a>
          </div>
          <div className="footer-policy">
            <a href="/privacy" className="footer-policy-link">Privacy Policy</a>
            <span className="footer-policy-sep">|</span>
            <a href="/terms" className="footer-policy-link">Terms & Conditions</a>
          </div>
        </div>
        <div className="footer-tip" title="Farmer Tip">{tip}</div>
        <div className="footer-region">
          <label htmlFor="region-select">Region:</label>
          <select id="region-select" value={region} onChange={e => setRegion(e.target.value)}>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="footer-support">
          <span style={{ fontSize: 14, color: '#388e3c', fontWeight: 600 }}>
            Need help? Call us: <a href="tel:1800123456" style={{ color: '#388e3c', textDecoration: 'underline' }}>1800-123-456</a>
          </span>
        </div>
        <div className="footer-bottom-row">
          <span className="footer-copyright">&copy; {new Date().getFullYear()} Agrofix. All rights reserved.</span>
          <span className="footer-designer">Designed by ABHISHEK C H</span>
        </div>
      </div>
    </footer>
  );
}
