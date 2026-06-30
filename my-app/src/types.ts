export type Tab = 'calc' | 'ai' | 'cam';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'loading';
  text: string;
};
