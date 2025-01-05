import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { UserUtils, FirebaseUserInfo } from 'src/utils/user-utils';

@Controller('auth')
export class AuthController {
  @UseGuards(FirebaseAuthGuard)
  @Get('/info')
  async auth(@Req() req) {
    const userUtils: UserUtils = req.userUtils;
    const userInfo: FirebaseUserInfo = userUtils.getUserInfo();

    return userInfo;
  }
}
