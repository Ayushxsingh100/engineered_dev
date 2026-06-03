// Script to list all users in Firestore and check roles
import { getApps, initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function checkUsers() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const db = getFirestore(app);

  try {
    const snap = await getDocs(collection(db, "users"));
    console.log("Total users found:", snap.size);
    snap.forEach(doc => {
      const data = doc.data();
      console.log(`User UID: ${doc.id}`);
      console.log(`- Email: ${data.email}`);
      console.log(`- Role: ${data.role}`);
    });
  } catch (err: any) {
    console.error("Error fetching users:", err.message);
  }
}

checkUsers().catch(console.error);
