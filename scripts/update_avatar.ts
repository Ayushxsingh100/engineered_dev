import { getApps, initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, query, orderBy, limit } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env.local");
const env: Record<string, string> = {};

if (fs.existsSync(envPath)) {
  const envStr = fs.readFileSync(envPath, "utf8");
  envStr.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim().replace(/^"|"$/g, "");
  });
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function updateAvatar() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const db = getFirestore(app);

  try {
    // 1. Get the latest post
    const q = query(collection(db, "posts"), orderBy("updatedAt", "desc"), limit(10));
    const snap = await getDocs(q);
    let latestCoverUrl = "";

    snap.forEach((docSnap) => {
      if (!latestCoverUrl && docSnap.data().coverImageUrl) {
        latestCoverUrl = docSnap.data().coverImageUrl;
      }
    });

    if (!latestCoverUrl) {
      console.log("No cover image found in recent posts!");
      return;
    }

    console.log("Found cover image URL:", latestCoverUrl);

    // 2. Get the users
    const usersSnap = await getDocs(collection(db, "users"));
    if (usersSnap.empty) {
      console.log("No users found in database!");
      return;
    }

    for (const userDoc of usersSnap.docs) {
      console.log(`Updating avatar for user: ${userDoc.data().email} (${userDoc.id})`);
      await updateDoc(doc(db, "users", userDoc.id), {
        avatarUrl: latestCoverUrl,
      });
      console.log("Avatar updated successfully!");
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error:", error.message);
  }
}

updateAvatar().catch(console.error);
