import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LLMService } from './util/llm.service';
import { WorkFlowService } from './workflow.service';
import { LLMModelEnum } from './util/llm.service';

@WebSocketGateway({
  cors: { origin: '*' }, // For local development
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly llmService: LLMService,
    private readonly workflowService: WorkFlowService,
  ) {}
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized');
  }

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('workflowResult')
  handleFromExtension(client: any, payload: any): void {
    console.log('Received from extension:', payload);
    const obj = JSON.parse(payload.response);
    console.log('Received from extension:', obj);
  }

  /**
   * Broadcast a message/event to all connected WebSocket clients
   */
  async broadcastEvent() {
    const prompt = await this.workflowService.TopDog();

    const message = this.llmService.prep({
      prompt,
      fallbackPrompt: null,
      model: LLMModelEnum.O1PRO,
      search: false,
      deepResearch: false,
    });

    console.log('message', message); 
    this.server.emit('processLLMEvent', message);
  }
}
