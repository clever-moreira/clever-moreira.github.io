# ERP Integration API

Este laboratório apresenta uma API de integração para um ERP fictício. O objetivo é separar o contrato consumido por um sistema externo das particularidades de um sistema de gestão, com atenção à validação de entrada e ao comportamento das operações repetidas.

A aplicação foi desenvolvida com FastAPI e Pydantic. Não há conexão com SAP, Senior, Oracle, TOTVS ou qualquer ERP real.

## Contrato HTTP

| Método | Rota | Comportamento |
| --- | --- | --- |
| `GET` | `/health` | Retorna o estado do serviço simulado |
| `GET` | `/customers/{customer_id}` | Consulta um cliente fictício; responde `404` quando não existe |
| `POST` | `/orders` | Valida e registra um pedido em memória |

O serviço disponibiliza os clientes fictícios `C001` e `C002`.

### Exemplo de pedido

```json
{
  "external_id": "REQ-100",
  "customer_id": "C001",
  "total": 199.90
}
```

O campo `external_id` aceita entre 3 e 60 caracteres, restritos a letras, números, `_` e `-`. O total deve ser positivo, com no máximo 12 dígitos e duas casas decimais. O cliente informado precisa existir na base simulada.

### Respostas relevantes

- `201 Created`: pedido aceito e incluído em memória.
- `404 Not Found`: cliente inexistente.
- `409 Conflict`: identificador externo já utilizado com conteúdo diferente.
- `422 Unprocessable Entity`: falha de validação do corpo da requisição.

Quando o mesmo `external_id` é reenviado com conteúdo idêntico, a aplicação devolve `already_exists`, sem duplicar o pedido. **Na implementação atual, essa resposta segue o status `201` definido na rota**. Em um contrato destinado à produção, eu definiria explicitamente o status esperado para repetições idempotentes.

## Executar localmente

Requer Python compatível com as dependências declaradas em `requirements.txt`.

```bash
cd labs/erp-integration-api
python -m venv .venv
```

Ative o ambiente virtual conforme seu sistema operacional e execute:

```bash
pip install -r requirements.txt
uvicorn app:app --reload
```

Com o serviço iniciado:

- Documentação OpenAPI: http://localhost:8000/docs
- Health check: http://localhost:8000/health
- Exemplo de cliente: http://localhost:8000/customers/C001

O Swagger UI disponibilizado em `/docs` permite testar as operações sem criar um cliente HTTP separado.

## Organização e decisões técnicas

O arquivo `app.py` concentra os modelos e os endpoints. `OrderIn`, definido com Pydantic, valida os pedidos antes da execução da regra de inclusão.

O dicionário `ORDERS` armazena os pedidos por identificador externo durante a vida do processo. Essa escolha mantém a demonstração simples, mas não oferece durabilidade, isolamento de concorrência ou sincronização entre instâncias.

Uma camada de integração em produção normalmente exigiria persistência, autenticação, autorização, controle de volume, gerenciamento de segredos, contratos versionados, logs estruturados e rastreamento das chamadas entre sistemas.

## Demonstração web

A página [index.html](index.html) oferece uma simulação interativa dos endpoints para apresentação no portfólio. Ela não encaminha requisições ao FastAPI nem consulta dados externos. Para testar o contrato efetivamente implementado, execute a aplicação Python.
