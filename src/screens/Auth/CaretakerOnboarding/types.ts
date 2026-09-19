export interface CaretakerFormData {
  // Step 1: Sign Up
  authMethod: string;
  
  // Step 2: Basic Information
  firstName: string;
  registeringAs: 'Individual' | 'Business';
  
  // Step 3: Contact Details
  phone: string;
  whatsapp: string;
  email: string;
  
  // Step 4: Experience & Address
  experienceYears: string;
  address: string;
  
  // Step 5: Services & Pets You Board
  services: {
    homeStay: boolean;
    boarding: boolean;
  };
  acceptedPets: {
    dogs: boolean;
    cats: boolean;
    birds: boolean;
    rabbits: boolean;
    others: boolean;
  };
  dogSize: {
    small: boolean;
    medium: boolean;
    large: boolean;
  };
  
  // Step 6: Facility Details
  homeType: string;
  spaceAvailable: string;
  outdoorAccess: string;
  maxPets: string;
  safetyFeatures: {
    secureBalcony: boolean;
    fencedArea: boolean;
    separateRoom: boolean;
    supervision247: boolean;
  };
  
  // Step 7: Photos of Facility
  photos: string[]; // Cloudinary URLs
  
  // Step 8: KYC Documents
  kyc: {
    aadhaar: string;
    addressProof: string;
    pan: string;
    photo: string;
  };
  
  // Step 9: Additional Information
  remarks: string;
  specialFacilities: {
    dedicatedRoom: boolean;
    playArea: boolean;
    garden: boolean;
    grooming: boolean;
    homeCooked: boolean;
    medication: boolean;
    cctv: boolean;
    other: boolean;
  };
  
  termsAccepted: boolean;
}

export const INITIAL_FORM_DATA: CaretakerFormData = {
  authMethod: '',
  firstName: '',
  registeringAs: 'Individual',
  phone: '',
  whatsapp: '',
  email: '',
  experienceYears: '3 - 5 years',
  address: '',
  services: { homeStay: false, boarding: false },
  acceptedPets: { dogs: false, cats: false, birds: false, rabbits: false, others: false },
  dogSize: { small: false, medium: false, large: false },
  homeType: 'Apartment',
  spaceAvailable: 'Spacious room + Balcony',
  outdoorAccess: 'Not available',
  maxPets: 'Up to 3 pets',
  safetyFeatures: { secureBalcony: false, fencedArea: false, separateRoom: false, supervision247: false },
  photos: [],
  kyc: { aadhaar: '', addressProof: '', pan: '', photo: '' },
  remarks: '',
  specialFacilities: { dedicatedRoom: false, playArea: false, garden: false, grooming: false, homeCooked: false, medication: false, cctv: false, other: false },
  termsAccepted: false
};
