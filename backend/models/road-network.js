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

        // Compare and return the best route
        const allRoutes = dfsResults.filter(Boolean);
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
