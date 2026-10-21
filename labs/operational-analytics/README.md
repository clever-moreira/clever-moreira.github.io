# Operational Analytics

Uma automação em execução não é necessariamente uma automação sob controle. Sem indicadores claros, falhas recorrentes e degradação de desempenho podem passar despercebidas.

Este laboratório utiliza SQL para responder a três perguntas básicas: quantas execuções ocorreram, qual proporção terminou com sucesso e quanto tempo o processamento levou, em média.

## Modelo de dados

O arquivo `schema.sql` cria a tabela `execution`, com as colunas:

| Campo | Finalidade |
| --- | --- |
| `id` | Identificador da execução |
| `process_name` | Nome do processo |
| `status` | `success`, `business_error` ou `system_error` |
| `started_at` | Data e horário de início, armazenados como texto |
| `duration_seconds` | Duração não negativa em segundos |

O próprio script carrega seis linhas fictícias referentes a dois processos: `Invoice Processing` e `Contract Review`.

## Indicadores calculados

A consulta `metrics.sql` agrupa por processo e produz:

- **Execuções:** `COUNT(*)`, considerando todos os registros.
- **Sucessos:** soma das linhas com `status = 'success'`.
- **Taxa de sucesso:** sucessos divididos pelo total de execuções, multiplicados por 100 e arredondados para uma casa decimal.
- **Duração média:** `AVG(duration_seconds)`, também arredondada para uma casa decimal.

Falhas de negócio e de sistema integram o denominador da taxa de sucesso. A média de duração considera todas as execuções, independentemente do status.

## Executar a consulta

Requer Python 3.10 ou superior. O módulo `sqlite3` já faz parte da biblioteca padrão.

```bash
cd labs/operational-analytics
python run.py
```

O script cria um banco SQLite em memória, executa `schema.sql`, consulta `metrics.sql` e imprime os indicadores no terminal. Nenhum banco local persistente é criado.

A estrutura é intencionalmente enxuta: a modelagem está em `schema.sql`, as regras dos indicadores em `metrics.sql` e a execução em `run.py`.

## Cuidados de modelagem

Em um painel corporativo, a definição dos indicadores deve ser negociada com as áreas responsáveis. Uma taxa de sucesso pode considerar tentativas ou solicitações únicas; uma mesma demanda reprocessada pode distorcer o volume se cada tentativa for contada como uma execução independente.

Também seria necessário definir fuso horário, janela de apuração, SLAs, tratamento de execução em andamento, categorização de falhas e armazenamento histórico. Esses pontos não são tratados pelo exemplo.

## Visualização para o portfólio

A [demonstração interativa](index.html) apresenta filtros, indicadores e gráficos com dados sintéticos próprios. Ela é independente do script SQLite, portanto os números exibidos no navegador não correspondem necessariamente às seis linhas de `schema.sql`.

Os indicadores deste projeto são ilustrativos e não representam métricas de clientes ou resultados profissionais.
