import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import adminAuth from '../utils/adminAuth.js';
const prisma = new PrismaClient();

const router = Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add product (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, price, stock, description, imageUrl } = req.body;
    if (!name || typeof price !== 'number') {
      return res.status(400).json({ error: 'Invalid product data' });
    }
    const product = await prisma.product.create({
      data: {
        name,
        price,
        stock: typeof stock === 'number' ? stock : 0,
        description: description || '',
        imageUrl: imageUrl || ''
      }
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Edit product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, price } = req.body;
    const { id } = req.params;
    if ((!name && typeof price !== 'number') || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid product data' });
    }
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { ...(name && { name }), ...(typeof price === 'number' && { price }) },
    });
    res.json(product);
  } catch (err) {
    res.status(404).json({ error: 'Product not found or update failed' });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ error: 'Product not found or delete failed' });
  }
});

export default router;
