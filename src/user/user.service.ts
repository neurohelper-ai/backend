import { Injectable } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async withdraw(id: string, amount: number) {
    await this.prismaService.user.update({
      where: { id },
      data: {
        tokens: {
          decrement: amount,
        },
      },
    });
  }

  async getPlans() {
    return await this.prismaService.plan.findMany();
  }

  async getActivePlans(userId: string) {
    const subscriptions = await this.prismaService.subscription.findMany({
      where: { userId, status: SubscriptionStatus.ACTIVE },
    });

    return await this.prismaService.plan.findMany({
      where: {
        id: {
          in: subscriptions.map((sub) => sub.planId),
        },
      },
    });
  }

  async buyPlan(userId: string, planId: string) {
    const plan = await this.prismaService.plan.findUnique({
      where: { id: planId },
    });
    if (!plan) {
      throw new Error('Plan not found');
    }
    await this.prismaService.subscription.create({
      data: {
        userId,
        planId,
        status: SubscriptionStatus.ACTIVE,
      },
    });
  }
}
