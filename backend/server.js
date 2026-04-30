import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import foodRoutes from './routes/food.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
    console.error('CRITICAL: Local MongoDB (localhost/127.0.0.1) is not supported in this environment. Please use a remote MongoDB Atlas connection string.');
  } else {
    console.log('Attempting to connect to remote MongoDB...');
    mongoose.connect(MONGODB_URI)
      .then(() => console.log('Successfully connected to MongoDB Atlas'))
      .catch((err) => {
        console.error('--- MONGODB CONNECTION ERROR ---');
        console.error('Message:', err.message);
        if (err.name === 'MongooseServerSelectionError') {
          console.error('Hint: Make sure your IP is allowlisted in MongoDB Atlas (Network Access) and that your username/password are correct.');
        }
        console.error('--------------------------------');
      });
  }
} else {
  console.warn('--- MISSING CONFIGURATION ---');
  console.warn('MONGODB_URI not found in environment secrets.');
  console.warn('-----------------------------');
}

// API Routes
app.get('/api/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const uri = process.env.MONGODB_URI || '';
  const isPlaceholder = uri.includes('<password>') || uri.includes('username');
  
  res.json({ 
    status: 'ok', 
    db: states[mongoose.connection.readyState] || 'unknown',
    hasUri: !!uri,
    isLocalhost: uri.includes('localhost') || uri.includes('127.0.0.1'),
    isPlaceholder: isPlaceholder
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);

async function startServer() {
  console.log('Starting server initialization...');

  if (process.env.NODE_ENV !== 'production') {
    console.log('Initializing Vite in development mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware integrated.');
  } else {
    console.log('Running in production mode...');
    // ❌ REMOVE dist serving completely
    // Backend will only serve APIs
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server fully initialized and running at http://0.0.0.0:${PORT}`);
  });
}

/*async function startServer() {
  console.log('Starting server initialization...');
  if (process.env.NODE_ENV !== 'production') {
    console.log('Initializing Vite in development mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware integrated.');
  } else {
    console.log('Running in production mode...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server fully initialized and running at http://0.0.0.0:${PORT}`);
  });
}

startServer();*/
