from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    mensagem: str = Field(
        min_length=1,
        description="Mensagem enviada pelo usuário"
    )


class ChatResponse(BaseModel):
    resposta: str
