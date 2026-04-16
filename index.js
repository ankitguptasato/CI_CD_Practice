const express = require('express');
const client = require('prom-client');

const app = express();

// Create metrics registry
const register = new client.Registry();

// Default metrics (CPU, memory of app)
client.collectDefaultMetrics({ register });

// Custom metric: request count
const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of requests',
});
register.registerMetric(requestCounter);

// Custom metric: response time
const responseTime = new client.Histogram({
  name: 'http_response_time_seconds',
  help: 'Response time in seconds',
  buckets: [0.1, 0.5, 1, 2, 5],
});
register.registerMetric(responseTime);

// Middleware
app.use((req, res, next) => {
  requestCounter.inc();

  const end = responseTime.startTimer();
  res.on('finish', () => {
    end();
  });

  next();
});

// Normal route
app.get('/', (req, res) => {
  res.send('Hello Monitoring 🚀');
});

// Metrics endpoint (IMPORTANT)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => {
  console.log('App running on port 3000');
});
