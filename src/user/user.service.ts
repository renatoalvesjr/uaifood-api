/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser(id: string): string {
    return `This action returns a #${id} user`;
  }
}
