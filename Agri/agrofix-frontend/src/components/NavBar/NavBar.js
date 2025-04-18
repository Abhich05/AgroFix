import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Badge, Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useCart } from '../../context/CartContext';
import LanguageToggle from '../LanguageToggle/LanguageToggle';
import LiveMarketTicker from '../LiveMarketTicker/LiveMarketTicker';
import './NavBar.css';

function NavBar() {
  const { cart } = useCart();
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Remove /cart from mobile drawer and top bar, merge cart into order page
  const navItems = [
    { label: 'Buy Veggies', path: '/catalogue', icon: <StoreIcon />, className: 'nav-catalogue' },
    { label: 'Order', path: '/order', icon: (
      <Badge badgeContent={cartCount} color="warning">
        <ShoppingBasketIcon />
      </Badge>
    ), className: 'nav-order-cart' },
    { label: 'Track Order', path: '/track', icon: <LocalShippingIcon />, className: 'nav-track-order' },
    { label: 'Admin Login', path: '/admin-login', icon: <AdminPanelSettingsIcon />, className: 'nav-admin-login' }
  ];

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const drawer = (
    <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
      <List sx={{ width: 220 }}>
        {navItems.map((item) => (
          <ListItem button key={item.path} onClick={() => { navigate(item.path); setDrawerOpen(false); }} selected={location.pathname === item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ background: '#388e3c', borderRadius: '0 0 18px 18px', boxShadow: 3 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 56, px: isMobile ? 1 : 2 }}>
          {isMobile ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
                  <MenuIcon sx={{ fontSize: 32 }} />
                </IconButton>
                <Link to="/" style={{ ml: 1, fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: 1, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <img src="/logo-dummy.svg" alt="Agrofix Logo" style={{ height: 32, marginRight: 8 }} />
                  <span style={{ color: '#fff' }}>Agrofix</span>
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageToggle />
                {/* My Cart removed from mobile top bar, now merged with order page */}
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <img src="/logo-dummy.svg" alt="Agrofix Logo" style={{ height: 38, marginRight: 12 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', letterSpacing: 1, fontSize: 26 }}>Agrofix</Typography>
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {navItems.map((item, idx) => (
                  <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', margin: '0 8px' }}>
                    <IconButton
                      color={location.pathname === item.path ? 'warning' : 'inherit'}
                      sx={{ fontSize: '2.1rem', color: location.pathname === item.path ? '#fbc02d' : '#fff', p: 1 }}
                      className={item.className}
                    >
                      {item.icon}
                    </IconButton>
                    <Typography variant="body2" sx={{ color: location.pathname === item.path ? '#fbc02d' : '#fff', fontWeight: 700, ml: 0.5, whiteSpace: 'nowrap' }}>{item.label}</Typography>
                  </Link>
                ))}
                <Box sx={{ ml: 2 }}>
                  <LanguageToggle />
                </Box>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      {isMobile && drawer}
    </>
  );
}

export default NavBar;
