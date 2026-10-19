# Resilient RPA | processamento confiável

Exemplo **fictício** de processamento de registros com práticas empregadas em automações corporativas.

## Escopo
- Entrada CSV com identificadores e valores
- Validação e tratamento de exceções
- Retry exponencial em falhas transitórias
- Idempotência por identificador
- Registro estruturado de resultados

## Executar
Requer Python 3.10+ e apenas biblioteca padrão.

```bash
cd labs/resilient-rpa
python main.py
python -m unittest discover -s tests -v
```

Arquivos de demonstração são gerados/consumidos em memória. Não há acesso a dados reais.

## Notas de arquitetura
Em produção, persistir chave de idempotência em banco transacional, incluir correlação de execução e integrar observabilidade. O exemplo usa memória para manter a instalação simples.
