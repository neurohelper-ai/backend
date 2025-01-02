import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { ScenarioModule } from './scenario/scenario.module';
import { AiModule } from './ai/ai.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { JwtDecodeMiddleware } from './utils/jwt-decode.middleware';
import { ConfigModule } from '@nestjs/config';

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
    UserModule,
  ],
  controllers: [],
  providers: [UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtDecodeMiddleware).forRoutes('*');
  }
}
