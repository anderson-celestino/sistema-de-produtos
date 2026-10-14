from db.produto_schema import ProdutoDB


def gerar_contexto_produtos(produtos: list[ProdutoDB]) -> str:
    if not produtos:
        return "Não existem produtos cadastrados no sistema."

    linhas = []

    for produto in produtos:
        linhas.append(
            f"""
ID: {produto.id}
Nome: {produto.nome}
Preço: R$ {produto.preco:.2f}
Quantidade em estoque: {produto.quant_estoque}
Validade: {produto.validade}
Código de barras: {produto.codigo_barras}
Categoria: {produto.categoria}
Peso: {produto.peso}
""".strip()
        )

    return "\n\n---\n\n".join(linhas)