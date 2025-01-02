import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable()
export class FirebaseAuthGuard
  extends AuthGuard('firebase-jwt')
  implements CanActivate
{
  constructor(private readonly firebaseAuthService: FirebaseAuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split('Bearer ')[1];
    if (token) {
      const user = await this.firebaseAuthService.verifyIdToken(token);
      request.user = user;
      return true;
    }
    return false;
  }
}
