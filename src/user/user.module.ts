import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
