/**
 * Roteamento leve de conversa e próximos passos.
 * A IA escreve a resposta; este módulo escolhe contexto e referências verificadas.
 */
export const PROJECTS = Object.freeze({
  rpa: { id:"rpa", title:"Resilient RPA", url:"https://github.com/clever-moreira/clever-moreira.github.io/tree/main/labs/resilient-rpa", description:"Python, retry, validação e idempotência", question:"Como o Resilient RPA trata falhas e evita duplicidades?" },
  erp: { id:"erp", title:"ERP Integration API", url:"https://github.com/clever-moreira/clever-moreira.github.io/tree/main/labs/erp-integration-api", description:"API REST fictícia com FastAPI", question:"Como Clever desenha integrações entre ERPs e APIs?" },
  dados: { id:"dados", title:"Operational Analytics", url:"https://github.com/clever-moreira/clever-moreira.github.io/tree/main/labs/operational-analytics", description:"Indicadores operacionais usando SQL", question:"Como Clever usa métricas para melhorar automações?" }
});
const TOPICS = [
  { id:"rpa", regex:/rpa|uipath|botcity|selenium|python|automa[cçãa]|robot|robô|robos|robôs|retry|idempot|exce[cç][aã]o|resili[eê]n|script|debug|rob[oô]/i },
  { id:"erp", regex:/erp|sap|totvs|senior|oracle|linx|integra[cç][aã]o|api\b|rest\b|fastapi|kafka|mensageria|sistema|arquitetura|microservi[cç]o/i },
  { id:"dados", regex:/power.?bi|relat[oó]rio|dados|indicador|dashboard|databricks|sql|banco de dados|m[eé]trica|observabil|painel/i },
  { id:"processos", regex:/bpms|bpmn|zeev|fluig|sydle|workflow|fluxo|processos?|aprova[cç][aã]o/i },
  { id:"ia", regex:/intelig[eê]ncia artificial|agente|llm|\bia\b|chatbot|machine learning|modelo de linguagem/i },
  { id:"pessoal", regex:/hobb|m[uú]sica|guitarra|games?|jogo|trilha|viaj|livros?|filmes?|fora do trabalho|pessoal|batman|homem[ -]?aranha|deadpool|senhor dos an[eé]is|star wars|diablo|dungeons\s*(?:&|and|e)\s*dragons|d\s*&\s*d|rpg\s*(?:de mesa)?|tabuleiro/i },
  { id:"perfil", regex:/perfil|quem [eé]|sobre (ele|clever)|trajet[oó]ria|carreira|experi[eê]ncia|trabalh(a|o|ou)|estilo|lideran[cç]a|especialista/i }
];
const CUES = {
  rpa:"Relacione Python ao desenvolvimento de automações e diferencie plataforma RPA, biblioteca e linguagem. Se houver espaço, use o exemplo anonimizado de recuperação de erros e idempotência; não transforme a resposta em lista de ferramentas.",
  erp:"Mostre que integrar ERPs significa entender contratos, regras, exceções e sistemas legados. Cite, se pertinente, o laboratório fictício ERP Integration API. Não afirme uma integração real do laboratório com um ERP comercial.",
  dados:"Explique como indicadores ajudam a acompanhar execução, exceções e evolução. Aponte o exemplo público Operational Analytics quando ele ajudar a ilustrar.",
  processos:"Converse sobre fluxos com aprovações, regras condicionais, formulários e reprocessos. Conecte com a capacidade de Clever de traduzir problema de negócio em processo executável.",
  ia:"Fale de agentes, LLMs e integração de IA com processos de negócio sem prometer funcionalidades ou resultados não comprovados. O próprio Clever AI é demonstração de integração entre interface, Worker e modelo.",
  pessoal:"Seja leve e conhecedor dos gostos do Clever: guitarra, música, liderança musical, Batman, Homem-Aranha, Deadpool, O Senhor dos Anéis, Star Wars, Diablo, Dungeons & Dragons, jogos de tabuleiro, viagens e trilhas. Use detalhes e referências naturalmente quando o visitante trouxer esses assuntos, sem inventar preferências específicas, personagens de RPG ou experiências de campanhas e sem sempre puxar a conversa para o trabalho.",
  perfil:"Destaque perfil técnico e visão ponta a ponta. Clever transita entre conversar com negócio, desenhar solução, programar e sustentar; evite repetir um resumo de LinkedIn.",
  geral:"Sua função é apresentar Clever, sua experiência profissional, projetos e interesses. Não responda perguntas de matemática, política geral ou conhecimento geral alheio a Clever. Quando o assunto fugir do escopo, explique brevemente o foco do assistente e convide para um assunto pertinente, sem alegar desconhecimento do fato. Cumprimente naturalmente e aceite perguntas sobre seu próprio funcionamento."
};
const SUGGESTIONS = {
  rpa:["Como ele lida com falhas em automações?", "Você pode mostrar um exemplo de RPA em Python?", "Que decisões ele toma antes de automatizar?", "Como funciona a idempotência nos robôs?"],
  erp:["O que ele considera ao integrar um ERP?", "Mostre um exemplo de API corporativa.", "Como lidar com falhas entre sistemas?", "Quais tecnologias ele utiliza na integração?"],
  dados:["Como ele monitora resultados dos robôs?", "Qual projeto público mostra indicadores?", "O que ele considera uma boa métrica?", "Como SQL e Python entram nessa análise?"],
  processos:["Como ele desenha um fluxo de aprovação complexo?", "Onde entra o Zeev nos projetos?", "Como evitar retrabalho num BPMS?", "Como ele trata exceções do processo?"],
  ia:["Como o Clever AI foi construído?", "Como ele combina IA com automação?", "Onde faz sentido usar agentes de IA?", "Como proteger integrações com modelos?"],
  pessoal:["O Clever também curte D&D e jogos de tabuleiro?", "Quais universos de filmes e heróis ele gosta?", "Ele gosta da franquia Diablo?", "Qual é a relação dele com música e guitarra?", "O que ele gosta de fazer fora do trabalho?"],
  perfil:["Em que tipo de desafio Clever se destaca?", "Como ele conecta arquitetura e execução?", "O que diferencia sua abordagem?", "Como ele se posiciona como especialista?"],
  geral:["Como Clever usa Python no trabalho?", "Qual projeto você recomenda conhecer primeiro?", "Como ele aborda um projeto complexo?", "Qual é sua experiência com ERPs?"]
};
const TOPIC_PROJECT = {rpa:["rpa"],erp:["erp"],dados:["dados"],processos:["erp"],ia:[],pessoal:[],perfil:[],geral:[]};
const softFollowUp=/^(e\b|ent[aã]o|mas\b|por qu[eê]|como assim|e nisso|e nesse|e isso|tamb[eé]m|me explica|pode detalhar|conte mais|qual deles)/i;
const courtesy=/^(obrigad[oa]|valeu|beleza|ok(?:ay)?|entendi|legal|massa|show|tudo bem)[!.\s]*$/i;

/**
 * Não deduz preferências ou filiação político-partidária a partir de
 * nacionalidade, idioma, profissão, aparência ou outras características.
 * Resposta determinística para evitar que um modelo pequeno confunda "PTista"
 * (política) com "PT" (português).
 */
export function privatePoliticalAnswer(question) {
  const q=String(question||"").toLocaleLowerCase("pt-BR")
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const attribution=/\b(?:ptista|petista|lulista|bolsonarista|esquerdista|direitista|comunista|socialista|partidari[oa]|filiad[oa])\b|\b(?:de esquerda|de direita|qual partido)\b|\b(?:do|de|no) pt\b|\b(?:apoia|apoiou|vota|votou|votaria)\s+(?:no?\s+|em\s+)?(?:pt|lula|bolsonaro)\b|\b(?:posicionamento|orientacao|preferencia|opiniao)\s+politic[ao]\b/;
  if (!attribution.test(q)) return null;
  return "Não tenho informações sobre a preferência ou filiação partidária do Clever. Não seria correto presumir seu posicionamento político sem uma declaração dele sobre o assunto.";
}

// Respostas curtas e deliberadas para assuntos externos ao escopo do portfólio.
export function outOfScopeAnswer(question) {
  const q=String(question||"").toLocaleLowerCase("pt-BR").trim();
  const mentionsClever=/\b(?:clever|moreira|ele|dele|sua|seu)\b/i.test(q);
  const math=/(?:\d+\s*[+*\/\-]\s*\d+)|(?:quanto (?:e|é|vale|da|dá)\s+\d+)|(?:resolv[ae]|calcule|calcul[ae]|raiz quadrada|equac[aã]o|tabuada)/i.test(q);
  const publicFacts=/(?:quem (?:e|é|foi|sera|será) (?:o |a )?(?:presidente|governador|ministro)|presidente d[oa] brasil|capital d[oea]|que horas (?:s[aã]o|e|é)|previs[aã]o do tempo|cotac[aã]o d[oa]|resultado d[oa] jogo|not[ií]cias? (?:de |do |da )?hoje)/i.test(q);
  if ((math || publicFacts) && !mentionsClever) {
    return "Boa pergunta, mas por aqui meu foco é apresentar o Clever, seus projetos e os assuntos que fazem parte da trajetória dele. Quer explorar alguma dessas áreas?";
  }
  return null;
}

export function conversationRoute(messages) {
  const visitor = messages.filter(m=>m.role==="user");
  const latest = visitor.at(-1)?.content?.trim()||"";
  let topic = TOPICS.find(t=>t.regex.test(latest))?.id;
  if (!topic && softFollowUp.test(latest)) {
    const prior = visitor.slice(0,-1).reverse().find(m=>TOPICS.some(t=>t.regex.test(m.content)));
    topic = TOPICS.find(t=>t.regex.test(prior?.content||""))?.id;
  }
  topic ||= "geral";
  const simplyAcknowledging=courtesy.test(latest);
  const options = SUGGESTIONS[topic]||SUGGESTIONS.geral;
  const offset = (visitor.length-1) % options.length;
  const suggestions = [...options.slice(offset),...options.slice(0,offset)]
    .filter(q=>!visitor.some(m=>m.content.toLocaleLowerCase("pt-BR").trim()===q.toLocaleLowerCase("pt-BR").trim())).slice(0,2);
  return {
    topic,
    instruction:CUES[topic],
    projects:simplyAcknowledging?[]:(TOPIC_PROJECT[topic]||[]).map(id=>PROJECTS[id]),
    suggestions:(simplyAcknowledging||generalConversation||unrelatedFollowup)?[]:suggestions
  };
}
