const Road = require('./road');

class RoadNetwork {
    constructor() {
        this.roads = {};
    }

    addRoad(name) {
        this.roads[name] = new Road(name);
    }

    connectRoads(roadA, roadB) {
        if (this.roads[roadA] && this.roads[roadB]) {
            this.roads[roadA].addConnection(this.roads[roadB]);
            this.roads[roadB].addConnection(this.roads[roadA]);
        }
    }

    addVehicleToRoad(roadName, vehicleType) {
        if (this.roads[roadName]) {
            this.roads[roadName].addVehicle(vehicleType);
        }
    }

    removeVehicleFromRoad(roadName, vehicleType) {
        if (this.roads[roadName]) {
            this.roads[roadName].removeVehicle(vehicleType);
        }
    }

    findRoute(start, end) {
        // Get all possible routes using DFS
        const visited = new Set();
        const route = [];
        const dfsResults = [];

        const dfs = (current) => {
            if (current.name === end) {
                dfsResults.push([...route, current.name]);
                return;
            }

            visited.add(current.name);
            route.push(current.name);

            current.connections.forEach((connection) => {
                if (!visited.has(connection.name)) {
                    dfs(connection);
                }
            });

            route.pop();
            visited.delete(current.name);
        };

        dfs(this.roads[start]);

        // Get shortest path considering congestion
        const shortestPath = this.findShortestRoute(start, end);

        // Compare and return the best route
        const allRoutes = [...dfsResults, shortestPath].filter(Boolean);
        return allRoutes.sort((a, b) => {
            const aCongestion = this.calculateCongestion(a);
            const bCongestion = this.calculateCongestion(b);
            const aLength = a.length;
            const bLength = b.length;
            
            // Weighted scoring: 70% congestion, 30% path length
            const aScore = (aCongestion * 0.7) + (aLength * 0.3);
            const bScore = (bCongestion * 0.7) + (bLength * 0.3);
            
            return aScore - bScore;
        })[0];
    }

    findShortestRoute(start, end) {
        const distances = {};
        const previous = {};
        const unvisited = new Set();
        
        // Initialize distances
        Object.keys(this.roads).forEach(roadName => {
            distances[roadName] = Infinity;
            previous[roadName] = null;
            unvisited.add(roadName);
        });
        distances[start] = 0;

        while (unvisited.size > 0) {
            // Find the unvisited node with the smallest distance
            let current = null;
            let smallestDistance = Infinity;
            
            for (const roadName of unvisited) {
                if (distances[roadName] < smallestDistance) {
                    smallestDistance = distances[roadName];
                    current = roadName;
                }
            }

            if (current === null) break;
            if (current === end) break;

            unvisited.delete(current);

            // Calculate weight for each neighbor
            for (const neighbor of this.roads[current].connections) {
                if (!unvisited.has(neighbor.name)) continue;

                // Weight calculation: base distance (1) + neighbor's congestion
                const weight = 1 + neighbor.congestion;
                const totalDistance = distances[current] + weight;

                if (totalDistance < distances[neighbor.name]) {
                    distances[neighbor.name] = totalDistance;
                    previous[neighbor.name] = current;
                }
            }
        }

        // Reconstruct path
        const path = [];
        let current = end;

        while (current !== null) {
            path.unshift(current);
            current = previous[current];
        }

        return path.length > 1 ? path : null;
    }

    calculateCongestion(route) {
        return route.reduce((total, roadName) => total + this.roads[roadName].congestion, 0);
    }

    toJSON() {
        return Object.fromEntries(
            Object.entries(this.roads).map(([name, road]) => [
                name,
                {
                    congestion: road.congestion,
                    connections: road.connections.map(conn => conn.name)
                }
            ])
        );
    }
}

module.exports = RoadNetwork;
