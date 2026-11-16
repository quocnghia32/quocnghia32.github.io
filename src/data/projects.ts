import type { FeaturedProject, Project } from './types';

export const featured: FeaturedProject = {
  eyebrow: 'Featured · Bachelor thesis · 2026',
  title: 'PoTKD: teaching a 1B model to reason over financial reports',
  description:
    'A 14B generator writes execution-verified Python for FinQA and TAT-QA. An 8B teacher then distills into a 0.5 to 1B student with reverse-KL token matching, small enough to run on premises.',
  tags: ['knowledge distillation', 'PyTorch', 'FinQA', 'TAT-QA'],
  metrics: [
    { label: '1B student, TAT-QA', value: '64.9%' },
    { label: 'of 8B teacher kept', value: '85%', accent: true },
    { label: 'points over SFT', value: '+4 to 10.6' },
    { label: 'configs significant', value: '18 / 18' },
  ],
};

export const projects: Project[] = [
  {
    slug: 'deep-research',
    title: 'Deep Research Agent',
    category: 'ai',
    tag: 'AI · agents',
    date: 'Jun 2025',
    description:
      'Multi-agent research system with specialised retriever, critic, summariser and verifier agents for autonomous gathering and synthesis across unstructured sources.',
    stack: ['Python', 'LangGraph', 'LangChain'],
  },
  {
    slug: 'manga-search',
    title: 'Manga Search Engine',
    category: 'ai',
    tag: 'AI · multimodal',
    date: 'Dec 2024',
    description:
      'Find comic panels by describing a scene or quoting dialogue, combining computer vision and text retrieval in one interface.',
    stack: ['Python', 'Streamlit', 'CV', 'NLP'],
    link: { label: 'Watch demo', href: 'https://www.youtube.com/watch?v=y5pOvt_cl2I' },
  },
  {
    slug: 'angi',
    title: 'Angi: Restaurant Review Classifier',
    category: 'systems',
    tag: 'full stack · team lead',
    date: 'Apr 2025',
    description:
      'Aggregates restaurant reviews from several platforms and classifies them with an LLM. Led the team and built the Go backend.',
    stack: ['Go', 'MySQL', 'React', 'Docker'],
  },
  {
    slug: 'zk-schnorr',
    title: 'Zero-Knowledge Auth with Schnorr',
    category: 'systems',
    tag: 'security · crypto',
    date: 'Aug 2025',
    description:
      'Schnorr identification protocol with honest-run and replay-attack experiments, reproducible by seed.',
    stack: ['Python', 'Cryptography'],
    link: { label: 'GitHub', href: 'https://github.com/quocnghia32/CS434---Zero-knowledge-proofs' },
  },
  {
    slug: 'crossy-road',
    title: 'Crossy Road in C++',
    category: 'systems',
    tag: 'C++ · game',
    date: 'Jan 2024',
    description: 'A fully playable arcade game built from scratch for the OOP course.',
    stack: ['C++', 'SFML'],
    link: { label: 'Watch demo', href: 'https://www.youtube.com/watch?v=Ipdarw_-vAg' },
  },
  {
    slug: 'vn30f-donchian',
    title: 'VN30F Donchian Intraday Breakout',
    category: 'quant',
    tag: 'quant · futures',
    date: 'May 2026',
    description:
      'Rolling 60-minute Donchian envelope on VN30 futures. Out of sample 2024 to 2025: 1,680 trades, per-trade Sharpe 5.77.',
    stack: ['Python', 'Backtesting', 'Optuna'],
    link: { label: 'GitHub', href: 'https://github.com/quocnghia32/CS408-Final-Group14' },
  },
  {
    slug: 'dual-sma',
    title: 'Dual SMA Momentum on VN30F1M',
    category: 'quant',
    tag: 'quant · momentum',
    date: 'Mar 2026',
    description:
      '6/10-day SMA crossover with stop-loss and time exits, tuned with Optuna on 2022 to 2023 and tested on 2024 to 2025.',
    stack: ['Python', 'SQL', 'Optuna'],
    link: { label: 'GitHub', href: 'https://github.com/quocnghia32/algotrade-midterm-gr14' },
  },
];
