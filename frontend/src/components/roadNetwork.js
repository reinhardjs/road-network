'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RoadNetwork = () => {
  const [roads, setRoads] = useState({});
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [route, setRoute] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoads();
  }, []);

  const fetchRoads = async () => {
    try {
      const response = await axios.get('http://localhost:5000/roads');
      setRoads(response.data);
    } catch (err) {
      setError('Failed to fetch roads');
    }
  };

  const handleAddVehicle = async (road, vehicleType) => {
    try {
      await axios.post('http://localhost:5000/add-vehicle', { road, type: vehicleType });
      await fetchRoads();
    } catch (err) {
      setError('Failed to add vehicle');
    }
  };

  const handleRemoveVehicle = async (road, vehicleType) => {
    try {
      await axios.post('http://localhost:5000/remove-vehicle', { road, type: vehicleType });
      await fetchRoads();
    } catch (err) {
      setError('Failed to remove vehicle');
    }
  };

  const findRoute = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/route?start=${start}&end=${end}`);
      setRoute(response.data.route);
    } catch (err) {
      setError('Failed to find route');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold my-8 text-center">Find Route</h1>
        <div className="flex gap-2 mb-4 justify-center">
          <select
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select start point</option>
            {Object.keys(roads).map(road => (
              <option key={road} value={road}>{road}</option>
            ))}
          </select>
          <select
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select end point</option>
            {Object.keys(roads).map(road => (
              <option key={road} value={road}>{road}</option>
            ))}
          </select>
          <button
            onClick={findRoute}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Find Route
          </button>
        </div>
        {route && route.length > 0 && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Suggested Route:</h3>
            <p>{route.join(' > ')}</p>
          </div>
        )}

        <div className="w-full flex justify-center my-8">
          <img 
            src="/images/map.png" 
            alt="Road Network Map" 
            className="max-w-xl w-full rounded-lg shadow-lg"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(roads).map(([name, road]) => (
          <div key={name} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{name}</h3>
            <p>Congestion: {road.congestion}</p>
            <div className="mt-2 flex flex-col gap-2">
              <select
                id={`vehicle-${name}`}
                className="border p-2 rounded"
                defaultValue="Car"
              >
                <option value="Bike">Bike</option>
                <option value="Car">Car</option>
                <option value="Bus">Bus</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddVehicle(name, document.getElementById(`vehicle-${name}`).value)}
                  className="bg-blue-500 text-white px-3 py-1 rounded flex-1"
                >
                  Add Vehicle
                </button>
                <button
                  onClick={() => handleRemoveVehicle(name, document.getElementById(`vehicle-${name}`).value)}
                  className="bg-red-500 text-white px-3 py-1 rounded flex-1"
                >
                  Remove Vehicle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadNetwork;
