import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URL =
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/db_harsh';

const REDIS_URL =
  process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const redis = new Redis(REDIS_URL);

app.get('/mongo', (req, res) => {
  const connected = mongoose.connection.readyState === 1;

  res.status(connected ? 200 : 503).json({
    message: connected
      ? 'MongoDB connected successfully'
      : 'MongoDB is not connected'
  });
});

app.get('/redis', async (req, res) => {
  try {
    const reply = await redis.ping();
    res.json({ message: reply });
  } catch (error) {
    res.status(500).json({
      message: 'Redis connection failed',
      error: error.message
    });
  }
});

async function start() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

start();