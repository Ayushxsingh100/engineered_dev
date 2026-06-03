import { getApps, initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, query, orderBy, limit } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

const envStr = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
const env: any = {};
envStr.split("\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim().replace(/^"|"$/g, "");
});

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function updateAvatar() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const db = getFirestore(app);

  try {
    // 1. Get the latest post
    const q = query(collection(db, "posts"), orderBy("updatedAt", "desc"), limit(10));
    const snap = await getDocs(q);
    let latestCoverUrl = "";
    
    snap.forEach(doc => {
      if (!latestCoverUrl && doc.data().coverImageUrl) {
        latestCoverUrl = doc.data().coverImageUrl;
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
        avatarUrl: latestCoverUrl
      });
      console.log("Avatar updated successfully!");
    }

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

updateAvatar().catch(console.error);
