export enum PlatformEnum {
  CHATGPT = "chatgpt",
}
export enum EventTypeEnum {
  AICONSOLE = "AICONSOLE",
}

export enum LLMModelEnum {
  GPT4O = "gpt-4o",
  GPT45 = "gpt-4-5",
  O3 = "o3",
  O4MINI = "o4-mini",
  O4MINI_HIGH = "o4-mini-high",
  GPT4O_MINI = "gpt-4o-mini",
  O1PRO = "o1-pro"
}

export interface LLMMessage {
  prompt: string;
  fallbackPrompt: string;
  deepResearch?: boolean;
  search?: boolean;
  model: LLMModelEnum;
}
