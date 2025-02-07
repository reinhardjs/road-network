const Road = require("./road");

class RoadNetwork {
    constructor() {
        this.roads = {};
    }

    addRoad(name) {
        if (!this.roads[name]) {
            this.roads[name] = new Road(name);
        }
    }

    connectRoads(roadA, roadB) {
        if (!this.roads[roadA] || !this.roads[roadB]) return;
        
        const road1 = this.roads[roadA];
        const road2 = this.roads[roadB];

        if (!road1.connections.includes(road2)) {
            road1.addConnection(road2);
        }
        if (!road2.connections.includes(road1)) {
            road2.addConnection(road1);
        }
    }

    addVehicleToRoad(roadName, vehicleType) {
        const road = this.roads[roadName];
        if (road) road.addVehicle(vehicleType);
    }

    removeVehicleFromRoad(roadName, vehicleType) {
        const road = this.roads[roadName];
        if (road) road.removeVehicle(vehicleType);
    }

    findRoute(start, end) {
        if (!this.roads[start] || !this.roads[end]) return null;

        let bestRoute = null;
        let bestScore = Infinity;
        const visited = new Set();

        const dfs = (current, path, totalCongestion) => {
            if (current.name === end) {
                const score = totalCongestion * 0.7 + path.length * 0.3;
                if (score < bestScore) {
                    bestScore = score;
                    bestRoute = [...path, current.name];
                }
                return;
            }

            visited.add(current.name);

            for (const connection of current.connections) {
                if (!visited.has(connection.name)) {
                    dfs(connection, [...path, current.name], totalCongestion + connection.congestion);
                }
            }

            visited.delete(current.name);
        };

        dfs(this.roads[start], [], 0);
        return bestRoute;
    }

    toJSON() {
        return Object.fromEntries(
            Object.entries(this.roads).map(([name, road]) => [
                name,
                {
                    congestion: road.congestion,
                    connections: road.connections.map(conn => conn.name),
                },
            ])
        );
    }
}

module.exports = RoadNetwork;
