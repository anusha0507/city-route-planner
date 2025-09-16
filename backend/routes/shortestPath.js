import express from 'express';
import Station from '../models/Station.js';

const router = express.Router();

// GET /api/shortest-path?from=<id1>&to=<id2>
// Returns shortest path by distance + total cost + total travel time of that path
router.get('/', async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'Both from and to station IDs are required.' });
  }

  try {
    const stations = await Station.find({});
    const distanceGraph = {};
    const costGraph = {};
    const timeGraph = {};

    // Build adjacency lists for distance, cost, and time
    stations.forEach((station) => {
      const stationId = station._id.toString();
      distanceGraph[stationId] = [];
      costGraph[stationId] = [];
      timeGraph[stationId] = [];
      
      station.connections.forEach((conn) => {
        const connId = conn.station.toString();
        distanceGraph[stationId].push({
          node: connId,
          weight: conn.distance
        });
        costGraph[stationId].push({
          node: connId,
          weight: conn.cost
        });
        timeGraph[stationId].push({
          node: connId,
          weight: conn.travelTime
        });
      });
    });

    // Dijkstra's algorithm for shortest distance path
    const dijkstra = (graph, start, end) => {
      const distances = {};
      const prev = {};
      const visited = new Set();
      const queue = new Set();

      Object.keys(graph).forEach((key) => {
        distances[key] = Infinity;
        prev[key] = null;
        queue.add(key);
      });

      distances[start] = 0;

      while (queue.size > 0) {
        let current = [...queue].reduce((minNode, node) =>
          distances[node] < distances[minNode] ? node : minNode
        );

        if (current === end) break;
        queue.delete(current);
        visited.add(current);

        for (const neighbor of graph[current]) {
          if (visited.has(neighbor.node)) continue;

          const newDist = distances[current] + neighbor.weight;
          if (newDist < distances[neighbor.node]) {
            distances[neighbor.node] = newDist;
            prev[neighbor.node] = current;
          }
        }
      }

      return { distances, prev };
    };

    // Calculate shortest path by distance
    const { distances: distDistances, prev: distPrev } = dijkstra(distanceGraph, from, to);

    if (distDistances[to] === Infinity) {
      return res.status(404).json({ error: 'No path found between stations.' });
    }

    // Build the shortest distance path
    const path = [];
    let curr = to;
    while (curr) {
      path.unshift(curr);
      curr = distPrev[curr];
    }

    // Calculate total cost and time for this specific path
    let totalCost = 0;
    let totalTime = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const currentStation = path[i];
      const nextStation = path[i + 1];
      
      // Find the connection between current and next station
      const costConnection = costGraph[currentStation].find(conn => conn.node === nextStation);
      const timeConnection = timeGraph[currentStation].find(conn => conn.node === nextStation);
      
      if (costConnection) totalCost += costConnection.weight;
      if (timeConnection) totalTime += timeConnection.weight;
    }

    res.json({
      from,
      to,
      path,
      totalDistance: distDistances[to],
      totalCost: totalCost,
      totalTime: totalTime,
      pathType: 'shortest_distance'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error calculating shortest path' });
  }
});

export default router;