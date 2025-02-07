import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
    throw new Error('API base URL is not defined in the environment variables');
}

const api = axios.create({
    baseURL: apiBaseUrl
});

export const roadNetworkApi = {
    getRoads: () => api.get('/roads'),
    addVehicle: (data) => api.post('/add-vehicle', data),
    removeVehicle: (data) => api.post('/remove-vehicle', data),
    findRoute: (start, end) => api.get(`/route?start=${start}&end=${end}`),
};

export default api;
