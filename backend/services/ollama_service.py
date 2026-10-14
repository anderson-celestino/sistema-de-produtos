import requests

OLLAMA_URL = "http://localhost:11434/api/chat"
MODELO = "qwen3:1.7b"


def enviar_mensagem(
    mensagem: str,
    contexto: str | None = None
) -> str:

    mensagens = [
        {
            "role": "system",
            "content": (
                "Você é um assistente virtual de um sistema de gerenciamento "
                "de produtos e estoque. Responda sempre em português, de forma "
                "clara, objetiva e amigável. "
                "Quando a pergunta envolver produtos, preços, estoque, "
                "categorias, validade, peso ou códigos de barras, utilize "
                "somente os dados fornecidos pelo sistema. "
                "Não invente produtos ou informações que não estejam no contexto. "
                "Caso a informação não esteja disponível, informe ao usuário "
                "que não encontrou esse dado no sistema."
            )
        }
    ]

    if contexto:
        mensagens.append(
            {
                "role": "system",
                "content": (
                    "Os dados atuais dos produtos cadastrados no sistema são:\n\n"
                    f"{contexto}"
                )
            }
        )

    mensagens.append(
        {
            "role": "user",
            "content": mensagem
        }
    )

    payload = {
        "model": MODELO,
        "messages": mensagens,
        "stream": False,
        "think": False
    }

    try:
        resposta = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=120
        )

        resposta.raise_for_status()

        dados = resposta.json()

        return dados["message"]["content"]

    except requests.exceptions.ConnectionError:
        raise RuntimeError(
            "Não foi possível conectar ao Ollama."
        )

    except requests.exceptions.Timeout:
        raise RuntimeError(
            "O Ollama demorou muito para responder."
        )

    except requests.exceptions.RequestException as erro:
        raise RuntimeError(
            f"Erro ao consultar o Ollama: {erro}"
        )