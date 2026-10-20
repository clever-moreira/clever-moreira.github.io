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
  { id:"pessoal", regex:/hobb|m[uú]sica|guitarra|games?|jogo|trilha|viaj|livros?|filmes?|fora do trabalho|pessoal/i },
  { id:"perfil", regex:/perfil|quem [eé]|sobre (ele|clever)|trajet[oó]ria|carreira|experi[eê]ncia|trabalh(a|o|ou)|estilo|lideran[cç]a|especialista/i }
];
const CUES = {
  rpa:"Relacione Python ao desenvolvimento de automações e diferencie plataforma RPA, biblioteca e linguagem. Se houver espaço, use o exemplo anonimizado de recuperação de erros e idempotência; não transforme a resposta em lista de ferramentas.",
  erp:"Mostre que integrar ERPs significa entender contratos, regras, exceções e sistemas legados. Cite, se pertinente, o laboratório fictício ERP Integration API. Não afirme uma integração real do laboratório com um ERP comercial.",
  dados:"Explique como indicadores ajudam a acompanhar execução, exceções e evolução. Aponte o exemplo público Operational Analytics quando ele ajudar a ilustrar.",
  processos:"Converse sobre fluxos com aprovações, regras condicionais, formulários e reprocessos. Conecte com a capacidade de Clever de traduzir problema de negócio em processo executável.",
  ia:"Fale de agentes, LLMs e integração de IA com processos de negócio sem prometer funcionalidades ou resultados não comprovados. O próprio Clever AI é demonstração de integração entre interface, Worker e modelo.",
  pessoal:"Seja leve: guitarra, música, liderança musical, jogos, trilhas, viagens e histórias. Faça uma conexão orgânica com colaboração ou curiosidade, mas não converta hobby em discurso corporativo.",
  perfil:"Destaque perfil técnico e visão ponta a ponta. Clever transita entre conversar com negócio, desenhar solução, programar e sustentar; evite repetir um resumo de LinkedIn.",
  geral:"Ajude o visitante a descobrir algo concreto sobre Clever, sem recitar todo o currículo. Escolha um aspecto da atuação, explique com naturalidade e avance a conversa."
};
const SUGGESTIONS = {
  rpa:["Como ele lida com falhas em automações?", "Você pode mostrar um exemplo de RPA em Python?", "Que decisões ele toma antes de automatizar?", "Como funciona a idempotência nos robôs?"],
  erp:["O que ele considera ao integrar um ERP?", "Mostre um exemplo de API corporativa.", "Como lidar com falhas entre sistemas?", "Quais tecnologias ele utiliza na integração?"],
  dados:["Como ele monitora resultados dos robôs?", "Qual projeto público mostra indicadores?", "O que ele considera uma boa métrica?", "Como SQL e Python entram nessa análise?"],
  processos:["Como ele desenha um fluxo de aprovação complexo?", "Onde entra o Zeev nos projetos?", "Como evitar retrabalho num BPMS?", "Como ele trata exceções do processo?"],
  ia:["Como o Clever AI foi construído?", "Como ele combina IA com automação?", "Onde faz sentido usar agentes de IA?", "Como proteger integrações com modelos?"],
  pessoal:["O que a música ensina sobre trabalho em equipe?", "Como ele aproveita o tempo fora do trabalho?", "Como a guitarra entrou na vida dele?", "Ele também gosta de desafios fora da tecnologia?"],
  perfil:["Em que tipo de desafio Clever se destaca?", "Como ele conecta arquitetura e execução?", "O que diferencia sua abordagem?", "Como ele se posiciona como especialista?"],
  geral:["Como Clever usa Python no trabalho?", "Qual projeto você recomenda conhecer primeiro?", "Como ele aborda um projeto complexo?", "Qual é sua experiência com ERPs?"]
};
const TOPIC_PROJECT = {rpa:["rpa"],erp:["erp"],dados:["dados"],processos:["erp"],ia:[],pessoal:[],perfil:[],geral:[]};
const softFollowUp=/^(e\b|ent[aã]o|mas\b|por qu[eê]|como assim|e nisso|e nesse|e isso|tamb[eé]m|me explica|pode detalhar|conte mais|qual deles)/i;
const courtesy=/^(obrigad[oa]|valeu|beleza|ok(?:ay)?|entendi|legal|massa|show|tudo bem)[!.\s]*$/i;

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
    suggestions:simplyAcknowledging?[]:suggestions
  };
}
