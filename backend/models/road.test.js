const Road = require('./road');

describe('Road', () => {
    let road;

    beforeEach(() => {
        road = new Road('Test Road');
    });

    test('constructor initializes correctly', () => {
        expect(road.name).toBe('Test Road');
        expect(road.congestion).toBe(0);
        expect(road.connections).toEqual([]);
    });

    test('addConnection adds road to connections', () => {
        const otherRoad = new Road('Other Road');
        road.addConnection(otherRoad);
        expect(road.connections).toContain(otherRoad);
    });

    test('addVehicle increases congestion correctly', () => {
        road.addVehicle('Bike');
        expect(road.congestion).toBe(1);
        road.addVehicle('Car');
        expect(road.congestion).toBe(3);
        road.addVehicle('Bus');
        expect(road.congestion).toBe(7);
    });

    test('removeVehicle decreases congestion correctly', () => {
        road.addVehicle('Bus');
        road.addVehicle('Car');
        expect(road.congestion).toBe(6);
        road.removeVehicle('Car');
        expect(road.congestion).toBe(4);
    });

    test('congestion cannot go below 0', () => {
        road.removeVehicle('Car');
        expect(road.congestion).toBe(0);
    });

    test('toJSON returns correct format', () => {
        const otherRoad = new Road('Other Road');
        road.addConnection(otherRoad);
        const json = road.toJSON();
        expect(json).toEqual({
            name: 'Test Road',
            congestion: 0,
            connections: ['Other Road']
        });
    });

    test('addVehicle handles invalid vehicle type', () => {
        road.addVehicle('InvalidType');
        expect(road.congestion).toBe(0);
        
        // Test that valid types still work after invalid attempt
        road.addVehicle('Car');
        expect(road.congestion).toBe(2);
    });

    test('removeVehicle handles invalid vehicle type', () => {
        road.addVehicle('Car');  // Add congestion first
        expect(road.congestion).toBe(2);
        
        road.removeVehicle('InvalidType');
        expect(road.congestion).toBe(2);  // Congestion should remain unchanged
    });
});
