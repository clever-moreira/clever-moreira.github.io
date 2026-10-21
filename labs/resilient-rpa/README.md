# Resilient RPA

Um pipeline de processamento costuma parecer simples enquanto todos os registros são válidos e os sistemas respondem na primeira tentativa. Este laboratório explora justamente os casos que tornam uma automação mais difícil de sustentar: validação, falhas transitórias e processamento repetido.

A implementação é inteiramente local, em Python, sem dependências de terceiros ou acesso a sistemas externos.

## Comportamento implementado

1. Um registro chega como dicionário com `ticket_id` e `amount`.
2. A função `validate()` exige identificador não vazio e converte o valor para `Decimal`, rejeitando valores inválidos, não finitos ou não positivos.
3. `Processor.run()` consulta os identificadores já processados para evitar executar novamente a ação.
4. `with_retry()` repete a ação apenas quando recebe `TransientError`, com até três tentativas e espera exponencial de 0,1 s e 0,2 s entre elas, por padrão.
5. O resultado é classificado como `processed`, `duplicate` ou `error`. A execução também registra eventos via `logging`.

A ação de exemplo devolve um identificador fictício `SIM-<ticket_id>`. Não existe interação com interface gráfica ou serviço remoto neste laboratório.

## Estrutura

| Arquivo | Função |
| --- | --- |
| `main.py` | Validação, política de retry, processador e cenário de exemplo |
| `tests/test_main.py` | Testes unitários |
| `index.html` | Simulação independente, executada no navegador |

## Execução

Requer Python 3.10 ou superior.

A partir da raiz do repositório:

```bash
cd labs/resilient-rpa
python main.py
python -m unittest discover -s tests -v
```

O cenário padrão processa quatro entradas: dois registros válidos com identificadores distintos, a repetição de um deles e um valor inválido. A segunda ocorrência do mesmo `ticket_id` é identificada como duplicada, sem nova execução da ação.

## Decisões de implementação

**Valores monetários:** o uso de `Decimal` evita depender da representação binária de ponto flutuante na validação.

**Retry seletivo:** problemas de entrada não são tratados como instabilidade transitória. Repetir uma solicitação inválida apenas prolongaria o erro.

**Idempotência:** a memória do processo mantém resultados por `ticket_id` durante a vida daquela instância. O exemplo não verifica se o conteúdo de uma segunda entrada com o mesmo identificador mudou.

**Observabilidade:** logs básicos permitem inspecionar conclusões e falhas. Ainda não há correlação entre execuções, métricas ou persistência de eventos.

## Limites e evolução para produção

Uma implementação corporativa precisaria persistir a chave de idempotência de forma transacional, definir uma estratégia para concorrência, classificar exceções de acordo com cada integração, limitar o volume de tentativas e estruturar a observabilidade. Também seria importante prever políticas para reprocessamento manual e tratamento de registros definitivamente rejeitados.

A [demonstração visual](index.html) é uma simulação no navegador, útil para ilustrar esses conceitos, mas não invoca o processador Python.
