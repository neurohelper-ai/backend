import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get('/upgrade/:planId')
  @UseGuards(FirebaseAuthGuard)
  async upgradePlan(@Req() req, @Param('planId') planId: string) {
    const userUtils = req.userUtils;

    return await this.plansService.upgradePlan(userUtils, planId);
  }
}
