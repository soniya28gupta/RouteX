"""
CityVision AI — FastAPI Application Entry Point
"""
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
import simulation
from routers import cameras, vehicles, detections, analytics, alerts, simulation_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    title="CityVision AI",
    description="Multi-Camera ANPR Trajectory Tracking & Urban Traffic Analytics",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(cameras.router, prefix="/api")
app.include_router(vehicles.router, prefix="/api")
app.include_router(detections.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(simulation_router.router, prefix="/api")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    simulation.connected_clients.add(websocket)
    try:
        while True:
            # Keep connection alive; simulation engine pushes events
            await asyncio.sleep(30)
    except WebSocketDisconnect:
        simulation.connected_clients.discard(websocket)
    except Exception:
        simulation.connected_clients.discard(websocket)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "CityVision AI", "cameras": 24}
