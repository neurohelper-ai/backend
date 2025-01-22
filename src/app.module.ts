import { Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { ScenarioModule } from './scenario/scenario.module';
import { AiModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { PlansModule } from './plans/plans.module';
import { CreativeChatHubModule } from './creative-chat-hub/creative-chat-hub.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CategoryModule,
    AuthModule,
    ScenarioModule,
    AiModule,
    PlansModule,
    CreativeChatHubModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure() {}
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(JwtDecodeMiddleware).forRoutes('*');
  // }
}
