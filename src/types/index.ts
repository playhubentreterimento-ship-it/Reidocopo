export type CatalogCategory =
  | 'all'
  | 'fosco-degrade'
  | 'estampa-total'
  | 'com-alca'
  | 'tacas-premium';

export interface CatalogItem {
  id: string;
  name: string;
  category: CatalogCategory;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  tags: string[];
  badge?: string;
  cropClass?: string;
  featured?: boolean;
  bentoSize?: 'normal' | 'tall' | 'wide';
}

export interface CartItem {
  item: CatalogItem;
  quantity: number;
}

export interface StorytellingStep {
  stepNumber: string;
  microlabel: string;
  title: string;
  text: string;
  ctaText?: string;
}

export interface ModelCaption {
  frameStart: number;
  frameEnd: number;
  label: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface DifferentialItem {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  type: 'eco' | 'resistant' | 'custom';
}
