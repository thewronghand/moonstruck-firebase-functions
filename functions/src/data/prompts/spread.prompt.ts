/* eslint-disable max-len */
import { SpreadType } from '../../types/spread';

export interface SpreadPrompt {
  description: string;
}

export const spreadPrompts: { [key in SpreadType]: SpreadPrompt } = {
  SINGLE: {
    description: 'A single card spread provides a direct answer or insight to a specific question or situation. As this spread relies on just one card, the interpretation should be thorough and detailed, drawing upon the card\'s symbolism, imagery, traditional meanings, and elemental associations to provide comprehensive guidance.'
  },
  TRIPLE_TIMELINE: {
    description: 'The Triple Timeline spread uses three cards to explore the past, present, and future aspects of a situation, showing how events and energies flow through time.'
  },
  TRIPLE_CHOICE: {
    description: 'The Triple Choice spread helps with decision-making by showing the current situation in the center card, with the left and right cards representing two different possible paths or choices.'
  },
  FIVE_CARD_CROSS: {
    description: 'The Five Card Cross spread places cards in a cross pattern, with the center showing the current situation, surrounded by cards representing influences above, below, behind, and ahead.'
  },
  CELTIC_CROSS: {
    description: 'The Celtic Cross is a comprehensive ten-card spread that explores multiple aspects of a situation, including past influences, future possibilities, hopes, fears, and potential outcomes.'
  }
};
