import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const router = Router();

// Admin login
router.post('/login', async (req, res) => {
  // For now, use fixed credentials
  const { email, password } = req.body;
  const fixedEmail = "admin@agrofix.com";
  const fixedPassword = "admin123";
  if (email !== fixedEmail || password !== fixedPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // Simulate user object
  const user = { id: 1, role: 'admin' };
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// JWT auth middleware
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Get dashboard analytics (protected)
router.get('/dashboard', requireAdminAuth, async (req, res) => {
  // Example analytics
  const ordersToday = await prisma.order.count({
    where: { createdAt: { gte: new Date(Date.now() - 24*60*60*1000) } },
  });
  const topProducts = await prisma.product.findMany({
    orderBy: { stock: 'asc' },
    take: 5,
  });
  res.json({ ordersToday, topProducts });
});

export default router;
