# Clever AI | Assistente do portfólio

O Clever AI é o assistente integrado ao meu portfólio. Sua função é facilitar a exploração da minha trajetória, das competências técnicas e dos laboratórios disponíveis, sem transformar a página em um chatbot de assuntos gerais.

A solução separa a interface estática, hospedada no GitHub Pages, do serviço de conversação executado em Cloudflare Workers com Workers AI. A configuração do Worker utiliza o binding `AI` e o modelo de linguagem selecionado no backend.

## Responsabilidades

O assistente recebe perguntas sobre as experiências e tecnologias apresentadas no portfólio, utiliza uma base pública de conhecimento e pode recomendar materiais relacionados ao assunto da conversa. O objetivo não é responder a qualquer pergunta, e sim oferecer uma navegação conversacional pelo conteúdo profissional.

A aplicação foi estruturada para:
- manter contexto de mensagens recentes;
- relacionar competências, experiências e projetos demonstrativos;
- conduzir respostas em português ou inglês conforme a interação;
- limitar recomendações repetidas durante a conversa;
- evitar informações internas, métricas não documentadas e afirmações que não estejam sustentadas pela base disponível.

Como em qualquer sistema com modelo generativo, esses comportamentos dependem do código de controle e do modelo utilizado. Não devem ser tratados como garantia de respostas sempre corretas.

## Componentes

| Arquivo | Responsabilidade |
| --- | --- |
| `src/index.js` | Endpoint HTTP, validação de entradas e chamada ao modelo |
| `src/knowledge.js` | Conteúdo profissional disponibilizado ao assistente |
| `src/dialogue.js` | Regras de condução de conversa e recomendações |
| `tests/` | Testes automatizados do serviço e das regras de diálogo |
| `wrangler.jsonc` | Configuração do Cloudflare Worker e binding de IA |
| `../ai-config.js` | URL pública consumida pela interface |
| `../ai-chat.js` | Renderização das mensagens e interação com o visitante |
| `../styles.css` | Estilos da interface do portfólio e do chat |

A URL do serviço fica configurada no frontend, mas chamadas ao provedor e políticas de acesso pertencem ao backend. Credenciais e segredos não devem ser colocados em arquivos JavaScript públicos.

## Executar verificações

O projeto utiliza Node.js e o Wrangler, declarado em `package.json`.

Na pasta `clever-ai`:

```bash
npm install
npm test
node --check src/index.js
node --check src/dialogue.js
node --check ../ai-chat.js
```

Os testes automatizados também fazem parte do fluxo de validação via GitHub Actions.

## Publicar o Worker

Com a conta Cloudflare autenticada e a configuração do ambiente revisada:

```bash
cd clever-ai
npx wrangler deploy
```

O serviço expõe um endpoint de verificação em `GET /health` e a interface de conversa em `POST /api/chat`. Após a publicação, `ai-config.js` deve apontar para o endpoint autorizado. A interface do portfólio não hospeda o modelo de linguagem.

## Segurança, privacidade e operação

O conteúdo em `src/knowledge.js` foi pensado para divulgação pública e deve ser revisado sempre que houver atualização da trajetória profissional. Dados de clientes, credenciais, documentos internos e detalhes de projetos sujeitos a confidencialidade não pertencem a essa base.

As validações de origem, tamanho de mensagem e papéis ajudam a controlar entradas, mas não substituem autenticação, rate limiting e proteção contra abuso. Antes de ampliar o tráfego, é importante verificar as regras de WAF e os limites de requisição efetivamente configurados na Cloudflare.

O frontend mantém o histórico durante a sessão de navegação e o encaminha com as mensagens subsequentes. A aplicação não implementa persistência própria em banco de dados para as conversas. As condições de retenção e observabilidade do provedor devem ser verificadas separadamente.

## Evoluções previstas

Os próximos pontos de atenção são aprimorar os testes de qualidade das respostas, fortalecer limites de consumo, observar falhas sem armazenar conteúdo desnecessário das conversas e tornar as recomendações de projetos mais consistentes.

O assistente é uma camada de apresentação do portfólio, não um canal oficial de atendimento nem uma fonte independente de comprovação de experiência.
