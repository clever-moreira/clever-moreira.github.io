"""Pipeline demonstrativo de RPA resiliente. Sem dependências externas."""
from __future__ import annotations
import logging
import time
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from typing import Callable

logger = logging.getLogger(__name__)


class TransientError(Exception):
    """Falha de rede/sistema recuperável."""


@dataclass(frozen=True)
class Record:
    ticket_id: str
    amount: Decimal


def validate(raw: dict[str, str]) -> Record:
    ticket_id = raw.get("ticket_id", "").strip()
    if not ticket_id:
        raise ValueError("ticket_id obrigatório")
    try:
        amount = Decimal(raw.get("amount", ""))
    except InvalidOperation as exc:
        raise ValueError("amount inválido") from exc
    if not amount.is_finite() or amount <= 0:
        raise ValueError("amount deve ser positivo e finito")
    return Record(ticket_id=ticket_id, amount=amount)


def with_retry(
    action: Callable[[], str], *, attempts: int = 3,
    sleep: Callable[[float], None] = time.sleep,
) -> str:
    if attempts < 1:
        raise ValueError("attempts deve ser >= 1")
    for index in range(attempts):
        try:
            return action()
        except TransientError:
            if index == attempts - 1:
                raise
            sleep(0.1 * (2 ** index))
    raise AssertionError("unreachable")


class Processor:
    def __init__(self, action: Callable[[Record], str]) -> None:
        self.action = action
        self.processed: dict[str, str] = {}

    def run(self, raw: dict[str, str]) -> dict[str, str]:
        try:
            record = validate(raw)
            if record.ticket_id in self.processed:
                return {"ticket_id": record.ticket_id, "status": "duplicate",
                        "result": self.processed[record.ticket_id]}
            result = with_retry(lambda: self.action(record))
            self.processed[record.ticket_id] = result
            logger.info("record_completed ticket_id=%s", record.ticket_id)
            return {"ticket_id": record.ticket_id, "status": "processed", "result": result}
        except (ValueError, TransientError) as exc:
            logger.warning("record_failed error=%s", type(exc).__name__)
            return {"ticket_id": raw.get("ticket_id", ""), "status": "error",
                    "error": type(exc).__name__}


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    processor = Processor(lambda record: f"SIM-{record.ticket_id}")
    records = [
        {"ticket_id": "T100", "amount": "120.30"},
        {"ticket_id": "T101", "amount": "25.00"},
        {"ticket_id": "T100", "amount": "120.30"},
        {"ticket_id": "T102", "amount": "invalid"},
    ]
    for record in records:
        print(processor.run(record))


if __name__ == "__main__":
    main()
