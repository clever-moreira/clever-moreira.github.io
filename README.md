# Clever Moreira | Portfólio técnico

Portfólio profissional de Clever Cristian Moreira, com foco em arquitetura de soluções, automação de processos, integrações corporativas, dados e inteligência artificial.

**Site:** https://clever-moreira.github.io/

O site reúne minha trajetória, as tecnologias com as quais trabalho e pequenos laboratórios que apresentam decisões de engenharia de forma prática. A intenção é mostrar não apenas as ferramentas utilizadas, mas também como organizo o desenvolvimento, considero cenários de falha e documento soluções.

## Organização do repositório

| Diretório ou arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura e conteúdo do portfólio |
| `styles.css` | Identidade visual, responsividade e estilos do chat |
| `script.js` | Comportamentos da interface |
| `ai-chat.js` e `ai-config.js` | Interface do assistente e endereço do serviço |
| `clever-ai/` | Serviço do assistente, base de conhecimento e testes |
| `labs/` | Projetos de demonstração independentes |
| `assets/` | Recursos visuais do site |
| `.github/workflows/` | Verificações automatizadas dos projetos |

O frontend do portfólio é estático. O assistente utiliza um serviço separado em Cloudflare Workers. Os laboratórios em Python podem ser executados localmente; as páginas demonstrativas em HTML funcionam no navegador e não substituem seus respectivos backends.

## Laboratórios

| Projeto | Tema central | Implementação |
| --- | --- | --- |
| [Resilient RPA](labs/resilient-rpa/) | Validação, tentativas de recuperação e idempotência | Python e testes unitários |
| [ERP Integration API](labs/erp-integration-api/) | Contratos REST, validação e tratamento de conflitos | FastAPI e Pydantic |
| [Operational Analytics](labs/operational-analytics/) | Indicadores operacionais calculados em SQL | Python e SQLite |

Cada projeto possui documentação de execução, comportamento esperado, decisões técnicas e limites do exemplo. Os dados e cenários são fictícios.

## Executar o portfólio localmente

É possível abrir `index.html` diretamente, mas um servidor HTTP local oferece um ambiente mais próximo da publicação:

```bash
python -m http.server 8000
```

Acesse http://localhost:8000/ na raiz do repositório.

O assistente depende de um endpoint externo configurado em `ai-config.js`; a abertura local da página não inicia o backend. Para trabalhar no serviço, consulte [clever-ai/README.md](clever-ai/README.md).

## Publicação

O site utiliza GitHub Pages a partir da raiz da branch `main`. A configuração de publicação fica em **Settings > Pages > Build and deployment**, com a origem **Deploy from a branch**, branch `main` e diretório `/(root)`.

Como não há etapa de compilação para a página estática, alterações nos arquivos servidos podem afetar o site publicado. Antes de modificar navegação, estilos ou scripts, valide a página inicial, os links internos, a experiência móvel e os controles do chat.

## Critérios de documentação e privacidade

Os materiais deste repositório apresentam conceitos e implementações didáticas. Não são cópias de sistemas de clientes e não utilizam credenciais, bases ou métricas corporativas. Os resultados exibidos nos laboratórios não devem ser apresentados como indicadores de projetos profissionais.

Código JavaScript entregue ao navegador é público por natureza; por isso, credenciais, regras proprietárias e integrações privadas não devem ser incluídas no frontend. O backend do assistente possui documentação específica sobre exposição de dados e controles de uso.

## Contato

- [LinkedIn](https://www.linkedin.com/in/clever-moreira/)
- [GitHub](https://github.com/clever-moreira/)
