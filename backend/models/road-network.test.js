const RoadNetwork = require('./road-network');
const Road = require('./road');

describe('RoadNetwork', () => {
    let network;

    beforeEach(() => {
        network = new RoadNetwork();
    });

    test('constructor initializes empty roads object', () => {
        expect(network.roads).toEqual({});
    });

    test('addRoad creates new road', () => {
        network.addRoad('Test Road');
        expect(network.roads['Test Road']).toBeInstanceOf(Road);
    });

    test('addRoad does not create duplicate road', () => {
        network.addRoad('Test Road');
        const firstRoad = network.roads['Test Road'];
        network.addRoad('Test Road');
        expect(network.roads['Test Road']).toBe(firstRoad);
    });

    test('connectRoads connects roads bidirectionally', () => {
        network.addRoad('Road A');
        network.addRoad('Road B');
        network.connectRoads('Road A', 'Road B');
        
        expect(network.roads['Road A'].connections).toContainEqual(network.roads['Road B']);
        expect(network.roads['Road B'].connections).toContainEqual(network.roads['Road A']);
    });

    test('connectRoads handles invalid road names', () => {
        network.addRoad('Road A');
        network.connectRoads('Road A', 'Invalid Road');
        expect(network.roads['Road A'].connections).toHaveLength(0);
    });

    test('connectRoads prevents duplicate connections', () => {
        network.addRoad('Road A');
        network.addRoad('Road B');
        
        network.connectRoads('Road A', 'Road B');
        network.connectRoads('Road A', 'Road B'); // Attempt to connect again
        
        expect(network.roads['Road A'].connections).toHaveLength(1);
        expect(network.roads['Road B'].connections).toHaveLength(1);
    });

    test('addVehicleToRoad increases road congestion', () => {
        network.addRoad('Test Road');
        network.addVehicleToRoad('Test Road', 'Car');
        expect(network.roads['Test Road'].congestion).toBe(2);
    });

    test('addVehicleToRoad handles non-existent road', () => {
        network.addVehicleToRoad('Non-existent Road', 'Car');
        expect(network.roads['Non-existent Road']).toBeUndefined();
    });

    test('removeVehicleFromRoad decreases road congestion', () => {
        network.addRoad('Test Road');
        network.addVehicleToRoad('Test Road', 'Bus');
        network.removeVehicleFromRoad('Test Road', 'Bus');
        expect(network.roads['Test Road'].congestion).toBe(0);
    });

    test('removeVehicleFromRoad handles non-existent road', () => {
        network.removeVehicleFromRoad('Non-existent Road', 'Car');
        expect(network.roads['Non-existent Road']).toBeUndefined();
    });

    test('findRoute returns optimal path considering congestion', () => {
        // Set up a test network
        ['A', 'B', 'C', 'D'].forEach(name => network.addRoad(name));
        network.connectRoads('A', 'B');
        network.connectRoads('B', 'C');
        network.connectRoads('A', 'D');
        network.connectRoads('D', 'C');
        
        // Introduce congestion on one path
        network.addVehicleToRoad('B', 'Bus');
        
        const route = network.findRoute('A', 'C');
        expect(route).toEqual(['A', 'D', 'C']);
    });

    test('findRoute updates bestRoute when better score is found', () => {
        ['A', 'B', 'C'].forEach(name => network.addRoad(name));
        network.connectRoads('A', 'B');
        network.connectRoads('B', 'C');
        
        // Add high congestion to make the first found route less optimal
        network.addVehicleToRoad('B', 'Bus');
        
        const route = network.findRoute('A', 'C');
        expect(route).toEqual(['A', 'B', 'C']);
    });

    test('findRoute returns null for invalid roads', () => {
        expect(network.findRoute('Invalid', 'Road')).toBeNull();
    });

    test('findRoute updates bestRoute when finding lower score path', () => {
        // Create a network with two possible paths:
        // A -> B -> C (shorter but congested)
        // A -> D -> E -> C (longer but less congested)
        ['A', 'B', 'C', 'D', 'E'].forEach(name => network.addRoad(name));
        
        // Create two paths
        network.connectRoads('A', 'B');
        network.connectRoads('B', 'C');
        network.connectRoads('A', 'D');
        network.connectRoads('D', 'E');
        network.connectRoads('E', 'C');
        
        // Make the shorter path highly congested
        network.addVehicleToRoad('B', 'Bus');
        network.addVehicleToRoad('B', 'Bus');
        
        // Add minimal congestion to the longer path
        network.addVehicleToRoad('D', 'Bike');
        network.addVehicleToRoad('E', 'Bike');
        
        const route = network.findRoute('A', 'C');
        
        expect(route).toEqual(['A', 'D', 'E', 'C']);
    });

    test('findRoute compares scores correctly', () => {
        // Create a network with two paths:
        // Path 1: A -> B -> C (will be found first, higher score)
        // Path 2: A -> D -> C (will be found second, lower score)
        ['A', 'B', 'C', 'D'].forEach(name => network.addRoad(name));
        
        // Create paths
        network.connectRoads('A', 'B');
        network.connectRoads('B', 'C');
        network.connectRoads('A', 'D');
        network.connectRoads('D', 'C');
        
        // Make first path (A->B->C) highly congested
        network.addVehicleToRoad('B', 'Bus'); // 4 units
        network.addVehicleToRoad('B', 'Car'); // +2 units = 6 total
        
        // Make second path (A->D->C) less congested
        network.addVehicleToRoad('D', 'Bike'); // 1 unit
        
        const route = network.findRoute('A', 'C');
        
        // Should choose A->D->C because:
        // Path 1 score: (6 * 0.7) + (3 * 0.3) = 5.1
        // Path 2 score: (1 * 0.7) + (3 * 0.3) = 1.6
        expect(route).toEqual(['A', 'D', 'C']);
    });

    test('findRoute does not update bestRoute when score is not better', () => {
        // Create a network with two equal-length paths:
        // Path 1: A -> B -> C
        // Path 2: A -> D -> C
        ['A', 'B', 'C', 'D'].forEach(name => network.addRoad(name));
        
        // Create two paths with equal congestion
        network.connectRoads('A', 'B');
        network.connectRoads('B', 'C');
        network.connectRoads('A', 'D');
        network.connectRoads('D', 'C');
        
        // Add equal congestion to both paths
        network.addVehicleToRoad('B', 'Car'); // 2 units
        network.addVehicleToRoad('D', 'Car'); // 2 units
        
        const route = network.findRoute('A', 'C');
        
        // Should keep the first found route (A->B->C) since scores are equal:
        // Both paths: (2 * 0.7) + (3 * 0.3) = 2.3
        expect(route).toEqual(['A', 'B', 'C']);
    });

    test('toJSON returns correct network representation', () => {
        network.addRoad('A');
        network.addRoad('B');
        network.connectRoads('A', 'B');
        network.addVehicleToRoad('A', 'Car');

        const json = network.toJSON();
        expect(json).toEqual({
            'A': {
                congestion: 2,
                connections: ['B']
            },
            'B': {
                congestion: 0,
                connections: ['A']
            }
        });
    });
});
