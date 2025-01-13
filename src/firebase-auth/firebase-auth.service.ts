import { Injectable } from '@nestjs/common';
import { auth } from 'firebase-admin';

@Injectable()
export class FirebaseAuthService {
  async verifyIdToken(token: string) {
    try {
      const decodedToken = await auth().verifyIdToken(token);
      return decodedToken;
    } catch {
      throw new Error('Unauthorized');
    }
  }
}
