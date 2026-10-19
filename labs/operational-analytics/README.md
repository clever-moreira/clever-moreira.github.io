# Operational Analytics | métricas SQL

Mini laboratório de BI com dados **totalmente sintéticos**. Demonstra indicadores de execução, taxa de sucesso e tempo médio de processamento.

## Executar
Requer Python 3.10+; SQLite é parte da biblioteca padrão.

```bash
cd labs/operational-analytics
python run.py
```

A execução cria uma base SQLite em memória, carrega registros de exemplo e retorna métricas por processo.

## Indicadores
- quantidade de execuções por processo
- taxa de sucesso em percentual
- duração média em segundos

No cenário real, dashboards e modelos devem considerar tratamento de fuso horário, SLA, tentativas, custos e dimensão de histórico. Não use os números sintéticos como resultados profissionais.
