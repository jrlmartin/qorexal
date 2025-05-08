import { Controller, Get, Query } from '@nestjs/common';
import { TopDogV2Workflow } from './workflows/topDogV2/workflow.service';
@Controller()
export class AppController {
  constructor(
    private readonly topDogV2Workflow: TopDogV2Workflow,
  ) {}

  @Get()
  async test(@Query('query') query: string = ''): Promise<any> {
    // this.gateway.broadcastEvent();

    const data = await this.topDogV2Workflow.process({});
    return data;
  }
}
