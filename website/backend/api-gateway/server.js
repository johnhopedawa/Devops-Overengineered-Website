const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// Route: Resume API
app.use('/api/resume', createProxyMiddleware({
  target: 'http://resume-api-service:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/resume': '/resume', // Remove /api prefix when forwarding
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(503).json({ error: 'Resume service unavailable' });
  }
}));

// Route: GCP Health API (Cloud Run)
app.use('/api/gcp-health', createProxyMiddleware({
  target: process.env.GCP_HEALTH_API_URL || 'https://gcp-health-api-jpawjztt4a-uw.a.run.app',
  changeOrigin: true,
  pathRewrite: {
    '^/api/gcp-health': '', // Remove /api/gcp-health prefix when forwarding
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[GCP Health Proxy] ${req.method} ${req.url} → ${process.env.GCP_HEALTH_API_URL || 'https://gcp-health-api-jpawjztt4a-uw.a.run.app'}${req.url.replace('/api/gcp-health', '')}`);
  },
  onError: (err, req, res) => {
    console.error('GCP Health API proxy error:', err);
    res.status(503).json({ error: 'GCP Health service unavailable' });
  }
}));

// Route: Metrics API
app.use('/api/metrics', createProxyMiddleware({
  target: 'http://metrics-api-service:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/metrics': '/metrics',
  },
  onError: (err, req, res) => {
    console.error('Metrics API proxy error:', err);
    res.status(503).json({ error: 'Metrics service unavailable' });
  }
}));

// Future APIs will be added here
// app.use('/api/blog', createProxyMiddleware({ target: 'http://blog-api:3003', ... }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('  - GET /health');
  console.log('  - GET /api/resume');
  console.log('  - GET /api/gcp-health (proxies to Cloud Run)');
  console.log('  - GET /api/gcp-health/api/health (Cloud Run JSON endpoint)');
  console.log('  - GET /api/metrics (proxies to metrics-api-service:3002)');
});
