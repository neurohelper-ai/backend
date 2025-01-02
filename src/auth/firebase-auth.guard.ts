import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as serviceAccount from 'serviceAccountKey.json';
import { UserUtils } from '../utils/user-utils';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authorization.split(' ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      request.user = decodedToken;
      const userUtils = new UserUtils(decodedToken.uid);
      await userUtils.init();
      request.userUtils = userUtils;
      console.log(request.user, request.userUtils.getUserInfo()); //{ tokens: 0, plan: 'free' }
      return true;
    } catch (_) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
