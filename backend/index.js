const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const RoadNetwork = require('./models/road-network');

const roadNetwork = new RoadNetwork();

// Register CORS
fastify.register(cors, {
  origin: true
});

// Initial Road Data
const initialRoads = {
  "NE 42nd Way": { connections: ["NE 42nd St"] },
  "NE 42nd St": { connections: ["NE 42nd Way", "201st Ave NE", "202nd Ave NE", "NE 39th St", "203rd Ave NE"] },
  "201st Ave NE": { connections: ["NE 42nd St", "NE 44th St"] },
  "202nd Ave NE": { connections: ["NE 42nd St", "NE 44th St"] },
  "NE 39th St": { connections: ["NE 39th Ln", "NE 42nd St", "203rd Ave NE", "204th Ave NE"] },
  "NE 39th Ln": { connections: ["NE 39th St"] },
  "NE 44th St": { connections: ["201st Ave NE", "202nd Ave NE"] },
  "203rd Ave NE": { connections: ["204th Ave NE", "NE 39th St", "NE 42nd St"] },
  "204th Ave NE": { connections: ["203rd Ave NE", "NE 39th St", "206th PI NE", "205th PI NE"] },
  "205th PI NE": { connections: ["204th Ave NE"] },
  "206th PI NE": { connections: ["204th Ave NE"] },
};

// Initialize roads
Object.keys(initialRoads).forEach((roadName) => roadNetwork.addRoad(roadName));
Object.entries(initialRoads).forEach(([roadName, { connections }]) => {
  connections.forEach((connection) => roadNetwork.connectRoads(roadName, connection));
});

// Route schemas
const vehicleSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['road', 'type'],
      properties: {
        road: { type: 'string' },
        type: { type: 'string', enum: ['Bike', 'Car', 'Bus'] }
      }
    }
  }
};

const routeQuerySchema = {
  schema: {
    querystring: {
      type: 'object',
      required: ['start', 'end'],
      properties: {
        start: { type: 'string' },
        end: { type: 'string' }
      }
    }
  }
};

// Routes
fastify.get('/roads', async (request, reply) => {
  return roadNetwork.toJSON();
});

fastify.post('/add-vehicle', vehicleSchema, async (request, reply) => {
  const { road, type } = request.body;
  if (!roadNetwork.roads[road]) {
    reply.code(400);
    throw new Error('Invalid road name');
  }
  roadNetwork.addVehicleToRoad(road, type);
  return { success: true, roads: roadNetwork.toJSON() };
});

fastify.post('/remove-vehicle', vehicleSchema, async (request, reply) => {
  const { road, type } = request.body;
  if (!roadNetwork.roads[road]) {
    reply.code(400);
    throw new Error('Invalid road name');
  }
  roadNetwork.removeVehicleFromRoad(road, type);
  return { success: true, roads: roadNetwork.toJSON() };
});

fastify.get('/route', routeQuerySchema, async (request, reply) => {
  const { start, end } = request.query;
  if (!roadNetwork.roads[start] || !roadNetwork.roads[end]) {
    reply.code(400);
    throw new Error('Invalid road names');
  }
  const route = roadNetwork.findRoute(start, end);
  return { route };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 5000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
