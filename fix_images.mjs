import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSilqMKh-o4hDj3jJ07H-bI4hs_AQSoLo",
  authDomain: "mypet9-d6f6e.firebaseapp.com",
  projectId: "mypet9-d6f6e",
  storageBucket: "mypet9-d6f6e.firebasestorage.app",
  messagingSenderId: "1055677962449",
  appId: "1:1055677962449:web:86b22755b7f0c7630e0df0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// These are known working Unsplash IDs for dogs and interiors
const reliableImages = [
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800"
];

const fixImages = async () => {
  console.log("Starting image fix process...");
  
  const querySnapshot = await getDocs(collection(db, "caretakers"));
  
  for (const docSnapshot of querySnapshot.docs) {
    const data = docSnapshot.data();
    
    // Only fix profiles that don't have proper locationSettings (our seeded ones)
    // Or just fix all of them that have pravatar or unsplash
    let needsUpdate = false;
    let updates = {};

    if (data.photo && data.photo.includes("pravatar")) {
      updates.photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&color=fff&size=150`;
      needsUpdate = true;
    }

    if (data.images && data.images.length > 0) {
      // Create a fresh batch of 5-6 reliable images
      const shuffled = [...reliableImages].sort(() => 0.5 - Math.random());
      updates.images = shuffled.slice(0, Math.floor(Math.random() * 2) + 5);
      needsUpdate = true;
    }

    if (needsUpdate) {
      await updateDoc(doc(db, "caretakers", docSnapshot.id), updates);
      console.log(`Updated images for ${data.name} (UID: ${docSnapshot.id})`);
    }
  }
  
  console.log("Fix complete!");
  process.exit();
};

fixImages();
