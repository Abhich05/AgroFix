import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import routes from './routes/index.js';
import buyerRoutes from '../routes/buyer.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.use('/api/buyers', buyerRoutes);

app.get('/', (req, res) => {
  res.send('Agrofix Backend API Running');
});

// Real-time analytics via WebSocket
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
const server = createServer(app);
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ message: 'Connected to Agrofix Analytics' }));
  // TODO: Push live analytics data
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
