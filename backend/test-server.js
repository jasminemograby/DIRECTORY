import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    useMock: process.env.USE_MOCK || 'false'
  });
});

// Test mock data endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    data: { message: 'Backend is working!' },
    source: 'mock',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});
