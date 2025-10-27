import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('hello')
  // hello(): string {
  //   return 'rello';
  // }

  @Post()
  say(@Param('message') message: string): string {
    return this.appService.say(message);
  }
}
