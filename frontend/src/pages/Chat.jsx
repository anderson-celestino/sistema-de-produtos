import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MdArrowBack,
  MdSend,
  MdSmartToy,
  MdDeleteSweep
} from 'react-icons/md'

import { enviarMensagem } from '../services/chatService'

const SUGESTOES = [
  'Quais produtos estão com estoque baixo?',
  'Qual é o produto mais caro?',
  'Liste as categorias cadastradas.',
  'Algum produto está perto de vencer?'
]

// Converte **negrito** (comum nas respostas do modelo) sem usar HTML cru.
function formatarTexto(texto) {
  return texto.split(/\*\*(.+?)\*\*/g).map((parte, indice) =>
    indice % 2 === 1
      ? <strong key={indice}>{parte}</strong>
      : parte
  )
}

function Chat() {
  const [mensagens, setMensagens] = useState([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)

  const proximoId = useRef(1)
  const listaRef = useRef(null)
  const campoRef = useRef(null)

  useEffect(() => {
    const lista = listaRef.current

    if (lista) {
      lista.scrollTo({ top: lista.scrollHeight, behavior: 'smooth' })
    }
  }, [mensagens, enviando])

  function adicionarMensagem(autor, conteudo, erro = false) {
    const id = proximoId.current++

    setMensagens(atuais => [...atuais, { id, autor, conteudo, erro }])
  }

  async function enviar(conteudo) {
    const pergunta = conteudo.trim()

    if (!pergunta || enviando) return

    adicionarMensagem('usuario', pergunta)
    setTexto('')
    setEnviando(true)

    if (campoRef.current) {
      campoRef.current.style.height = 'auto'
    }

    try {
      const resposta = await enviarMensagem(pergunta)

      adicionarMensagem('assistente', resposta || 'Sem resposta do modelo.')
    } catch (erro) {
      adicionarMensagem('assistente', erro.message, true)
    } finally {
      setEnviando(false)
      campoRef.current?.focus()
    }
  }

  function handleSubmit(evento) {
    evento.preventDefault()
    enviar(texto)
  }

  function handleTeclado(evento) {
    if (
      evento.key === 'Enter' &&
      !evento.shiftKey &&
      !evento.nativeEvent.isComposing
    ) {
      evento.preventDefault()
      enviar(texto)
    }
  }

  function handleChange(evento) {
    const campo = evento.target

    setTexto(campo.value)

    campo.style.height = 'auto'
    campo.style.height = `${Math.min(campo.scrollHeight, 120)}px`
  }

  return (
    <div className="sistema">

      <main className="conteudo">

        <header className="topo">

          <div>
            <h1>
              Assistente Virtual
            </h1>

            <p>
              Pergunte sobre produtos, preços, estoque, validade e categorias.
            </p>
          </div>

          <Link to="/produtos" className="botao-voltar">
            <MdArrowBack size={18} />
            Produtos
          </Link>

        </header>

        <section className="card-chat">

          <div className="chat-header">

            <div className="chat-titulo">
              <span className="chat-avatar">
                <MdSmartToy size={20} />
              </span>

              <div>
                <strong>Assistente de estoque</strong>
                <span>Responde com base nos produtos cadastrados</span>
              </div>
            </div>

            <button
              type="button"
              className="chat-limpar"
              onClick={() => setMensagens([])}
              disabled={mensagens.length === 0 || enviando}
              title="Limpar conversa"
            >
              <MdDeleteSweep size={18} />
              Limpar
            </button>

          </div>

          <div className="chat-mensagens" ref={listaRef}>

            {mensagens.length === 0 && (
              <div className="chat-vazio">

                <span className="chat-avatar chat-avatar-grande">
                  <MdSmartToy size={30} />
                </span>

                <h2>Como posso ajudar?</h2>

                <p>
                  Faça uma pergunta sobre os produtos do sistema ou
                  escolha uma sugestão.
                </p>

                <div className="chat-sugestoes">
                  {SUGESTOES.map(sugestao => (
                    <button
                      key={sugestao}
                      type="button"
                      className="chat-sugestao"
                      onClick={() => enviar(sugestao)}
                      disabled={enviando}
                    >
                      {sugestao}
                    </button>
                  ))}
                </div>

              </div>
            )}

            {mensagens.map(mensagem => (
              <div
                key={mensagem.id}
                className={`chat-linha ${mensagem.autor}`}
              >
                {mensagem.autor === 'assistente' && (
                  <span className="chat-avatar">
                    <MdSmartToy size={18} />
                  </span>
                )}

                <div
                  className={
                    `chat-balao ${mensagem.autor}` +
                    (mensagem.erro ? ' erro' : '')
                  }
                >
                  {formatarTexto(mensagem.conteudo)}
                </div>
              </div>
            ))}

            {enviando && (
              <div className="chat-linha assistente">
                <span className="chat-avatar">
                  <MdSmartToy size={18} />
                </span>

                <div className="chat-balao assistente chat-digitando">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

          </div>

          <form className="chat-form" onSubmit={handleSubmit}>

            <textarea
              ref={campoRef}
              rows={1}
              placeholder="Digite sua pergunta..."
              value={texto}
              onChange={handleChange}
              onKeyDown={handleTeclado}
              aria-label="Mensagem para o assistente"
              autoFocus
            />

            <button
              type="submit"
              className="chat-enviar"
              disabled={enviando || texto.trim() === ''}
              aria-label="Enviar mensagem"
              title="Enviar"
            >
              <MdSend size={20} />
            </button>

          </form>

        </section>

      </main>

    </div>
  )
}

export default Chat
