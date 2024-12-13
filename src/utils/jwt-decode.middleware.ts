import { Injectable, NestMiddleware } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Invalid JWT:', error);
    return null;
  }
}

@Injectable()
export class JwtDecodeMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const user = parseJWT(token);
      let userRec;
      userRec = await this.prismaService.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (!userRec) {
        userRec = await this.prismaService.user.create({
          data: {
            email: user.email,
          },
        });
      }

      req['user'] = userRec as User; // Attach user data to the request
    }
    next();
  }
}
