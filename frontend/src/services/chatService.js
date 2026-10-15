import { requisitar } from './api'

// Contrato do backend: POST /chat  { mensagem }  ->  { resposta }
export async function enviarMensagem(mensagem) {
  const dados = await requisitar(
    '/chat',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem })
    },
    'Erro ao consultar o assistente'
  )

  // Alguns modelos (ex.: qwen3) podem devolver o raciocínio entre <think>
  return dados.resposta
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .trim()
}
