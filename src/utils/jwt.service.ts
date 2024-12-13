import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  decodeToken(token: string): any {
    try {
      return jwt.decode(token); // This decodes the token without verifying it
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }
}
