import * as admin from 'firebase-admin';

export type FirebaseUserInfo = {
  tokens: number;
  plan: string;
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
  }

  getUserInfo() {
    return this.userInfo;
  }

  async addTokens(amount: number) {
    const userRef = admin.firestore().collection('users').doc(this.userId);
    await userRef.update({
      tokens: admin.firestore.FieldValue.increment(amount),
    });
    this.userInfo.tokens += amount;
  }

  async removeTokens(amount: number) {
    const userRef = admin.firestore().collection('users').doc(this.userId);
    await userRef.update({
      tokens: admin.firestore.FieldValue.increment(-amount),
    });
    this.userInfo.tokens -= amount;
  }
}
