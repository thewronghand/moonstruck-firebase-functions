import type { DrawnTarotCard } from '../types/tarot';
import type { SpreadType } from '../types/spread';
import { spreadPrompts } from '../data/prompts/spread.prompt';

function formatSpreadLayout(cards: DrawnTarotCard[], spreadType: SpreadType): string {
  switch (spreadType) {
    case 'SINGLE':
      return `뽑힌 카드:\n${cards[0]}`;

    case 'TRIPLE_CHOICE':
      return `첫 번째 카드(중앙, 현재 상황을 나타냄):
${cards[0]}

두 번째 카드(왼쪽에 위치, 첫번째 선택지를 나타냄):
${cards[1]}

세 번째 카드(오른쪽에 위치, 두번째 선택지를 나타냄):
${cards[2]}`;

    case 'TRIPLE_TIMELINE':
      return `첫 번째 카드(과거를 나타냄):
${cards[0]}

두 번째 카드(현재를 나타냄):
${cards[1]}

세 번째 카드(미래를 나타냄):
${cards[2]}`;

    default:
      return cards.map((card, index) =>
        `${index + 1}번째 카드:\n${card}`
      ).join('\n\n');
  }
}

export function formatReadingPrompt(
  userInput: string,
  cards: DrawnTarotCard[],
  spreadType: SpreadType
): string {
  const spreadPrompt = spreadPrompts[spreadType];

  return `# Spread Information
${spreadPrompt.description}

# Card Layout
${formatSpreadLayout(cards, spreadType)}

# User Question
${userInput}

Please interpret these tarot cards based on the spread layout and the user's question.`;
}
