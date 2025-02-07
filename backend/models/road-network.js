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
        const visited = new Set();
        const route = [];
        const result = [];

        const dfs = (current) => {
            if (current.name === end) {
                result.push([...route, current.name]);
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
        return result.sort((a, b) => this.calculateCongestion(a) - this.calculateCongestion(b))[0];
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
