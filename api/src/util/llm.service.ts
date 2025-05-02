import { Injectable, Inject, forwardRef } from '@nestjs/common';
 
export interface LLMResponse {}
export enum LLMModelEnum {
  GPT4O = "gpt-4o",
  GPT45 = "gpt-4-5",
  O3 = "o3",
  O4MINI = "o4-mini",
  O4MINI_HIGH = "o4-mini-high",
  GPT4O_MINI = "gpt-4o-mini",
  O1PRO = "o1-pro"
}

interface LLMMessage {
  prompt: string;
  fallbackPrompt: string;
  deepResearch?: boolean;
  search?: boolean;
  model: LLMModelEnum;
}

@Injectable()
export class LLMService {
  prep(messageInput: LLMMessage): LLMMessage {
    // Define default values for optional properties
    const defaultMessageValues: Omit<LLMMessage, 'prompt'> = {
      fallbackPrompt: '', // Default fallback prompt
      deepResearch: false, // Default deep research setting
      search: false, // Default search setting
      model: LLMModelEnum.GPT4O_MINI, // Default model
    };

    // Create the final message object by merging defaults with provided input
    return   {
      ...defaultMessageValues, // Apply defaults first
      ...messageInput,         // Override defaults with provided values (prompt is guaranteed)
    };
 
  }

  /**
   * Receive and process workflow result messages from the WebSocket
   * @param result The workflow result data from the client
   * @returns The processed result or acknowledgment
   */
  validate(result: any): any {
    
  }
}