export interface GeminiPrompt {
  system: {
    input: string;
    response: string;
  };
}

export { vertexClaudePrompt as geminiPrompt } from './vertex-claude.prompt';
