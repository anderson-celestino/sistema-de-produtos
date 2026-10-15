export const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

// O FastAPI devolve `detail` como texto (HTTPException) ou como lista
// (erros de validação 422). Aqui os dois formatos viram uma frase legível.
function formatarDetalhe(detalhe) {
  if (typeof detalhe === 'string') return detalhe

  if (Array.isArray(detalhe)) {
    return detalhe
      .map(item => {
        const campo = item.loc?.at(-1)
        return campo ? `${campo}: ${item.msg}` : item.msg
      })
      .join('; ')
  }

  return ''
}

export async function requisitar(caminho, opcoes, mensagemPadrao) {
  let resposta

  try {
    resposta = await fetch(`${API_URL}${caminho}`, opcoes)
  } catch {
    throw new Error('Não foi possível conectar ao servidor.')
  }

  if (!resposta.ok) {
    let detalhe = ''

    try {
      const corpo = await resposta.json()
      detalhe = formatarDetalhe(corpo.detail)
    } catch {
      // resposta sem corpo JSON: usa a mensagem padrão
    }

    throw new Error(detalhe || mensagemPadrao)
  }

  return resposta.json()
}
