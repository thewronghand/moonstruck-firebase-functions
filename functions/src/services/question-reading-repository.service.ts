import { getFirestore } from 'firebase-admin/firestore';
import { SaveTarotReadingRequest, TarotReading } from '../types/tarot';

export class QuestionReadingRepositoryService {
  private static get db() {
    return getFirestore('moonstruck');
  }

  static async saveReading(data: SaveTarotReadingRequest): Promise<string> {
    try {
      const docRef = await this.db.collection('question-readings').add({
        ...data,
        createdAt: new Date().toISOString()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error saving question reading to repository:', error);
      throw error;
    }
  }

  static async getReading(readingId: string): Promise<TarotReading | null> {
    try {
      const doc = await this.db.collection('question-readings').doc(readingId).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      } as TarotReading;
    } catch (error) {
      console.error('Error fetching question reading from repository:', error);
      throw error;
    }
  }
}
