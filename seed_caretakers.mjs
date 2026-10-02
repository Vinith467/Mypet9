import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSilqMKh-o4hDj3jJ07H-bI4hs_AQSoLo",
  authDomain: "mypet9-d6f6e.firebaseapp.com",
  projectId: "mypet9-d6f6e",
  storageBucket: "mypet9-d6f6e.firebasestorage.app",
  messagingSenderId: "1055677962449",
  appId: "1:1055677962449:web:86b22755b7f0c7630e0df0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const getRandomImages = (count) => {
  const ids = [
    '1583337130417-3346a1be7dee', '1517849845537-4d257902454a', '1544568100-847a948585b9', '1548199973-03cce0bbc87b', '1552053831-71594a27632d',
    '1600607686527-6fb886090705', '1513694203232-719a280e022f', '1522708323590-d24dbb6b0267', '1505691938895-1758d7bef519', '1497369931818-f2b3b7720993',
    '1587764379873-97837921fd00', '1568564321589-328cc684db4a', '1576201836106-db1754def86a', '1541364983172-5a2aefdf38fa', '1554693165-1ce7433297ee'
  ];
  // Shuffle and pick
  const shuffled = ids.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`);
};

const getAvatar = (id) => `https://i.pravatar.cc/150?u=${id}`;

const caretakers = [
  {
    name: "Ramesh Kumar",
    email: "ramesh.k@example.com",
    password: "Password123!",
    location: { lat: 12.8160, lng: 77.6775 },
    address: "Bommasandra Industrial Area, Near Narayana Hrudayalaya, Bengaluru",
    price: 900
  },
  {
    name: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    password: "Password123!",
    location: { lat: 12.8028, lng: 77.7011 },
    address: "Surya City 1st Phase, Chandrapura, Bengaluru",
    price: 1100
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    password: "Password123!",
    location: { lat: 12.8185, lng: 77.6760 },
    address: "Kittaganahalli, Bommasandra, Bengaluru",
    price: 850
  },
  {
    name: "Amit Singh",
    email: "amit.singh@example.com",
    password: "Password123!",
    location: { lat: 12.7980, lng: 77.7050 },
    address: "Chandrapura Circle, Anekal Road, Bengaluru",
    price: 1250
  },
  {
    name: "Divya Raj",
    email: "divya.raj@example.com",
    password: "Password123!",
    location: { lat: 12.8200, lng: 77.6800 },
    address: "RS Gardens, Bommasandra, Bengaluru",
    price: 1000
  },
  {
    name: "Karthik N",
    email: "karthik.n@example.com",
    password: "Password123!",
    location: { lat: 12.7950, lng: 77.6990 },
    address: "Muthanallur Cross, Chandrapura, Bengaluru",
    price: 1500
  },
  {
    name: "Kavitha M",
    email: "kavitha.m@example.com",
    password: "Password123!",
    location: { lat: 12.8100, lng: 77.6850 },
    address: "Veerasandra, Electronic City Phase 2 border, Bommasandra",
    price: 950
  },
  {
    name: "Rakesh V",
    email: "rakesh.v@example.com",
    password: "Password123!",
    location: { lat: 12.8050, lng: 77.7100 },
    address: "Hennagara Road, Chandrapura, Bengaluru",
    price: 800
  },
  {
    name: "Pooja Desai",
    email: "pooja.desai@example.com",
    password: "Password123!",
    location: { lat: 12.8120, lng: 77.6700 },
    address: "Jigani Link Road, Bommasandra, Bengaluru",
    price: 1300
  },
  {
    name: "Santosh Kumar",
    email: "santosh.k@example.com",
    password: "Password123!",
    location: { lat: 12.7900, lng: 77.7000 },
    address: "Kamakshi Layout, Chandrapura, Bengaluru",
    price: 1050
  }
];

const seedCaretakers = async () => {
  console.log("Starting seed process...");
  
  for (let i = 0; i < caretakers.length; i++) {
    const data = caretakers[i];
    try {
      console.log(`Creating user ${data.email}...`);
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const uid = userCredential.user.uid;
      
      // 2. Generate random profile data
      const reviewCount = Math.floor(Math.random() * 50) + 1;
      const rating = (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1);
      const experience = Math.floor(Math.random() * 8) + 2;
      const images = getRandomImages(Math.floor(Math.random() * 2) + 5); // 5 to 6 images
      
      // 3. Save to caretakers collection
      const profile = {
        name: data.name,
        email: data.email,
        phone: "+91" + Math.floor(1000000000 + Math.random() * 9000000000), // Random 10 digit Indian number
        address: data.address,
        location: data.location, // geo coordinates
        locationStr: data.address,
        price: data.price,
        rating: parseFloat(rating),
        reviews: reviewCount,
        experience: experience,
        photo: getAvatar(uid),
        images: images,
        bio: `Hi, I am ${data.name}. I have been a pet lover for over ${experience} years. I have a spacious home in ${data.address.split(',')[0]} and I treat every pet like my own. Your pet will enjoy a safe and friendly environment with me!`,
        services: ["Pickup & Drop Service", "Vaccination Assistance", "Grooming Available", "24/7 Supervision"].sort(() => 0.5 - Math.random()).slice(0, 3),
        facilities: ["Indoor Space", "Outdoor Play Area", "Meals Included", "Daily Walks", "Photo Updates"].sort(() => 0.5 - Math.random()).slice(0, 4),
        suitableFor: ["Small Dogs", "Medium Dogs", "Large Dogs", "Cats", "Multiple Pets"].sort(() => 0.5 - Math.random()).slice(0, 3),
        isVerified: true,
        type: "caretaker",
        createdAt: new Date()
      };

      await setDoc(doc(db, "caretakers", uid), profile);
      
      // Also save to users collection as a caretaker
      await setDoc(doc(db, "users", uid), {
        name: data.name,
        email: data.email,
        phone: profile.phone,
        type: "caretaker",
        createdAt: new Date(),
        onboardingComplete: true
      });

      console.log(`Successfully seeded ${data.name} (UID: ${uid})`);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        console.log(`Skipping ${data.email}, already exists.`);
      } else {
        console.error(`Error creating ${data.name}:`, err.message);
      }
    }
  }
  
  console.log("Seeding complete! You can now log in with the following credentials:");
  caretakers.forEach(c => console.log(`${c.email} / ${c.password}`));
  process.exit();
};

seedCaretakers();
