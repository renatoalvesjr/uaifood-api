import { Global, Module } from '@nestjs/common';
import { PrismaService } from './psirma.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
