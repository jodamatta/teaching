from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional

from src.core.entities.comment import Comment


@dataclass
class Product:
    """Domain representation of a product."""

    nome: str
    quantidade: Optional[int]
    valor: float
    data_insercao: datetime = field(default_factory=datetime.utcnow)
    id: Optional[int] = None
    comentarios: List[Comment] = field(default_factory=list)

    def add_comment(self, comment: Comment) -> None:
        """Attach a comment to this product."""
        self.comentarios.append(comment)

    def set_price(self, new_price: float) -> None:
        if new_price is None:
            raise ValueError("price cannot be None")
        if new_price < 0:
            raise ValueError("price cannot be negative")
        self.price = new_price.quantize(float("0.01"))
