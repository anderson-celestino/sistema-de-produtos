import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  buscarProduto,
  criarProduto,
  atualizarProduto
} from '../services/produtoService'

import Produtos from './Produtos'

function ProdutoForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [produto, setProduto] = useState({
    nome: '',
    preco: '',
    quant_estoque: '',
    validade: '',
    codigo_barras: '',
    categoria: '',
    peso: ''
  })

  const [carregando, setCarregando] = useState(false)

  const editando = id !== undefined

  useEffect(() => {
    if (!editando) return

    async function carregarProduto() {
      try {
        setCarregando(true)

        const dados = await buscarProduto(id)

        setProduto({
          nome: dados.nome,
          preco: dados.preco,
          quant_estoque: dados.quant_estoque,
          validade: dados.validade,
          codigo_barras: dados.codigo_barras,
          categoria: dados.categoria,
          peso: dados.peso
        })
      } catch (erro) {
        alert(erro.message)
      } finally {
        setCarregando(false)
      }
    }

    carregarProduto()
  }, [id, editando])

  function atualizarCampo(evento) {
    const { name, value } = evento.target

    setProduto({
      ...produto,
      [name]: value
    })
  }

  async function salvarProduto(evento) {
    evento.preventDefault()

    const produtoParaEnviar = {
      ...produto,
      preco: Number(produto.preco),
      quant_estoque: Number(produto.quant_estoque),
      peso: Number(produto.peso)
    }

    try {
      if (editando) {
        await atualizarProduto(id, produtoParaEnviar)
      } else {
        await criarProduto(produtoParaEnviar)
      }

      navigate('/produtos')
    } catch (erro) {
      alert(erro.message)
    }
  }

  return (
    <>
      <Produtos />

      <div className="modal-overlay">

        <div className="modal-produto">

          <div className="modal-header">

            <div>
              <h2>{editando
                  ? 'Editar Produto'
                  : 'Novo Produto'}
              </h2>

              <p>
                {editando
                  ? 'Atualize os dados do produto.'
                  : 'Cadastre um novo produto no sistema.'}
              </p>
            </div>

            <button className="modal-fechar" onClick={() => navigate('/produtos')}>× </button>

          </div>

          {carregando ? (

            <div className="modal-carregando">
              Carregando produto...
            </div>

          ) : (

            <form
              className="form-produto"
              onSubmit={salvarProduto}>

              <div className="campo">
                <label>Nome do produto *</label>

                <input
                  type="text"
                  name="nome"
                  placeholder="Ex.: Café"
                  value={produto.nome}
                  onChange={atualizarCampo}
                  required/>
              </div>

              <div className="campo">
                <label>Preço *</label>

                <input
                  type="number"
                  name="preco"
                  placeholder="Ex.: 18,00"
                  step="0.01"
                  value={produto.preco}
                  onChange={atualizarCampo}
                  required/>
              </div>

              <div className="campo">
                <label>Quantidade em estoque *</label>

                <input
                  type="number"
                  name="quant_estoque"
                  placeholder="Ex.: 50"
                  value={produto.quant_estoque}
                  onChange={atualizarCampo}
                  required/>
              </div>

              <div className="campo">
                <label>Validade</label>

                <input
                  type="text"
                  name="validade"
                  placeholder="Ex.: 10/10/2026"
                  value={produto.validade}
                  onChange={atualizarCampo}/>
              </div>

              <div className="campo">
                <label>Código de barras</label>

                <input
                  type="text"
                  name="codigo_barras"
                  placeholder="Ex.: 1234567890"
                  value={produto.codigo_barras}
                  onChange={atualizarCampo}/>
              </div>

              <div className="campo">
                <label>Categoria *</label>

                <input
                  type="text"
                  name="categoria"
                  placeholder="Ex.: Alimentício"
                  value={produto.categoria}
                  onChange={atualizarCampo}
                  required/>
              </div>

              <div className="campo">
                <label>Peso (g)</label>

                <input
                  type="number"
                  name="peso"
                  placeholder="Ex.: 250"
                  step="0.01"
                  value={produto.peso}
                  onChange={atualizarCampo}/>
              </div>

              <div className="botoes-form">

                <button
                  type="button"
                  className="botao-cancelar"
                  onClick={() => navigate('/produtos')}>
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="botao-salvar">
                  {editando ? 'Atualizar' : 'Salvar'}
                </button>

              </div>

            </form>

          )}

        </div>

      </div>
    </>
  )
}

export default ProdutoForm