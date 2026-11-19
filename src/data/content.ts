import { StorytellingStep, ModelCaption, FAQItem, DifferentialItem } from '../types';

export const SCROLL_MAP = [
  { pStart: 0, pEnd: 0.14, fStart: 0, fEnd: 0.14 },
  { pStart: 0.14, pEnd: 0.26, fStart: 0.14, fEnd: 0.26 },
  { pStart: 0.26, pEnd: 0.62, fStart: 0.26, fEnd: 0.70 },
  { pStart: 0.62, pEnd: 0.76, fStart: 0.70, fEnd: 0.84 },
  { pStart: 0.76, pEnd: 1.0, fStart: 0.84, fEnd: 1.0 },
];

export const STORYTELLING_STEPS: StorytellingStep[] = [
  {
    stepNumber: '01',
    microlabel: '01 · IDENTIDADE',
    title: 'Tudo começa com a sua marca.',
    text: 'Sua arte, suas cores, sua história. Cada copo nasce para carregar a identidade de quem o segura.',
  },
  {
    stepNumber: '02',
    microlabel: '02 · INFINITAS POSSIBILIDADES',
    title: 'Um modelo para cada noite.',
    text: 'Fosco, colorido, com alça ou em formato de taça. Escolha o acabamento que combina com o seu evento.',
  },
  {
    stepNumber: '03',
    microlabel: '03 · PRESENÇA',
    title: 'E ela vai aonde você não está.',
    text: 'Quando a festa acaba, o copo continua circulando. Sua marca presente no dia a dia de quem esteve lá.',
    ctaText: 'Escolher meus copos',
  },
];

export const MODEL_CAPTIONS: ModelCaption[] = [
  { frameStart: 0, frameEnd: 30, label: 'FOSCO DEGRADÊ' },
  { frameStart: 31, frameEnd: 62, label: 'ESTAMPA TOTAL' },
  { frameStart: 63, frameEnd: 90, label: 'COM ALÇA' },
  { frameStart: 91, frameEnd: 119, label: 'TAÇA PREMIUM' },
];

export const DIFFERENTIALS: DifferentialItem[] = [
  {
    type: 'eco',
    title: 'Ecológico',
    subtitle: 'Reutilizável de verdade',
    description: 'Feito para ser reutilizado continuamente, em vez de descartado no primeiro brinde.',
    tag: 'SUSTENTABILIDADE CONSCIENTE',
  },
  {
    type: 'resistant',
    title: 'Alta Resistência',
    subtitle: 'Estrutura reforçada',
    description: 'Feito para aguentar a festa inteira. Sem quebras, sem estresse, do início ao after.',
    tag: 'ROBUSTEZ COMPROVADA',
  },
  {
    type: 'custom',
    title: '100% Personalizável',
    subtitle: 'Identidade fiel',
    description: 'Sua arte, suas cores, do seu jeito. Precisão milimétrica em cada traço.',
    tag: 'EXCLUSIVIDADE ABSOLUTA',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Escolha os modelos e quantidades',
    description: 'Navegue pelo catálogo interativo, compare os acabamentos no palco 3D e monte sua seleção personalizada com poucos cliques.',
    label: 'SELEÇÃO PRÁTICA',
  },
  {
    step: '02',
    title: 'Personalize: envie sua arte',
    description: 'Envie sua marca ou ideia visual. Nossa equipe especializada cuida de toda a adequação técnica para garantir fidelidade de cor.',
    label: 'CUIDADO TÉCNICO',
  },
  {
    step: '03',
    title: 'Receba e celebre seu evento',
    description: 'Seus ecopos chegam prontos para transformar sua festa em uma experiência marcante que seus convidados levarão para casa.',
    label: 'PRESENÇA MARCANTE',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Como funciona a cotação?',
    answer: 'É simples e sem burocracia: selecione os modelos e quantidades desejados aqui na página e finalize com um clique no WhatsApp. Um de nossos consultores responderá imediatamente com o orçamento completo e direcionamento sob medida.',
  },
  {
    question: 'Posso usar minha própria arte?',
    answer: 'Sim, liberdade de criação total. Você pode enviar seu logotipo, ilustração ou conceito visual. Nossa equipe técnica prepara uma simulação digital prévia para sua validação antes de qualquer etapa de impressão.',
  },
  {
    question: 'Para quais eventos os ecopos servem?',
    answer: 'Nossos ecopos atendem desde celebrações corporativas, casamentos, formaturas e aniversários até festivais de música, grandes eventos open bar, baladas e encontros esportivos.',
  },
  {
    question: 'Os copos são reutilizáveis e ecológicos?',
    answer: 'Com certeza. São produzidos com material nobre ultra resistente e durável, concebidos especificamente para substituir centenas de copos descartáveis e se tornarem lembranças funcionais no cotidiano dos convidados.',
  },
  {
    question: 'Como falar diretamente com a equipe?',
    answer: 'Basta tocar em qualquer botão de WhatsApp ao longo da página ou no botão flutuante de cotação. Nosso time atende com agilidade para esclarecer detalhes técnicos e acompanhar seu pedido.',
  },
];

export const MARQUEE_TEXT = 'SUA MARCA · EM TODO LUGAR · SEMPRE · ';
