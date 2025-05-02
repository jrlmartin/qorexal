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

@WebSocketGateway({
  cors: { origin: '*' }, // For local development
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly llmService: LLMService) {}
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

  @SubscribeMessage('fromExtension')
  handleFromExtension(client: any, payload: any): void {
    console.log('Received from extension:', payload);
  }

  /**
   * Broadcast a message/event to all connected WebSocket clients
   */
  broadcastEvent(eventType: string, data: any) {
    const message = this.llmService.prep(data);
    this.server.emit(eventType, message);
  }
}