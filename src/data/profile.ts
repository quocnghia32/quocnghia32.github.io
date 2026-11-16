export const profile = {
  name: 'Nguyen Quoc Nghia',
  firstLine: 'Nguyen',
  secondLine: 'Quoc Nghia',
  logo: 'nghia.nq',
  footerLine: 'AI Engineer @ MoMo · Ho Chi Minh City, Vietnam',
  email: 'nguyennghia3224.work@gmail.com',
  cv: '/cv.pdf',
  links: {
    github: 'https://github.com/quocnghia32',
    linkedin: 'https://www.linkedin.com/in/quocnghia32/',
  },
} as const;

export const strengths = {
  ai: [
    { title: 'Agentic AI', text: 'Agent workflows, tools and prompts that hold up on real tasks.' },
    { title: 'Evaluation', text: 'LLM-as-a-judge with rubric metrics, so quality is measurable.' },
    { title: 'Memory & harness', text: 'Context, memory and the guardrails around the model.' },
  ],
  sw: [
    { title: 'Shipping to production', text: 'From prototype to a product people use every day.' },
    { title: 'Scalable systems', text: 'Kubernetes and Kafka runtimes that stay fast under load.' },
    { title: 'Reliable by design', text: 'Monitoring, reconciliation and failover that recover on their own.' },
  ],
} as const;

export const terminal = [
  { cmd: 'whoami', out: 'nghia · AI Engineer @ MoMo' },
  { cmd: 'cat now.txt', out: 'agent runtimes & LLM judges' },
] as const;
