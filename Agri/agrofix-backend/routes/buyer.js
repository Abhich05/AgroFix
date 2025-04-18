import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;
    if (!name || !email || !password || !contact) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await prisma.buyer.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    await prisma.buyer.create({
      data: { name, email, password: hash, contact }
    });
    res.status(201).json({ message: 'Buyer registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const buyer = await prisma.buyer.findUnique({ where: { email } });
    if (!buyer) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, buyer.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: buyer.id, email: buyer.email, role: 'buyer' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Auth middleware (JWT logic can remain)
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.buyer = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get current buyer profile
router.get('/me', auth, async (req, res) => {
  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: req.buyer.id },
      select: { id: true, name: true, email: true, contact: true, createdAt: true, updatedAt: true }
    });
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });
    res.json(buyer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

export default router;
