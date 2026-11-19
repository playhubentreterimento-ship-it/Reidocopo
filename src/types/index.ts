export type CatalogCategory = string;

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  images?: string[];
  tags: string[];
  badge?: string;
  cropClass?: string;
  featured?: boolean;
  bentoSize?: 'normal' | 'tall' | 'wide';
  is_published?: boolean;
  sort_order?: number;
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
