export const STORAGE_KEYS = {
  UNIFIED_REFLECTIONS: 'mindful_reflections_list',
  SLEEP_REFLECTIONS: 'mindful_sleep_data',
};

export const CATEGORIES = [
  'Geral',
  'Gratidão',
  'Estoicismo',
  'Aprendizado',
  'Desafio',
  'Ideia',
  'Ansiedade',
  'Planejamento (PDCA)'
];

export const MOOD_OPTIONS = [
  { value: 'awful', label: 'Terrível', icon: '😭', color: 'bg-slate-200 text-slate-600' },
  { value: 'bad', label: 'Ruim', icon: '🙁', color: 'bg-blue-100 text-blue-600' },
  { value: 'neutral', label: 'Neutro', icon: '😐', color: 'bg-gray-100 text-gray-600' },
  { value: 'good', label: 'Bem', icon: '🙂', color: 'bg-emerald-100 text-emerald-600' },
  { value: 'great', label: 'Incrível', icon: '🤩', color: 'bg-yellow-100 text-yellow-600' },
];

export const REFLECTION_CHECKLISTS = {
  REST: {
    label: "Descanso da noite anterior",
    icon: "fa-bed",
    color: "indigo",
    items: [
      "Acordei sem despertador",
      "Sem cafeína após 14h ontem",
      "Sem álcool antes de dormir",
      "Temperatura do quarto agradável",
      "Sonhei vividamente",
      "Acordei com energia",
      "Cumpriu o ritual de desligamento após o alarme"
    ]
  },
  FOCUS: {
    label: "Tarefas (Hoje)",
    icon: "fa-crosshairs",
    color: "emerald",
    items: [
      "Defini a ÚNICA coisa essencial",
      "Bloqueie tempo na agenda (Deep Work)",
      "Eliminei distrações visuais",
      "Revisei reuniões do dia",
      "Preparei ambiente de trabalho",
      "Bebi água ao acordar"
    ]
  },
  GRATITUDE: {
    label: "Gratidão Diária",
    icon: "fa-heart",
    color: "teal",
    items: [
      "Sou grato hoje por estar vivo",
      "Sou grato pelo meu corpo saudável e forte",
      "Sou grato pelo meu lar acolhedor e seguro",
      "Sou grato hoje por minhas filhas",
      "Sou grato hoje pela minha esposa",
      "Sou grato pelos meus familiares e amigos",
      "Sou grato hoje por ter meus pais vivos e próximos",
      "Sou grato hoje por ter sogro e sogra vivos e próximos",
      "Sou grato pela minha saúde mental e emocional",
      "Sou grato pelos meus recursos financeiros",
      "Sou grato pelo meu trabalho/estudo e crescimento",
      "Sou grato pelo belo mundo e natureza",
      "Sou grato pelos momentos felizes vividos",
      "Sou grato pela minha fé e espiritualidade",
      "Sou grato pelas dificuldades que me fortaleceram"
    ]
  },
  DEEP: {
    label: "Mental (Profundo)",
    icon: "fa-brain",
    color: "amber",
    items: [
      "Dicotomia do Controle (O que depende de mim?)",
      "Premeditatio Malorum (Visualização negativa)",
      "Amor Fati (Aceitação do destino)",
      "Memento Mori (Consciência da finitude)",
      "Gratidão por 3 coisas simples",
      "Identifiquei um viés cognitivo"
    ]
  }
};

export const STOIC_QUOTES = [
  { text: "A felicidade de sua vida depende da qualidade de seus pensamentos.", author: "Marco Aurélio" },
  { text: "Sofremos mais na imaginação do que na realidade.", author: "Sêneca" },
  { text: "Não é o que acontece com você, mas como você reage que importa.", author: "Epicteto" },
  { text: "Se você quer melhorar, contente-se em ser considerado tolo e estúpido.", author: "Epicteto" },
  { text: "O homem que sofre antes de ser necessário, sofre mais do que o necessário.", author: "Sêneca" },
  { text: "A melhor vingança é não ser como o seu inimigo.", author: "Marco Aurélio" },
  { text: "Dificuldades fortalecem a mente, assim como o trabalho o faz com o corpo.", author: "Sêneca" },
  { text: "Nenhum homem é livre se não for mestre de si mesmo.", author: "Epicteto" },
  { text: "O que impede a ação favorece a ação. O que fica no caminho torna-se o caminho.", author: "Marco Aurélio" },
  { text: "Comece de onde você está. Use o que você tem. Faça o que você pode.", author: "Arthur Ashe (Inspirado no Estoicismo)" },
  { text: "A riqueza não consiste em ter grandes posses, mas em ter poucas necessidades.", author: "Epicteto" },
  { text: "Ouse ser sábio.", author: "Horácio" }
];

export const DEFAULT_RITUAL_ITEMS = [
  { id: 'mental_dump', label: 'Anotar pendências (Esvaziar mente)', category: '1. Mental', completed: false },
  { id: 'mental_win', label: 'Registrar 1 aprendizado do dia', category: '1. Mental', completed: false },
  { id: 'stimulus_screens', label: 'Sem telas/notificações (30min+)', category: '2. Estímulos', completed: false },
  { id: 'stimulus_light', label: 'Luzes quentes ou indiretas', category: '2. Estímulos', completed: false },
  { id: 'env_clothes', label: 'Separar roupa de amanhã', category: '3. Ambiente', completed: false },
  { id: 'env_dark', label: 'Quarto escuro e organizado', category: '3. Ambiente', completed: false },
  { id: 'body_stretch', label: 'Alongamento leve / Soltar ombros', category: '4. Corpo', completed: false },
  { id: 'body_breath', label: 'Respiração lenta (4-6-8)', category: '4. Corpo', completed: false },
  { id: 'comfort_hygiene', label: 'Higiene pessoal com calma', category: '5. Conforto', completed: false },
  { id: 'final_shutdown', label: 'Não forçar o sono, apenas permitir', category: '5. Conforto', completed: false },
];