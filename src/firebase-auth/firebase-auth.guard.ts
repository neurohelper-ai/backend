import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FirebaseAuthService } from './firebase-auth.service';
import { auth } from 'firebase-admin';

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
      console.log(this.firebaseAuthService);
      let decodedToken: any = '';
      try {
        decodedToken = await auth().verifyIdToken(token);
      } catch {
        throw new Error('Unauthorized');
      }
      // const user = await this.firebaseAuthService.verifyIdToken(token);
      request.user = decodedToken;
      return true;
    }
    return false;
  }
}
