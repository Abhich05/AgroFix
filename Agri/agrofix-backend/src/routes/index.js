import { Router } from 'express';
import productRoutes from './product.js';
import orderRoutes from './order.js';
import inventoryRoutes from './inventory.js';
import adminRoutes from './admin.js';

const router = Router();

router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/admin', adminRoutes);

// Weather API endpoint
router.get('/api/weather', async (req, res) => {
  const { region } = req.query;
  // Use real weather API if WEATHER_API_KEY is set
  const apiKey = process.env.WEATHER_API_KEY;
  if (apiKey) {
    try {
      // Example: OpenWeatherMap API (replace with your preferred provider)
      const city = region || 'Delhi';
      const fetch = (await import('node-fetch')).default;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Weather fetch failed');
      const data = await response.json();
      return res.json({
        temp: data.main.temp,
        description: data.weather[0].description,
        city: data.name
      });
    } catch (err) {
      return res.status(500).json({ error: 'Weather API error', details: err.message });
    }
  }
  // Fallback: static weather
  res.json({
    temp: 28,
    description: `Clear sky in ${region || 'your area'}`
  });
});

export default router;
