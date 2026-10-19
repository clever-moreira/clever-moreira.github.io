# ERP Integration API | contrato REST demonstrativo

API **fictícia** que simula uma camada anticorrupção entre um portal e um ERP. Não existe integração real com SAP, Senior, Oracle ou TOTVS.

## Funcionalidades
- `GET /health`: health check
- `GET /customers/{customer_id}`: consulta por ID fictício
- `POST /orders`: validação e inclusão idempotente de pedido fictício
- Respostas HTTP explícitas para dados inexistentes e conflito

## Rodar localmente
```bash
cd labs/erp-integration-api
python -m venv .venv
# Ative o ambiente virtual
pip install -r requirements.txt
uvicorn app:app --reload
```
Acesse `http://localhost:8000/docs`.

Exemplo de corpo para `POST /orders`:
```json
{"external_id":"REQ-100","customer_id":"C001","total":199.90}
```

## Decisões técnicas
Validação com Pydantic, IDs externos como chaves de idempotência e respostas padronizadas. Armazenamento é somente em memória; uma versão real precisaria de persistência transacional, autenticação, limitação de requisições, tracing e segredo gerenciado.
