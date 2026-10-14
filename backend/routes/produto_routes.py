from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from entity.produto_model import ProdutoCreate, ProdutoRead
from db.produto_schema import ProdutoDB


router = APIRouter(
    prefix="/produto",
    tags=["Produtos"]
)


@router.post("/criar", response_model=ProdutoRead)
def criar_produto(
    produto: ProdutoCreate,
    db: Session = Depends(get_db)
):
    """Persiste um novo produto no banco de dados."""

    produto_db = ProdutoDB(**produto.model_dump())

    db.add(produto_db)
    db.commit()
    db.refresh(produto_db)

    return produto_db


@router.get("/{produto_id}", response_model=ProdutoRead)
def buscar_produto(
    produto_id: int,
    db: Session = Depends(get_db)
):
    """Recupera um produto pelo ID."""

    produto = (
        db.query(ProdutoDB)
        .filter(ProdutoDB.id == produto_id)
        .first()
    )

    if produto is None:
        raise HTTPException(
            status_code=404,
            detail="Produto não encontrado"
        )

    return produto


@router.get("", response_model=list[ProdutoRead])
def listar_produtos(
    db: Session = Depends(get_db)
):
    """Lista todos os produtos armazenados."""

    return db.query(ProdutoDB).all()


@router.put("/{produto_id}", response_model=ProdutoRead)
def atualizar_produto(
    produto_id: int,
    produto: ProdutoCreate,
    db: Session = Depends(get_db)
):
    """Atualiza um produto existente."""

    produto_db = (
        db.query(ProdutoDB)
        .filter(ProdutoDB.id == produto_id)
        .first()
    )

    if produto_db is None:
        raise HTTPException(
            status_code=404,
            detail="Produto não encontrado"
        )

    for campo, valor in produto.model_dump().items():
        setattr(produto_db, campo, valor)

    db.commit()
    db.refresh(produto_db)

    return produto_db


@router.delete("/{produto_id}")
def deletar_produto(
    produto_id: int,
    db: Session = Depends(get_db)
):
    """Remove um produto do banco de dados."""

    produto = (
        db.query(ProdutoDB)
        .filter(ProdutoDB.id == produto_id)
        .first()
    )

    if produto is None:
        raise HTTPException(
            status_code=404,
            detail="Produto não encontrado"
        )

    db.delete(produto)
    db.commit()

    return {"detail": "Produto removido"}