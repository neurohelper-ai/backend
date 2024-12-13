import { Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(@Req() req) {
    return req.user;
  }

  @Get('plans')
  getPlans() {
    return this.userService.getPlans();
  }

  @Get('plans/active')
  getActivePlans(@Req() req) {
    return this.userService.getActivePlans(req.user.id);
  }

  @Post('plans/buy')
  buyPlan(@Req() req) {
    return this.userService.buyPlan(req.user.id, req.body.planId);
  }
}
