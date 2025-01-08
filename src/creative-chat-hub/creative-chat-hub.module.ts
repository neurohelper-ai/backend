import { Module } from '@nestjs/common';
import { CreativeChatHubService } from './creative-chat-hub.service';
import { CreativeChatHubController } from './creative-chat-hub.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CreativeChatHubController],
  providers: [CreativeChatHubService],
  imports: [PrismaModule],
})
export class CreativeChatHubModule {}
