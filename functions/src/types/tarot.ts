import { SpreadType } from './spread';

export interface DrawnTarotCard {
    id: number;
    name: {
      en: string;
      ko: string;
    };
    arcanaType: 'Major' | 'Minor';
    suit: 'Cup' | 'Pentacle' | 'Sword' | 'Wand' | null;
    number: number;
    direction: '정방향' | '역방향';
    keywords: string[];
    description: string;
  }

export interface SaveTarotReadingRequest {
  question: string;
  cards: DrawnTarotCard[];
  interpretation: {
    content: string;
    title: string;
    model: string;
  };
  spreadType: SpreadType;
}

export interface TarotReading extends SaveTarotReadingRequest {
  id: string;
  createdAt: string;
}
