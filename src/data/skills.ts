import type { SkillGroup } from './types';

export const skillGroups: SkillGroup[] = [
  {
    name: 'AI & LLM',
    note: 'What I use every day at work.',
    items: ['LLM APIs', 'LangChain', 'LangGraph', 'MCP', 'Claude Code', 'Langfuse', 'RAG', 'LLM-as-a-judge', 'Prompt caching', 'Knowledge distillation'],
    wide: true,
  },
  { name: 'Languages', note: 'Proficient in the first three.', items: ['Python', 'Go', 'C++', 'Java', 'TypeScript', 'SQL'] },
  { name: 'Infrastructure', note: 'Shipping and running agents.', items: ['Docker', 'Kubernetes', 'Helm', 'ArgoCD', 'Kafka', 'Redis', 'Airflow', 'FastAPI'] },
  { name: 'Data & search', note: 'Where the answers come from.', items: ['PostgreSQL', 'MySQL', 'BigQuery', 'Elasticsearch', 'MongoDB', 'Iceberg', 'Spark SQL'] },
  { name: 'Spoken', note: '', items: ['Vietnamese (native)', 'English (upper intermediate)'] },
];

export const marquee = ['Python', 'Go', 'C++', 'LangGraph', 'Kubernetes', 'Kafka', 'BigQuery', 'Elasticsearch'];
