import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module'; // Import the module containing UserService
import { ScenarioModule } from 'src/scenario/scenario.module'; // Import the module containing ScenarioService

@Module({
  imports: [UserModule, ScenarioModule], // Add the imported module here
  controllers: [AiController],
  providers: [AiService, PrismaService],
})
export class AiModule {}
