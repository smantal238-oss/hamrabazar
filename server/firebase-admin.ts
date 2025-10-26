import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    readFileSync(join(process.cwd(), 'hamrabazzar-firebase-adminsdk-fbsvc-ab8238a471.json'), 'utf8')
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'hamrabazzar'
  });
}

export const auth = admin.auth();
export const firestore = admin.firestore();
export default admin;