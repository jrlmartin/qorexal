import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly gateway: AppGateway,
    ) {}

  @Get()
  getHello(): object {
    this.gateway.broadcastEvent('qorexalEvent', { message: 'Trigger DOM manipulation hello' });
    console.log('Trigger DOM manipulation hello');
    return { message: this.appService.getHello() };
  }
}