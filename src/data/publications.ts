import type { Publication } from './types';

export const publications: Publication[] = [
  {
    id: 'soict2024',
    year: 2024,
    venueShort: 'SOICT 2024',
    title: 'AI-Generated Image Recognition via Fusion of CNNs and Vision Transformers',
    authors: ['Xuan-Bach Mai', 'Hoang-Minh Nguyen-Huu', 'Quoc-Nghia Nguyen', 'Hoang-Tung Vu', 'Trung-Nghia Le'],
    me: 'Quoc-Nghia Nguyen',
    venue: 'Proceedings of the 13th International Symposium on Information and Communication Technology, Springer CCIS, pp. 54 to 64',
    abstract:
      'We fuse a convolutional backbone (EfficientNetV2-B0) with a Vision Transformer (ViT-B16) to tell AI-generated images from real photographs. Concatenating the two feature streams reaches 97.44% accuracy on CIFAKE, ahead of either backbone alone.',
    bibtexType: 'inproceedings',
    bibtexKey: 'mai2024aigen',
    bibtexFields: {
      booktitle: 'SOICT 2024',
      series: 'CCIS',
      publisher: 'Springer',
      pages: '54--64',
    },
    links: [
      { label: 'springer', href: 'https://doi.org/10.1007/978-981-96-4282-3_6' },
      { label: 'arxiv', href: 'https://arxiv.org/abs/2606.27637' },
    ],
  },
  {
    id: 'thesis2026',
    year: 2026,
    venueShort: 'B.Sc. thesis',
    title: 'Distilling Program-of-Thought into Small Language Models for Financial Reasoning',
    authors: ['Nguyen Trong Quy', 'Nguyen Quoc Nghia'],
    me: 'Nguyen Quoc Nghia',
    venue: 'University of Science, VNUHCM. Advised by Dr. Nguyen Tien Huy and Dr. Le Thanh Tung',
    abstract:
      'PoTKD trains Program-of-Thought reasoning into a model small enough to deploy on premises. A 14B generator produces execution-verified Python for FinQA and TAT-QA; a 7 to 8B teacher then distills into a 0.5 to 1B student with a reverse-KL objective. Matching the teacher token distribution beats text-level fine-tuning in all eighteen configurations, and the best 1B student recovers 85% of its 8B teacher.',
    bibtexType: 'thesis',
    bibtexKey: 'quy2026potkd',
    bibtexFields: {
      school: 'University of Science, VNUHCM',
      type: 'Bachelor thesis',
    },
    links: [],
  },
];
