class Road {
  constructor(name) {
      this.name = name;
      this.congestion = 0;
      this.connections = [];
  }

  addConnection(road) {
      this.connections.push(road);
  }

  addVehicle(type) {
      const congestionValues = { Bike: 1, Car: 2, Bus: 4 };
      this.congestion += congestionValues[type] || 0;
  }

  removeVehicle(type) {
      const congestionValues = { Bike: 1, Car: 2, Bus: 4 };
      this.congestion -= congestionValues[type] || 0;
      if (this.congestion < 0) this.congestion = 0;
  }
}

export default Road;
