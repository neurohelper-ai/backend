import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './firebase-auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Module({
  imports: [],
  providers: [FirebaseAuthService, FirebaseAuthGuard],
  controllers: [],
})
export class FirebaseAuthModule {}
