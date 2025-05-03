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
 
import { LLMModelEnum } from './util/llm.service';
import { TopDogV1Workflow } from './workflows/topDogV1/topDogV1.workflow';

@WebSocketGateway({
  cors: { origin: '*' }, // For local development
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly llmService: LLMService,
    private readonly topDogV1Workflow: TopDogV1Workflow,
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

  async broadCastTopDogV1() {
    const message = await this.topDogV1Workflow.process();



   // this.server.emit('processLLMEvent', message);
  }










  /**
   * Broadcast a message/event to all connected WebSocket clients
   */
  async broadcastEvent() {
    const prompt = await this.topDogV1Workflow.process();


 
   
  }
}
