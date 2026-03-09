from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.evaluate import router as evaluate_router

app = FastAPI(title="MorphoMinds Hindi Level 2")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(evaluate_router)

@app.get("/")
def root():
    return {"message": "MorphoMinds Backend Running"}