from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routers import gateway, mpc, simulator

app = FastAPI(title="SovereignGate Security System")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

app.include_router(gateway.router)
app.include_router(mpc.router)
app.include_router(simulator.router)

@app.get("/")
async def root():
    return {"system": "SovereignGate", "version": "1.0.0-MVP"}
