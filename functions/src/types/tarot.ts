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

export interface TarotReading {
  id: string;
  question: string;
  cards: DrawnTarotCard[];
  interpretation: string;
  createdAt: string;
}

export interface SaveTarotReadingRequest {
  question: string;
  cards: DrawnTarotCard[];
  interpretation: string;
}
