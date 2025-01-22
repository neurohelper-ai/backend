import * as admin from 'firebase-admin';

export type Subscription = {
  createdAt: FirebaseFirestore.Timestamp;
  creditsLeft: number;
  creditsResetOn: FirebaseFirestore.Timestamp;
  isActive: boolean;
  planId: string;
  updatedAt: FirebaseFirestore.Timestamp;
  userId: string;
};

export type Plan = {
  createdAt: FirebaseFirestore.Timestamp;
  credits: number;
  features: string[];
  isActive: boolean;
  name: string;
  updatedAt: FirebaseFirestore.Timestamp;
  usdPrice: number;
  type: string;
};

export type FirebaseUserInfo = {
  subscriptionId: string;
  subscription?: Subscription;
  plan?: Plan;
};

export class UserUtils {
  private userId: string;
  private userInfo: FirebaseUserInfo;

  constructor(userId: string) {
    this.userId = userId;
  }

  async init() {
    const userDoc = await admin
      .firestore()
      .collection('users')
      .doc(this.userId)
      .get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    this.userInfo = userDoc.data() as any;

    const subscriptionDoc = await admin
      .firestore()
      .collection('subscriptions')
      .doc(this.userInfo.subscriptionId)
      .get();
    if (!subscriptionDoc.exists) {
      throw new Error('Subscription not found');
    }
    this.userInfo.subscription = subscriptionDoc.data() as Subscription;

    const planDoc = await admin
      .firestore()
      .collection('plans')
      .doc(this.userInfo.subscription.planId)
      .get();
    if (!planDoc.exists) {
      throw new Error('Plan not found');
    }
    this.userInfo.plan = planDoc.data() as Plan;
  }

  getUserInfo() {
    return this.userInfo;
  }

  async addTokens(amount: number) {
    const subscriptionRef = admin
      .firestore()
      .collection('subscriptions')
      .doc(this.userInfo.subscriptionId);
    await subscriptionRef.update({
      creditsLeft: admin.firestore.FieldValue.increment(amount),
    });
    this.userInfo.subscription.creditsLeft += amount;
  }

  async removeTokens(amount: number) {
    const subscriptionRef = admin
      .firestore()
      .collection('subscriptions')
      .doc(this.userInfo.subscriptionId);
    await subscriptionRef.update({
      creditsLeft: admin.firestore.FieldValue.increment(-amount),
    });
    this.userInfo.subscription.creditsLeft -= amount;
  }

  async updateSubscription(planId: string, credits: number) {
    const subscriptionRef = admin
      .firestore()
      .collection('subscriptions')
      .doc(this.userInfo.subscriptionId);

    const updatedAt = admin.firestore.FieldValue.serverTimestamp();
    const creditsResetOn = admin.firestore.Timestamp.now();

    await subscriptionRef.update({
      planId,
      creditsLeft: credits,
      creditsResetOn,
      updatedAt,
    });

    this.userInfo.subscription.planId = planId;
    this.userInfo.subscription.creditsLeft = credits;
    this.userInfo.subscription.creditsResetOn = creditsResetOn;
    this.userInfo.subscription.updatedAt = updatedAt as any;
  }
}
