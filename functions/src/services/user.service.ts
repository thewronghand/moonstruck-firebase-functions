import { getFirestore, FieldValue } from 'firebase-admin/firestore';

interface UserData {
  dailyCredits: number;
  lastCreditRefresh: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

interface UserInfo
  extends Omit<UserData, 'lastCreditRefresh' | 'createdAt' | 'updatedAt'> {
  uid: string;
  lastCreditRefresh: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export class UserService {
  static async saveUser(uid: string): Promise<void> {
    const db = getFirestore('moonstruck');
    const userRef = db.collection('users').doc(uid);

    try {
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists) {
          const userData = {
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            dailyCredits: 3,
            lastCreditRefresh: FieldValue.serverTimestamp(),
          };

          transaction.set(userRef, userData);
        }
      });
    } catch (error) {
      console.error('Error in saveUser:', error);
      throw new Error('Failed to save user data');
    }
  }

  static async getUserInfo(uid: string): Promise<UserInfo> {
    const db = getFirestore('moonstruck');

    try {
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        await this.saveUser(uid);
        return this.getUserInfo(uid);
      }

      const userData = userDoc.data() as UserData;

      return {
        uid,
        ...userData,
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error('Failed to fetch user info');
    }
  }
}
