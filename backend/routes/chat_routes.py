from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from db.produto_schema import ProdutoDB
from entity.chat_model import ChatRequest, ChatResponse
from services.ollama_service import enviar_mensagem
from services.produto_context_service import gerar_contexto_produtos


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("", response_model=ChatResponse)
def conversar(
    chat: ChatRequest,
    db: Session = Depends(get_db)
):
    try:
        produtos = db.query(ProdutoDB).all()

        contexto = gerar_contexto_produtos(produtos)

        resposta = enviar_mensagem(
            mensagem=chat.mensagem,
            contexto=contexto
        )

        return ChatResponse(
            resposta=resposta
        )

    except RuntimeError as erro:
        raise HTTPException(
            status_code=503,
            detail=str(erro)
        )