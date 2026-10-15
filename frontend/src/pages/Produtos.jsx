import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdChat } from "react-icons/md";

import {
  listarProdutos,
  excluirProduto
} from '../services/produtoService'

function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    try {
      setCarregando(true)

      const dados = await listarProdutos()

      setProdutos(dados)
    } catch (erro) {
      setErro(erro.message)
    } finally {
      setCarregando(false)
    }
  }

  async function handleExcluir(id) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este produto?'
    )

    if (!confirmar) return

    try {
      await excluirProduto(id)

      setProdutos(
        produtos.filter(produto => produto.id !== id)
      )
    } catch (erro) {
      alert(erro.message)
    }
  }

  const produtosFiltrados = produtos.filter(produto => {
    const termo = busca.toLowerCase()

    return (
      produto.nome?.toLowerCase().includes(termo) ||
      produto.codigo_barras?.toLowerCase().includes(termo) ||
      produto.categoria?.toLowerCase().includes(termo)
    )
  })

  if (carregando) {
    return (
      <div className="estado">
        <p>Carregando produtos...</p>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="estado">
        <p>{erro}</p>
      </div>
    )
  }

  return (
    <div className="sistema">

      <main className="conteudo">

        <header className="topo">

          <div>
            <h1>
              Sistema de Produtos
            </h1>

            <p> Gerencie os produtos cadastrados no sistema.</p>
          </div>

          <Link
            to="/chat"
            className="botao-chat"
            title="Conversar com o assistente"
            aria-label="Abrir o chat com o assistente"
          >
            <MdChat size={24} />
          </Link>

        </header>

        <div className="acoes-topo">

          <Link
            to="/produtos/criar"
            className="botao-novo">
            <span>+</span>
            Novo Produto
          </Link>

        </div>

        <section className="card-tabela">

          <div className="tabela-header">
            <span>
              Total: {produtosFiltrados.length} produtos
            </span>
          </div>

          <div className="tabela-container">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Validade</th>
                  <th>Código de Barras</th>
                  <th>Categoria</th>
                  <th>Peso</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>

                {produtosFiltrados.map(produto => (

                  <tr key={produto.id}>

                    <td>{produto.id}</td>

                    <td>
                      <div className="produto-nome">

                        <span>{produto.nome}</span>
                      </div>
                    </td>

                    <td>
                      R$ {Number(produto.preco).toFixed(2)}
                    </td>

                    <td>
                      {produto.quant_estoque}
                    </td>

                    <td>
                      {produto.validade}
                    </td>

                    <td>
                      {produto.codigo_barras}
                    </td>

                    <td>
                      <span className="categoria">
                        {produto.categoria}
                      </span>
                    </td>

                    <td>
                      {produto.peso}
                    </td>

                    <td>
                      <div className="acoes">

                        <Link
                          to={`/produtos/${produto.id}`}
                          className="botao-editar"
                        >
                          <MdModeEdit size={20}/>
                        </Link>

                        <button
                          className="botao-excluir"
                          onClick={() =>
                            handleExcluir(produto.id)
                          }
                        >
                         <MdDelete size={20}/>
                        </button>

                      </div>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {produtosFiltrados.length === 0 && (
            <div className="sem-produtos">
              Nenhum produto encontrado.
            </div>
          )}

        </section>

      </main>

    </div>
  )
}

export default Produtos