import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import adminAuth from '../utils/adminAuth.js';
const prisma = new PrismaClient();

const router = Router();

// Get inventory (public)
router.get('/public', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// Get inventory (admin)
router.get('/', adminAuth, async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products.map(p => ({ id: p.id, name: p.name, price: p.price, stock: p.stock, description: p.description, imageUrl: p.imageUrl })));
});

// Add item (admin)
router.post('/', adminAuth, async (req, res) => {
  const { name, price, stock, description, imageUrl } = req.body;
  const product = await prisma.product.create({ data: { name, price, stock, description, imageUrl } });
  res.status(201).json(product);
});

// Edit item (admin)
router.put('/:id', adminAuth, async (req, res) => {
  const { name, price, stock, description, imageUrl } = req.body;
  const product = await prisma.product.update({ where: { id: Number(req.params.id) }, data: { name, price, stock, description, imageUrl } });
  res.json(product);
});

// Remove item (admin)
router.delete('/:id', adminAuth, async (req, res) => {
  await prisma.product.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

// Smart inventory suggestion (admin)
router.get('/suggestions', adminAuth, async (req, res) => {
  res.json({ suggestion: 'Increase stock for wheat due to forecasted rain.' });
});

export default router;
