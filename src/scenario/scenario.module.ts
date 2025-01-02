import { Module } from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { ScenarioController } from './scenario.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ScenarioService, PrismaService],
  controllers: [ScenarioController]
})
export class ScenarioModule {}
