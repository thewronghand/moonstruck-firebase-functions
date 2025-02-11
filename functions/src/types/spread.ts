export type SpreadType =
  | 'SINGLE'
  | 'TRIPLE_TIMELINE'
  | 'TRIPLE_CHOICE'
  | 'FIVE_CARD_CROSS'
  | 'CELTIC_CROSS';

export interface SpreadInfo {
  type: SpreadType;
  name: string;
  description: string;
  positions: string[];
}
