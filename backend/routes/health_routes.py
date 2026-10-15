from fastapi import APIRouter


router = APIRouter(
    tags=["Health"]
)


@router.get("/health")
def health():
    """Retorna uma resposta simples de verificação de saúde."""

    return {"status": "ok"}
