import type { Education, Role } from './types';

export const roles: Role[] = [
  {
    title: 'AI Engineer I',
    company: 'MoMo',
    start: '2026-02',
    end: null,
    location: 'Ho Chi Minh City',
    summary: 'Data agent platform: agents, evaluation, runtime.',
    current: true,
    groups: [
      {
        name: 'agents',
        bullets: [
          'Designed end-to-end workflows and system prompts for a production data agent: tool orchestration, context layout, structured answers.',
          'Owned quality after launch, triaging tool failures and wrong answers.',
        ],
      },
      {
        name: 'evaluation',
        bullets: [
          "Built the core LLM-as-a-judge engine scoring agents' SQL answers on BigQuery.",
          'Rubric metric with per-dimension pass/fail, so scores are reproducible.',
          'Judge token cost down ~50% with a prompt caching redesign.',
        ],
      },
      {
        name: 'runtime',
        bullets: [
          'Per-user agent pods on Kubernetes with a 15-pod warm pool: first turn from ~18s to ~1s.',
          'Kafka data plane streaming output to UI, Langfuse and lakehouse; Redis session registry.',
        ],
      },
      {
        name: 'tooling',
        bullets: [
          'Claude Code plugin and CI/CD flow turning analyst knowledge into validated merge requests.',
          'One-run onboarding scripts for non-engineering analysts; agent cost down ~13%.',
        ],
      },
    ],
  },
  {
    title: 'Software Engineer Trainee',
    company: 'MoMo',
    start: '2025-08',
    end: '2026-01',
    location: 'Ho Chi Minh City',
    summary: 'Retrieval-augmented chatbots for internal knowledge.',
    bullets: [
      'Built a RAG ingestion pipeline with LLM-contextualized chunking, raising Recall@20 from 75% to 93%.',
      'Hybrid retrieval on Elasticsearch: BM25 plus dense vectors fused by RRF, with Cohere reranking.',
      'Shipped a production RAG chatbot (FastAPI, Next.js, PostgreSQL) scoring 83% vs a 43% baseline on a human-graded benchmark.',
      'Deployed services to Kubernetes via Helm and ArgoCD.',
    ],
  },
];

export const education: Education = {
  degree: 'B.Sc. Computer Science',
  school: 'University of Science, VNUHCM',
  start: '2022',
  end: '2026',
  note: 'Advanced Program in Computer Science, GPA 3.84/4.0. Thesis on Program-of-Thought distillation into small language models. Before that: Huynh Man Dat High School for the Gifted.',
};
