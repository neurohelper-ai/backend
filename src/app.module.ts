import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { ScenarioModule } from './scenario/scenario.module';
import { AiModule } from './ai/ai.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { FirebaseAuthModule } from './firebase-auth/firebase-auth.module';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { JwtDecodeMiddleware } from './utils/jwt-decode.middleware';

@Module({
  imports: [
    PrismaModule,
    CategoryModule,
    AuthModule,
    ScenarioModule,
    AiModule,
    UserModule,
    FirebaseAuthModule,
  ],
  controllers: [],
  providers: [UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtDecodeMiddleware).forRoutes('*');
  }
}
