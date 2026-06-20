import { Module } from '@nestjs/common';
import { ScaffoldController } from './scaffold.controller';
import { ScaffoldService } from './scaffold.service';

@Module({
  controllers: [ScaffoldController],
  providers: [ScaffoldService],
})
export class ScaffoldModule {}
