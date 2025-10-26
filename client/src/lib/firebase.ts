import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAIMyhXVa8j2BnDi9mvJ1v_vsjqSwp-m1c",
  authDomain: "hamrabazzar.firebaseapp.com",
  projectId: "hamrabazzar",
  storageBucket: "hamrabazzar.appspot.com",
  messagingSenderId: "468709638839",
  appId: "1:468709638839:web:hamrabazzar"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
