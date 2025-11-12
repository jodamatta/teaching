from dataclasses import dataclass
from src.core.interfaces.product_repository import ProductRepository
from src.core.entities.product import Product

@dataclass(frozen=True)
class UpdateProductPriceCommand:
    product_id: int
    valor: float

class UpdateProductPriceUseCase:
    def __init__(self, repo: ProductRepository):
        self._repo = repo

    def execute(self, product_id: int, valor: float) -> Product:
        if product_id <= 0:
            raise ValueError("product_id deve ser positivo")
        if valor is None or valor < 0:
            raise ValueError("valor deve ser >= 0")

        updated = self._repo.update_price(product_id, valor)
        if updated is None:
            from src.core.exceptions import ProductNotFound
            raise ProductNotFound("Produto não encontrado")
        return updated
