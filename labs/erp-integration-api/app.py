"""API de integração ERP inteiramente simulada, sem dados de clientes."""
from decimal import Decimal
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

app = FastAPI(title="ERP Integration Demo", version="1.0.0")

CUSTOMERS = {
    "C001": {"id": "C001", "name": "Empresa Exemplo A"},
    "C002": {"id": "C002", "name": "Empresa Exemplo B"},
}
ORDERS: dict[str, dict] = {}


class OrderIn(BaseModel):
    external_id: str = Field(min_length=3, max_length=60, pattern=r"^[A-Za-z0-9_-]+$")
    customer_id: str
    total: Decimal = Field(gt=0, max_digits=12, decimal_places=2)


@app.get("/health")
def health():
    return {"status": "ok", "provider": "mock-erp"}


@app.get("/customers/{customer_id}")
def get_customer(customer_id: str):
    customer = CUSTOMERS.get(customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="customer_not_found")
    return customer


@app.post("/orders", status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderIn):
    if payload.customer_id not in CUSTOMERS:
        raise HTTPException(status_code=404, detail="customer_not_found")
    data = payload.model_dump(mode="json")
    previous = ORDERS.get(payload.external_id)
    if previous is not None:
        if previous != data:
            raise HTTPException(status_code=409, detail="idempotency_key_conflict")
        return {"status": "already_exists", "order": previous}
    ORDERS[payload.external_id] = data
    return {"status": "created", "order": data}
