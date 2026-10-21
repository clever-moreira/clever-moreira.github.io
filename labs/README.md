# Laboratório de engenharia

Esta área reúne implementações pequenas e independentes que utilizo para demonstrar padrões aplicáveis a problemas recorrentes de automação, integração e análise de dados.

Em vez de reproduzir projetos corporativos, cada laboratório isola uma preocupação técnica e permite inspecionar a solução, executar o código e entender suas limitações.

## Projetos disponíveis

| Laboratório | Problema abordado | Ponto de atenção |
| --- | --- | --- |
| [Resilient RPA](resilient-rpa/) | Registros inválidos, falhas transitórias e reprocessamento | Idempotência em memória e retry somente para falhas classificadas como transitórias |
| [ERP Integration API](erp-integration-api/) | Padronização de contratos REST entre sistemas | Validação de entrada, respostas HTTP e chave de idempotência |
| [Operational Analytics](operational-analytics/) | Visibilidade sobre execuções automatizadas | Agregações SQL para volume, sucesso e duração |

Os exemplos em Python são executados localmente. Cada pasta contém instruções e pré-requisitos próprios.

## Demonstração no navegador

As páginas `index.html` dos três laboratórios permitem explorar cenários simulados sem instalar as dependências Python. Elas são interfaces demonstrativas e **não executam o backend Python, a API FastAPI ou as consultas SQLite**. Os dados apresentados nelas também são fictícios.

## Premissas

- Nenhum laboratório acessa ERPs, serviços de clientes ou ambientes internos.
- Identificadores, clientes, pedidos e indicadores são inventados para fins de estudo.
- As implementações privilegiam a clareza do padrão demonstrado, não a preparação imediata para produção.
- Pontos como persistência, autenticação, rastreamento distribuído, observabilidade e limites de execução dependem do contexto de implantação.

A documentação individual apresenta o escopo implementado e o que precisaria evoluir para um ambiente operacional.
