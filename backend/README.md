# API de Produtos

Este projeto é uma API REST desenvolvida em Python com FastAPI para gerenciar produtos em um banco de dados SQLite.

A estrutura do projeto inclui:

- `main.py`: aplicação principal (CORS, criação do banco e registro das rotas)
- `routes`: endpoints da API (`produto`, `chat` e `health`)
- `services`: integração com o Ollama (LLM) e geração de contexto dos produtos
- `db`: configuração do banco e modelos de tabela
- `entity`: modelos de dados usados pela aplicação
- `tests`: testes automatizados
- `requirements.txt`: dependências do projeto

## Requisitos

Antes de iniciar, verifique se você possui:

- Python 3.10 ou superior
- pip instalado
- Git (opcional, para clonar o repositório)
- Editor ou IDE de sua preferência (VS Code, PyCharm, etc.)

## Clonando o projeto

Para clonar o repositório correto, execute:

```bash
git clone https://github.com/Testes-de-Software-Itapaje/teste_software_2026_2.git
cd teste_software_2026_2/backend
```

Se o código já estiver baixado localmente, basta entrar na pasta do projeto:

```bash
cd caminho/para/teste_software_2026_2/backend
```

## Instalando as dependências

O arquivo `requirements.txt` contém todas as bibliotecas necessárias para rodar o projeto. Para instalá-las, use:

```bash
pip install -r requirements.txt
```

Isso instalará dependências como:

- fastapi
- uvicorn
- sqlalchemy
- pydantic
- pytest
- requests
- starlette
- typing-extensions

Se a instalação falhar por algum motivo, você pode forçar a reinstalação:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## Como rodar a aplicação

No diretório raiz do projeto, execute:

```bash
uvicorn main:app --reload
```

### O que acontece?

- O servidor FastAPI será inicializado
- A aplicação estará disponível localmente
- O banco SQLite será criado automaticamente ao iniciar o app

### Endereços locais

Após iniciar a aplicação, acesse:

- API: http://127.0.0.1:8000
- Swagger UI: http://127.0.0.1:8000/docs
- Redoc: http://127.0.0.1:8000/redoc

## Verificando se a API está funcionando

Você pode testar o endpoint de saúde:

```bash
curl http://127.0.0.1:8000/health
```

Resposta esperada:

```json
{"status": "ok"}
```

## Endpoints da API

### 1) Verificar saúde

- Método: `GET`
- Rota: `/health`

Exemplo:

```bash
curl http://127.0.0.1:8000/health
```

### 2) Criar produto

- Método: `POST`
- Rota: `/produto/criar`
- Corpo esperado:

```json
{
  "nome": "Notebook",
  "preco": 4999.99,
  "quant_estoque": 10,
  "validade": "31/12/2026",
  "codigo_barras": "7891234567890",
  "categoria": "Eletrônicos",
  "peso": 2.5
}
```

Exemplo com `curl`:

```bash
curl -X POST "http://127.0.0.1:8000/produto/criar" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Notebook",
    "preco": 4999.99,
    "quant_estoque": 10,
    "validade": "31/12/2026",
    "codigo_barras": "7891234567890",
    "categoria": "Eletrônicos",
    "peso": 2.5
  }'
```

### 3) Buscar produto por ID

- Método: `GET`
- Rota: `/produto/{produto_id}`

Exemplo:

```bash
curl http://127.0.0.1:8000/produto/1
```

### 4) Listar todos os produtos

- Método: `GET`
- Rota: `/produto`

Exemplo:

```bash
curl http://127.0.0.1:8000/produto
```

### 5) Atualizar produto

- Método: `PUT`
- Rota: `/produto/{produto_id}`
- Corpo esperado:

```json
{
  "nome": "Notebook Atualizado",
  "preco": 4299.90,
  "quant_estoque": 8,
  "validade": "31/12/2026",
  "codigo_barras": "7891234567890",
  "categoria": "Eletrônicos",
  "peso": 2.5
}
```

Exemplo:

```bash
curl -X PUT "http://127.0.0.1:8000/produto/1" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Notebook Atualizado",
    "preco": 4299.90,
    "quant_estoque": 8,
    "validade": "31/12/2026",
    "codigo_barras": "7891234567890",
    "categoria": "Eletrônicos",
    "peso": 2.5
  }'
```

### 6) Deletar produto

- Método: `DELETE`
- Rota: `/produto/{produto_id}`

Exemplo:

```bash
curl -X DELETE http://127.0.0.1:8000/produto/1
```

### 7) Conversar com o assistente (LLM)

- Método: `POST`
- Rota: `/chat`
- Corpo esperado:

```json
{
  "mensagem": "Quais produtos têm estoque baixo?"
}
```

- Resposta:

```json
{
  "resposta": "Texto gerado pelo assistente..."
}
```

O assistente usa o [Ollama](https://ollama.com) com os produtos cadastrados como contexto. Antes de usar:

```bash
ollama pull qwen3:1.7b
ollama serve
```

Se o Ollama estiver fora do ar, a rota responde `503` com a mensagem de erro em `detail`.
Para trocar a URL ou o modelo, use as variáveis de ambiente `OLLAMA_URL` (padrão `http://localhost:11434/api/chat`) e `OLLAMA_MODELO` (padrão `qwen3:1.7b`).

## Documentação interativa

Depois de iniciar a aplicação, acesse a documentação Swagger em:

```text
http://127.0.0.1:8000/docs
```

Nela você pode testar todos os endpoints diretamente no navegador sem precisar usar o terminal.

## Executando os testes

Para rodar a suíte de testes automatizados:

```bash
pytest
```

Se quiser rodar apenas um arquivo de teste específico:

```bash
pytest tests/test_produto.py
```

Se quiser ver detalhes da execução:

```bash
pytest -v
```

## Estrutura do banco de dados

O projeto usa SQLite e o banco é gerado automaticamente ao iniciar a aplicação. O arquivo local usado é:

```text
produtos.db
```

## Observações importantes

- O banco é criado automaticamente na inicialização da API.
- O ambiente virtual é opcional, mas altamente recomendado.
- A API usa FastAPI, então erros e validações são exibidos automaticamente pela documentação interativa.
- Caso o servidor não suba, verifique se todas as dependências foram instaladas corretamente com `pip install -r requirements.txt`.

## Dicas de troubleshooting

### O comando `uvicorn` não é encontrado

Certifique-se de que o ambiente virtual foi ativado e que as dependências foram instaladas:

```bash
pip install -r requirements.txt
```

### O módulo `fastapi` não existe

Isso geralmente significa que a instalação não foi concluída. Execute novamente:

```bash
pip install -r requirements.txt
```

### O banco de dados não foi criado

Verifique se a aplicação foi iniciada com:

```bash
uvicorn main:app --reload
```

A criação do banco ocorre automaticamente na inicialização do app.

## Resumo rápido

Se você quiser executar tudo em um único fluxo, use:

```bash
python -m venv .venv
# Windows: .\.venv\Scripts\Activate.ps1
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Depois disso, abra:

```text
http://127.0.0.1:8000/docs
```

para testar a API.
