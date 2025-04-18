import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import adminAuth from '../utils/adminAuth.js';
const prisma = new PrismaClient();

const router = Router();

// Place order
router.post('/', async (req, res) => {
  try {
    // Accept frontend format and map to schema
    const { userId, userDetails, products, quantity, region } = req.body;
    if (!userId || !userDetails || !products || !quantity || !region) {
      console.error('Order POST missing fields:', req.body);
      return res.status(400).json({ error: 'Invalid order data' });
    }
    const { name, contact, address } = userDetails;
    const items = products.map((id, idx) => ({
      product_id: id,
      name: `Product ${id}`,
      price: 0,
      quantity: 1
    })); // TODO: Replace with actual product info lookup if needed
    const order = await prisma.order.create({
      data: {
        userId: userId,
        buyer_name: name,
        buyer_contact: contact,
        delivery_address: address,
        region: region,
        items,
        quantity,
        status: 'pending',
      },
    });
    res.status(201).json({ id: order.id });
  } catch (err) {
    console.error('Order POST error:', err, req.body);
    res.status(500).json({ error: 'Failed to place order', details: err.message });
  }
});

// Get all orders (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Track order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'in_progress', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status }
    });
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: 'Order not found or update failed' });
  }
});

export default router;
