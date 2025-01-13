import { Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { ScenarioModule } from './scenario/scenario.module';
import { AiModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { PlansModule } from './plans/plans.module';
import { CreativeChatHubModule } from './creative-chat-hub/creative-chat-hub.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

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
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: AllExceptionsFilter,
  //   },
  // ],
})
export class AppModule implements NestModule {
  configure() {}
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(JwtDecodeMiddleware).forRoutes('*');
  // }
}
