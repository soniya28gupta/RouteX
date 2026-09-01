from fastapi import APIRouter
import simulation

router = APIRouter()

@router.post("/simulation/start")
async def start_sim():
    ok = simulation.start_simulation()
    if ok:
        return {"status": "started"}
    return {"status": "already_running"}

@router.post("/simulation/stop")
async def stop_sim():
    simulation.stop_simulation()
    return {"status": "stopped"}

@router.get("/simulation/status")
async def sim_status():
    return simulation.get_status()
