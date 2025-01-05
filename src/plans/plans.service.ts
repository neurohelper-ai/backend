import { Injectable } from '@nestjs/common';
import { Plan, UserUtils } from 'src/utils/user-utils';
import * as admin from 'firebase-admin';

@Injectable()
export class PlansService {
  async upgradePlan(userUtils: UserUtils, planId: string) {
    await userUtils.init();

    const planDoc = await admin
      .firestore()
      .collection('plans')
      .doc(planId)
      .get();

    if (!planDoc.exists) {
      return { ok: false, error: 'Plan not found' };
    }

    const plan = planDoc.data() as Plan;
    await userUtils.updateSubscription(planId, plan.credits);

    return { ok: true };
  }
}
