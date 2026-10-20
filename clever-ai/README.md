# Clever AI — assistente profissional

Chat integrado ao currículo público, com **Cloudflare Workers AI** e conhecimento profissional curado. Não usa assinatura ChatGPT Plus.

## Estado
O site é publicado no GitHub Pages. O backend exige implantação separada na sua própria conta Cloudflare. Até configurar o endpoint, a UI exibe **"IA indisponível"**, sem simular respostas de LLM.

## Publicar o backend
1. Crie uma conta Cloudflare e instale Node.js.
2. Clone este repositório e execute `cd clever-ai`.
3. Execute `npx wrangler login` e depois `npx wrangler deploy`.
4. Copie o endereço HTTPS do Worker (por exemplo `https://clever-ai.<sua-conta>.workers.dev`).
5. No arquivo `ai-config.js` da raiz do site, substitua o campo `apiUrl` pelo endereço do Worker **acrescido de /api/chat**, por exemplo `https://clever-ai.exemplo.workers.dev/api/chat`. Faça commit e aguarde o GitHub Pages.

O binding `AI` é configurado em `wrangler.jsonc`; nenhuma chave é enviada ao navegador. Verifique os limites e preços do Workers AI antes de publicar em produção.

## Proteção
- CORS restrito à origem do GitHub Pages
- Limite de tamanho, histórico curto e comprimento de resposta
- Validação dos papéis das mensagens
- Sanitização básica de instruções que venham do usuário
- Limite aproximado por IP/memória no runtime, **não distribuído**: utilize Cloudflare WAF/rate limiting e Turnstile em um lançamento público com tráfego real
- Evite incluir segredos, clientes, códigos de produção ou dados pessoais no arquivo `knowledge.js`

O modelo recebe contexto fixo do currículo e deve reconhecer o que não sabe. Conteúdo gerado por IA pode apresentar erros.

## Testes
`node --test tests/*.test.mjs`

## Estrutura
- `src/index.js`: API /api/chat e /health
- `src/knowledge.js`: informações públicas aprovadas
- `wrangler.jsonc`: configuração do Worker e binding do modelo
- `../ai-config.js`: URL do backend para o frontend
- `../ai-chat.js`: interface acessível do chat
