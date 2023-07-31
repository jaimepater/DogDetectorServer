import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as process from 'process';
import { firebaseConfig } from '../config/firebase.key';
import { MulticastMessage } from 'firebase-admin/lib/messaging';

@Injectable()
export class FirebaseService {
  constructor() {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!privateKey || !projectId || !clientEmail) {
      console.error('Missing Firebase configuration in environment variables.');
      return;
    }

    const config = {
      ...firebaseConfig,
      projectId,
      clientEmail,
      privateKey,
    };
    console.log('config', config);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          ...config,
        }),
      });
    }
  }

  async sendEachForMulticast(message: MulticastMessage): Promise<void> {
    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.log('Error sending message:', error);
    }
  }
}
