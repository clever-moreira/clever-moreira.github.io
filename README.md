# Portfólio | Clever Cristian Moreira

Site de portfólio pessoal, responsivo e estático, criado para publicação gratuita no **GitHub Pages**.

## Conteúdo
- Apresentação e resumo profissional
- Especialidades: arquitetura de soluções, RPA, IA, BPMS, dados e integrações
- Estudos de caso **conceituais**, sem código ou dados de clientes
- Stack, formação, certificações e links de contato
- Layout responsivo, navegação móvel e metadados para compartilhamento

## Executar localmente
Abra `index.html` no navegador. Opcionalmente, inicie um servidor local:

```bash
python -m http.server 8000
```

Acesse http://localhost:8000.

## Publicar no GitHub Pages
1. Crie um repositório público chamado `clever-moreira.github.io` na conta `clever-moreira` (ou use qualquer outro nome para um site de projeto).
2. Coloque `index.html`, `styles.css`, `script.js`, `.nojekyll` e a pasta `assets/` na raiz do repositório, na branch `main`.
3. Em **Settings > Pages > Build and deployment**, selecione **Deploy from a branch**, `main` e `/ (root)`.
4. O endereço esperado para o repositório de usuário é **https://clever-moreira.github.io/**. Em outro repositório, será **https://clever-moreira.github.io/NOME-DO-REPOSITORIO/**.

## Personalização
- `index.html`: textos, links, tecnologias e projetos.
- `styles.css`: cores, tamanhos e disposição visual.
- `script.js`: menu móvel e ano no rodapé.
- A fotografia é carregada da foto **pública** de perfil do GitHub; você pode substituí-la por um arquivo próprio e alterar o `src`.
- As fontes são carregadas do Google Fonts. Sem acesso à internet, o site usa as fontes de fallback.

## Privacidade
Os três projetos listados são **representações conceituais** de tipos de trabalho, não documentação de sistemas corporativos reais. Confira nomes, tecnologias e certificações antes de publicar.

Desenvolvido em HTML, CSS e JavaScript, sem dependência de build.