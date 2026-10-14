from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import Base, engine
from routes.produto_routes import router as produto_router
from routes.health_routes import router as health_router
from routes.chat_routes import router as chat_router


app = FastAPI(
    docs_url="/docs",
    redoc_url="/redoc"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    """Cria as tabelas do banco ao iniciar a aplicação."""
    Base.metadata.create_all(bind=engine)


app.include_router(health_router)
app.include_router(produto_router)
app.include_router(chat_router)