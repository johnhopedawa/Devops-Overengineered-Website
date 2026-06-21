const express = require('express');
const app = express();
const PORT = 3002;

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://prometheus-operated.monitoring.svc.cluster.local:9090';

async function queryPrometheus(query) {
  const url = `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Prometheus returned ${response.status}`);
  const data = await response.json();
  return data.data.result;
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'metrics-api' });
});

app.get('/metrics', async (req, res) => {
  try {
    const [cpuResults, ramResults, podCount, nodeCount] = await Promise.all([
      queryPrometheus(
        '100 - (avg by(nodename) (rate(node_cpu_seconds_total{mode="idle"}[5m]) * on(instance) group_left(nodename) node_uname_info) * 100)'
      ),
      queryPrometheus(
        '100 * (1 - sum by(nodename) (node_memory_MemAvailable_bytes * on(instance) group_left(nodename) node_uname_info) / sum by(nodename) (node_memory_MemTotal_bytes * on(instance) group_left(nodename) node_uname_info))'
      ),
      queryPrometheus('count(kube_pod_info{namespace="overengineered"})'),
      queryPrometheus('count(kube_node_info)'),
    ]);

    res.json({
      cpu: cpuResults.map(r => ({
        node: r.metric.nodename,
        value: parseFloat(r.value[1]).toFixed(1),
      })),
      ram: ramResults.map(r => ({
        node: r.metric.nodename,
        value: parseFloat(r.value[1]).toFixed(1),
      })),
      pods: podCount[0] ? parseInt(podCount[0].value[1]) : 0,
      nodes: nodeCount[0] ? parseInt(nodeCount[0].value[1]) : 0,
    });
  } catch (err) {
    console.error('Prometheus query failed:', err.message);
    res.status(503).json({ error: 'Prometheus unavailable', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Metrics API running on http://localhost:${PORT}`);
  console.log(`Prometheus URL: ${PROMETHEUS_URL}`);
});
