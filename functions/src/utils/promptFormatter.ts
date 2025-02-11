import type { DrawnTarotCard } from '../types/tarot';
import type { SpreadInfo } from '../types/spread';
import { spreadPrompts } from '../data/prompts/spread.prompt';

function formatSpreadLayout(cards: DrawnTarotCard[], spreadInfo: SpreadInfo): string {
  return cards.map((card, index) =>
    `${spreadInfo.positions[index]}:\n${JSON.stringify(card, null, 2)}`
  ).join('\n\n');
}

export function formatReadingPrompt(
  userInput: string,
  cards: DrawnTarotCard[],
  spreadInfo: SpreadInfo
): string {
  const spreadPrompt = spreadPrompts[spreadInfo.type];

  return `# Spread Information
${spreadInfo.name}
${spreadPrompt.description}

# Card Layout
${formatSpreadLayout(cards, spreadInfo)}

# User Question
${userInput}

Please interpret these tarot cards based on the spread layout and the user's question.`;
}
