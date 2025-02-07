'use client';
import { useState, useEffect } from 'react';
import { roadNetworkApi } from '../services/api';

const RoadNetwork = () => {
  const [roads, setRoads] = useState({});
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [route, setRoute] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState({});

  useEffect(() => {
    fetchRoads();
  }, []);

  const fetchRoads = async () => {
    setIsLoading(true);
    try {
      const response = await roadNetworkApi.getRoads();
      setRoads(response.data);
    } catch (err) {
      setError('Failed to fetch roads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async (road, vehicleType) => {
    setLoadingVehicles(prev => ({ ...prev, [road]: 'add' }));
    try {
      await roadNetworkApi.addVehicle({ road, type: vehicleType });
      await fetchRoads();
    } catch (err) {
      setError('Failed to add vehicle');
    } finally {
      setLoadingVehicles(prev => ({ ...prev, [road]: null }));
    }
  };

  const handleRemoveVehicle = async (road, vehicleType) => {
    setLoadingVehicles(prev => ({ ...prev, [road]: 'remove' }));
    try {
      await roadNetworkApi.removeVehicle({ road, type: vehicleType });
      await fetchRoads();
    } catch (err) {
      setError('Failed to remove vehicle');
    } finally {
      setLoadingVehicles(prev => ({ ...prev, [road]: null }));
    }
  };

  const findRoute = async () => {
    setIsLoading(true);
    try {
      const response = await roadNetworkApi.findRoute(start, end);
      setRoute(response.data.route);
    } catch (err) {
      setError('Failed to find route');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

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
            disabled={isLoading}
            className={`${
              isLoading ? 'bg-green-300' : 'bg-green-500'
            } text-white px-4 py-2 rounded flex items-center gap-2`}
          >
            {isLoading ? (
              <>
                {renderLoadingSpinner()}
                Finding...
              </>
            ) : (
              'Find Route'
            )}
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
                  disabled={loadingVehicles[name]}
                  className={`${
                    loadingVehicles[name] === 'add' ? 'bg-blue-300' : 'bg-blue-500'
                  } text-white px-3 py-1 rounded flex-1 flex items-center justify-center gap-2`}
                >
                  {loadingVehicles[name] === 'add' ? (
                    <>
                      {renderLoadingSpinner()}
                      Adding...
                    </>
                  ) : (
                    'Add Vehicle'
                  )}
                </button>
                <button
                  onClick={() => handleRemoveVehicle(name, document.getElementById(`vehicle-${name}`).value)}
                  disabled={loadingVehicles[name]}
                  className={`${
                    loadingVehicles[name] === 'remove' ? 'bg-red-300' : 'bg-red-500'
                  } text-white px-3 py-1 rounded flex-1 flex items-center justify-center gap-2`}
                >
                  {loadingVehicles[name] === 'remove' ? (
                    <>
                      {renderLoadingSpinner()}
                      Removing...
                    </>
                  ) : (
                    'Remove Vehicle'
                  )}
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
