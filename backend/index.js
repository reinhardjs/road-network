const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;
const roadNetwork = require("./models/road-network");;

app.use(express.json());
app.use(cors());

// Initial Road Data (Graph Representation)
const initialRoads = {
    "NE 42nd Way": { connections: ["NE 42nd St"] },
    "NE 42nd St": { connections: ["NE 42nd Way", "201st Ave NE", "202nd Ave NE", "NE 39th St", "203rd Ave NE"] },
    "NE 44th St": { connections: ["201st Ave NE", "202nd Ave NE"] },
    "NE 39th St": { connections: ["NE 39th Ln", "NE 42nd St", "201st Ave NE", "202nd Ave NE", "203rd Ave NE", "204th Ave NE", "206th PI NE"] },
    "203rd Ave NE": { connections: ["204th Ave NE", "NE 39th St", "202nd Ave NE", "201st Ave NE", "NE 42nd St"] },
    "204th Ave NE": { connections: ["203rd Ave NE", "NE 39th St", "206th PI NE", "205th PI NE"] },
    "206th PI NE": { connections: ["NE 39th St", "204th Ave NE"] },
};

Object.keys(initialRoads).forEach((roadName) => roadNetwork.addRoad(roadName));
Object.entries(initialRoads).forEach(([roadName, { connections }]) => {
    connections.forEach((connection) => roadNetwork.connectRoads(roadName, connection));
});

// API Routes
app.get("/roads", (req, res) => {
    const roadsData = Object.fromEntries(
        Object.entries(roadNetwork.roads).map(([name, road]) => [name, { congestion: road.congestion, connections: road.connections.map(conn => conn.name) }])
    );
    res.json(roadsData);
});

app.post("/add-vehicle", (req, res) => {
    const { road, type } = req.body;
    if (!roadNetwork.roads[road] || !["Bike", "Car", "Bus"].includes(type)) {
        return res.status(400).json({ error: "Invalid road or vehicle type" });
    }
    roadNetwork.addVehicleToRoad(road, type);
    res.json({ success: true, roads: roadNetwork.roads });
});

app.post("/remove-vehicle", (req, res) => {
    const { road, type } = req.body;
    if (!roadNetwork.roads[road] || !["Bike", "Car", "Bus"].includes(type)) {
        return res.status(400).json({ error: "Invalid road or vehicle type" });
    }
    roadNetwork.removeVehicleFromRoad(road, type);
    res.json({ success: true, roads: roadNetwork.roads });
});

app.get("/route", (req, res) => {
    const { start, end } = req.query;
    if (!roadNetwork.roads[start] || !roadNetwork.roads[end]) {
        return res.status(400).json({ error: "Invalid road names" });
    }
    const route = roadNetwork.findRoute(start, end);
    res.json({ route });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
