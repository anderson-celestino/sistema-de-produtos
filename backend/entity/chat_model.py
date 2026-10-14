from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    mensagem: str = Field(
        min_length=1,
        description="Mensagem enviada pelo usuário"
    )


class ChatResponse(BaseModel):
    resposta: str