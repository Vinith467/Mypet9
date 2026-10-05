const fs = require('fs');

const maleNames = ['Rahul', 'Amit', 'Vikram', 'Suresh', 'Karthik', 'Ravi', 'Arjun', 'Rohit', 'Sanjay', 'Prakash', 'Rajesh', 'Anil', 'Sunil', 'Vijay', 'Manoj', 'Deepak', 'Naveen', 'Prashant', 'Ashwin', 'Gaurav', 'Manish', 'Siddharth', 'Nitin', 'Harish', 'Rakesh'];
const femaleNames = ['Priya', 'Sneha', 'Divya', 'Kavitha', 'Pooja', 'Anjali', 'Swati', 'Shruti', 'Neha', 'Shweta', 'Anita', 'Sunita', 'Rekha', 'Meena', 'Asha', 'Deepa', 'Geeta', 'Nandini', 'Rashmi', 'Kiran', 'Shilpa', 'Aarti', 'Kirti', 'Megha', 'Priyanka'];
const lastNames = ['Sharma', 'Reddy', 'Singh', 'Kumar', 'Patil', 'Desai', 'Joshi', 'Nair', 'Menon', 'Rao', 'Iyer', 'Pillai', 'Verma', 'Gupta', 'Choudhary', 'Das', 'Mukherjee', 'Banerjee', 'Bose', 'Gowda', 'Shetty', 'Hegde', 'Kulkarni', 'Deshpande', 'Mishra'];

const locations = [
  { area: 'BTM Layout', baseLat: 12.9165, baseLng: 77.6101, addresses: ['BTM 1st Stage', 'BTM 2nd Stage', 'BTM 4th Phase', 'Tavarekere, BTM', 'Madiwala, BTM Layout'] },
  { area: 'Whitefield', baseLat: 12.9698, baseLng: 77.7499, addresses: ['Brookefield, Whitefield', 'Kundalahalli, Whitefield', 'Nallurhalli, Whitefield', 'Hope Farm Junction', 'Kadugodi, Whitefield'] },
  { area: 'Sarjapur', baseLat: 12.9226, baseLng: 77.6749, addresses: ['Sarjapur Road', 'Bellandur, Sarjapur Road', 'Carmelaram, Sarjapur', 'Kaikondrahalli', 'Kasavanahalli, Sarjapur Road'] },
  { area: 'Yelahanka', baseLat: 13.1007, baseLng: 77.5963, addresses: ['Yelahanka New Town', 'Yelahanka Old Town', 'Jakkur, Yelahanka', 'Sahakar Nagar', 'Vidyaranyapura'] },
  { area: 'Marathahalli', baseLat: 12.9569, baseLng: 77.7011, addresses: ['Marathahalli Village', 'Munnekollal, Marathahalli', 'AECS Layout, Marathahalli', 'Spice Garden Layout', 'Doddanekundi, Marathahalli'] }
];

let caretakers = [];
let emailCounter = 1;

for (let loc of locations) {
  for (let i = 0; i < 10; i++) {
    const isMale = Math.random() > 0.5;
    const firstName = isMale ? maleNames[Math.floor(Math.random() * maleNames.length)] : femaleNames[Math.floor(Math.random() * femaleNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = firstName + ' ' + lastName;
    const genderStr = isMale ? 'men' : 'women';
    const picId = Math.floor(Math.random() * 99) + 1;
    const photo = `https://randomuser.me/api/portraits/${genderStr}/${picId}.jpg`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${loc.area.split(' ')[0].toLowerCase()}${emailCounter++}@example.com`;
    const lat = loc.baseLat + (Math.random() - 0.5) * 0.02;
    const lng = loc.baseLng + (Math.random() - 0.5) * 0.02;
    const address = loc.addresses[Math.floor(Math.random() * loc.addresses.length)] + ', Bengaluru';
    const price = Math.floor(Math.random() * 10 + 6) * 100; // 600 to 1500

    caretakers.push({ name, email, password: 'Password123!', photo, location: { lat, lng }, address, price });
  }
}

fs.writeFileSync('generated_caretakers.json', JSON.stringify(caretakers, null, 2));
