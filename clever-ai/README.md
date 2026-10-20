# Clever AI — assistente profissional

Assistente virtual integrado ao currículo público em **GitHub Pages**, usando **Cloudflare Workers + Workers AI (Llama 3.1 8B FP8)**. O modelo não depende de uma assinatura ChatGPT Plus.

## O que o assistente faz

- Responde naturalmente em português (ou inglês, conforme o visitante) com base em uma **base pública curada por Clever**.
- Mantém o contexto de até 12 mensagens recentes e entende perguntas de continuação.
- Distingue plataformas de RPA, bibliotecas de automação e linguagens como Python.
- Relaciona competências a experiências generalizadas, sem identificar clientes.
- Sugere próximas perguntas relevantes e mostra links para laboratórios públicos quando o assunto corresponde ao projeto.
- Evita repetir o mesmo projeto durante uma conversa e não inventa métricas de resultados.

O assistente **não é o próprio Clever**: ele conversa como um guia que conhece as experiências compartilhadas para o portfólio, sem alegar convívio pessoal ou acesso a informações privadas.

## Estrutura

- `src/index.js`: Cloudflare Worker, API e prompt de sistema.
- `src/knowledge.js`: base profissional pública, narrativas anônimas, tecnologias e hobbies.
- `src/dialogue.js`: roteamento contextual, recomendações de projetos e perguntas sugeridas.
- `tests/*.test.mjs`: testes de validação e continuidade.
- `wrangler.jsonc`: binding de Workers AI.
- `../ai-config.js`: endereço público do endpoint.
- `../ai-chat.js`: frontend do chat e experiência de diálogo.
- `../styles.css`: estilos do portfólio e do chat.

## Publicação

A Cloudflare já está configurada com o Worker `clever-ai`, integrado ao GitHub. Mantenha o comando de implantação:

```bash
cd clever-ai && npx wrangler deploy
```

O serviço disponibiliza `GET /health` e `POST /api/chat`, este último acessado pelo frontend no domínio do portfólio.

O binding `AI` é declarado em `wrangler.jsonc`; não use credenciais de API no JavaScript público.

## Testes locais

Com Node.js 22+ na pasta `clever-ai`:

```bash
node --test tests/*.test.mjs
node --check src/index.js
node --check src/dialogue.js
node --check ../ai-chat.js
```

Há também um workflow de GitHub Actions configurado para executar as verificações após alterações.

## Privacidade e limites

- As experiências profissionais são **anônimas e qualitativas**; projetos públicos são laboratórios demonstrativos com dados fictícios.
- Não envie ao modelo dados sensíveis ou informações de clientes. Revise `src/knowledge.js` antes de divulgar.
- O backend valida origens no navegador, tamanho das entradas e papéis das mensagens. **Isso não substitui autenticação nem proteção contra abuso.**
- **Ainda não há limitação de requisições por IP distribuída, Turnstile ou WAF configurados pelo código.** Configure controles de rate limit/WAF no painel da Cloudflare antes de promover o serviço para tráfego público significativo.
- A interface não persiste conversas em banco; o histórico fica na memória da aba e é enviado ao modelo em cada turno. As políticas de retenção e telemetria do provedor devem ser revisadas.
- Modelos de linguagem podem produzir erros. Respostas profissionais devem ser tratadas como apresentação assistida, não comprovação documental.

## Próximos avanços possíveis

Memória mais longa com resumo de sessão, recuperação seletiva de conhecimento, métricas de uso agregadas sem conteúdo de conversa, testes automatizados de qualidade de respostas e defesa contra abuso.
