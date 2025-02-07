# Congestion-Based Road Network Route Finder

A real-time road network management system that helps find optimal routes considering traffic congestion levels. Live demo available at [road-network.reinhardjs.my.id](https://road-network.reinhardjs.my.id).

## Features

- **Real-time congestion monitoring**
- **Vehicle type-based congestion calculation** (Bike, Car, Bus)
- **Optimal route finding** using congestion-aware pathfinding
- **Interactive road network visualization**
- **RESTful API** with Fastify

## Tech Stack

### Frontend
- **Next.js 15**
- **React 19**
- **Tailwind CSS**
- **Axios**

### Backend
- **Node.js 20**
- **Fastify**
- **Docker**

## API Endpoints

- `GET /roads` - Get all roads and their current state
- `POST /add-vehicle` - Add a vehicle to a road
- `POST /remove-vehicle` - Remove a vehicle from a road
- `GET /route` - Find optimal route between two points

## Algorithm

The system uses a modified Dijkstra's algorithm that considers both distance and congestion levels when finding optimal routes. Each vehicle type contributes differently to congestion:

- Bike: 1 unit
- Car: 2 units
- Bus: 4 units

## Getting Started

### Prerequisites
- **Node.js 20 or higher**
- **Docker** (optional)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/reinhardjs/road-network.git
   cd road-network
   ```

2. **Install dependencies:**

   **Frontend:**

   ```bash
   cd frontend
   npm install
   ```

   **Backend:**

   ```bash
   cd backend
   npm install
   ```

3. **Environment Setup:**

   **Frontend (.env.local):**

   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
   ```

4. **Start the application:**

   **Development mode:**

   **Backend:**

   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

