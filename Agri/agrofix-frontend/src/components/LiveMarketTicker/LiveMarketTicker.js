import React, { useEffect, useState, useRef } from 'react';
import './LiveMarketTicker.css';

// Simulated real-time crop price data (replace with API for production)
const crops = [
  { name: 'Wheat', unit: 'quintal' },
  { name: 'Rice', unit: 'quintal' },
  { name: 'Maize', unit: 'quintal' },
  { name: 'Cotton', unit: 'bale' },
  { name: 'Sugarcane', unit: 'tonne' },
  { name: 'Potato', unit: 'quintal' },
  { name: 'Onion', unit: 'quintal' }
];

function getRandomPrice(base) {
  return (base + Math.random() * 200 - 100).toFixed(0);
}

export default function LiveMarketTicker({ region }) {
  const [prices, setPrices] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Simulate fetching new prices every 5s
    const interval = setInterval(() => {
      setPrices(
        crops.map(crop => ({
          ...crop,
          price: getRandomPrice(2000 + Math.random() * 2000),
        }))
      );
    }, 5000);
    // Initial load
    setPrices(
      crops.map(crop => ({
        ...crop,
        price: getRandomPrice(2000 + Math.random() * 2000),
      }))
    );
    return () => clearInterval(interval);
  }, [region]);

  useEffect(() => {
    // Scroll animation
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let animationFrame;
    let scrollAmount = 0;
    const speed = 1; // px per frame
    function animate() {
      if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
        scrollAmount += speed;
        if (scrollAmount >= scrollContainer.scrollWidth) {
          scrollAmount = 0;
        }
        scrollContainer.scrollLeft = scrollAmount;
      }
      animationFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [prices]);

  return (
    <div className="market-ticker">
      <span className="market-ticker-title">🌾 Live Market Prices ({region})</span>
      <div className="market-ticker-scroll" ref={scrollRef}>
        {prices.map((crop, idx) => (
          <span className="market-ticker-item" key={crop.name}>
            {crop.name}: ₹{crop.price}/{crop.unit}
          </span>
        ))}
      </div>
    </div>
  );
}
