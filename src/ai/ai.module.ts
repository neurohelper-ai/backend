import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ScenarioService } from 'src/scenario/scenario.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AiController],
  providers: [AiService, ScenarioService, PrismaService]
})
export class AiModule {}
