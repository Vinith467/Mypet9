import React, { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, ChevronRight, ClipboardList, RefreshCcw, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PetHomestayPartnerFormScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const initialFormState = {
    // 1. Partner Details
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    area: '',
    heardAbout: [] as string[],
    otherHeardAbout: '',

    // 2. About You
    currentJob: [] as string[],
    otherJob: '',
    hasPets: '',
    petName: '',
    petBreed: '',
    petAge: '',
    caredForOtherPet: '',
    providedHomestayBefore: '',
    homestayDuration: '',
    petsCaredForCount: '',

    // 3. Your Home / Homestay
    propertyType: [] as string[],
    otherPropertyType: '',
    ownOrRent: '',
    spaceAvailable: [] as string[],
    otherSpaceAvailable: '',
    spaceSize: '',
    balcony: '',
    terrace: '',
    garden: '',
    petProofed: '',
    gatedSociety: '',
    societyAllowsPets: '',

    // 4. Existing Facilities
    facilitiesProvided: [] as string[],
    otherFacility: '',
    separateSpaceForUnfriendly: '',
    petEquipment: [] as string[],
    otherEquipment: '',

    // 5. Pets You Can Accommodate
    petsComfortableHosting: [] as string[],
    otherPetsComfortable: '',
    notComfortableBreeds: '',
    maxPets: '',
    multipleFamilies: '',

    // 6. Services You Can Provide
    servicesProvided: [] as string[],
    otherService: '',
    followFeedingInstructions: '',
    administerMedication: '',
    specialNeeds: '',
    providePhotosVideos: '',
    provideDailyReport: '',

    // 7. Availability
    availability: [] as string[],
    advanceNotice: [] as string[],
    otherAdvanceNotice: '',
    maxDuration: [] as string[],

    // 8. Pricing
    pricePerNight: '',
    priceChangeBasedOnSize: '',
    extraChargeForServices: '',
    extraServicesDetails: '',

    // 9. Safety & Verification
    verifyIdentity: '',
    submitKYC: '',
    teamVisit: '',
    photosVideosProfile: '',
    parentsViewProfile: '',

    // 10. Your Motivation
    motivation: [] as string[],
    otherMotivation: '',
    goodCaretakerReason: '',
    enjoyTakingCareOf: '',
    concernsDifficulties: '',
    expectSupport: [] as string[],
    otherSupport: '',

    // 11. Final Partner Information
    whyChooseHome: '',
    remarks: '',
    signature: '',
    date: '',
    myPet9Remarks: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: keyof typeof initialFormState, item: string) => {
    setFormData(prev => {
      const array = prev[key] as string[];
      if (array.includes(item)) {
        return { ...prev, [key]: array.filter(i => i !== item) };
      } else {
        return { ...prev, [key]: [...array, item] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'field_leads_caretakers'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData(initialFormState);
        window.scrollTo(0, 0);
      }, 2500);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const MultiSelectCheckbox = ({ label, field, options, otherField }: { label: string, field: keyof typeof initialFormState, options: string[], otherField?: string }) => (
    <div className="mb-6">
      <label className="block text-[14px] font-bold text-[#1B2B48] mb-3">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-3 p-3 border border-gray-200 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors">
            <input 
              type="checkbox" 
              checked={(formData[field] as string[]).includes(opt)}
              onChange={() => toggleArrayItem(field, opt)}
              className="w-4 h-4 text-[#007672] rounded border-gray-300 focus:ring-[#007672]"
            />
            <span className="text-[13px] text-[#465E87]">{opt}</span>
          </label>
        ))}
      </div>
      {otherField && (
        <div className="mt-3 flex items-center gap-3 p-3 border border-gray-200 rounded-[10px]">
          <input 
            type="checkbox" 
            checked={(formData[field] as string[]).includes('Other')}
            onChange={() => toggleArrayItem(field, 'Other')}
            className="w-4 h-4 text-[#007672] rounded border-gray-300 focus:ring-[#007672]"
          />
          <span className="text-[13px] text-[#465E87] whitespace-nowrap">Other:</span>
          <input 
            type="text"
            value={formData[otherField as keyof typeof formData] as string}
            onChange={(e) => updateForm(otherField, e.target.value)}
            disabled={!(formData[field] as string[]).includes('Other')}
            className="flex-1 bg-transparent border-b border-gray-300 focus:border-[#007672] outline-none text-[13px] disabled:opacity-50"
            placeholder="Please specify"
          />
        </div>
      )}
    </div>
  );

  const RadioGroup = ({ label, field, options }: { label: string, field: string, options: string[] }) => (
    <div className="mb-6">
      <label className="block text-[14px] font-bold text-[#1B2B48] mb-3">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-[10px] cursor-pointer">
            <input 
              type="radio" 
              name={field} 
              checked={formData[field as keyof typeof formData] === opt} 
              onChange={() => updateForm(field, opt)} 
              className="w-4 h-4 text-[#007672]" 
            />
            <span className="text-[13px]">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen bg-[#F0F9F9] flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full text-center">
          <CheckCircle2 size={64} className="text-[#10B981] mb-4" />
          <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-2">Saved Successfully!</h2>
          <p className="text-[#465E87] mb-6">The Homestay Partner lead has been recorded.</p>
          <p className="text-[12px] text-gray-500 animate-pulse">Loading new form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-[16px] md:text-lg font-extrabold text-[#1B2B48] truncate">Homestay Partner Form</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/join/parent')}
              className="flex items-center gap-2 bg-white border border-[#007672] text-[#007672] px-3 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
            >
              <RefreshCcw size={16} />
              <span className="hidden sm:inline">Switch to Parent</span>
            </button>
            <button 
              onClick={() => navigate('/join/history')}
              className="w-10 h-10 bg-[#E8F3F3] rounded-full flex items-center justify-center text-[#007672] hover:bg-[#d1e8e8] transition-colors shadow-sm shrink-0"
              title="View History"
            >
              <ClipboardList size={20} />
            </button>
            <button 
              onClick={() => navigate('/join/analytics')}
              className="w-10 h-10 bg-[#E8F3F3] rounded-full flex items-center justify-center text-[#007672] hover:bg-[#d1e8e8] transition-colors shadow-sm shrink-0"
              title="View Analytics"
            >
              <BarChart3 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          
          <h2 className="text-xl font-extrabold text-[#007672] mb-6 border-b pb-2">1. Partner Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Full Name</label>
              <input type="text" required value={formData.fullName} onChange={e => updateForm('fullName', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Mobile Number</label>
              <input type="tel" required value={formData.mobile} onChange={e => updateForm('mobile', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Email ID</label>
              <input type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Address</label>
              <input type="text" value={formData.address} onChange={e => updateForm('address', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Area / Locality</label>
              <input type="text" value={formData.area} onChange={e => updateForm('area', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
          </div>
          <MultiSelectCheckbox 
            label="How did you hear about MyPet9?"
            field="heardAbout"
            otherField="otherHeardAbout"
            options={['Instagram', 'Facebook', 'WhatsApp', 'Google', 'Friend / Referral', 'Pet community']}
          />

          <h2 className="text-xl font-extrabold text-[#007672] mb-6 mt-8 border-b pb-2">2. About You</h2>
          <MultiSelectCheckbox 
            label="What do you currently do?"
            field="currentJob"
            otherField="otherJob"
            options={['Full-time job', 'Business', 'Student', 'Homemaker', 'Retired', 'Pet-care professional']}
          />
          <RadioGroup label="Do you currently have pets?" field="hasPets" options={['Yes', 'No']} />
          {formData.hasPets === 'Yes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-[12px] border border-gray-100">
              <div>
                <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Pet Name</label>
                <input type="text" value={formData.petName} onChange={e => updateForm('petName', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Breed</label>
                <input type="text" value={formData.petBreed} onChange={e => updateForm('petBreed', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Age</label>
                <input type="text" value={formData.petAge} onChange={e => updateForm('petAge', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
              </div>
            </div>
          )}
          <RadioGroup label="Have you cared for someone else's pet before?" field="caredForOtherPet" options={['Yes', 'No']} />
          <RadioGroup label="Have you previously provided pet boarding/homestay?" field="providedHomestayBefore" options={['Yes', 'No']} />
          {formData.providedHomestayBefore === 'Yes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">For how long?</label>
                <input type="text" value={formData.homestayDuration} onChange={e => updateForm('homestayDuration', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Approximately how many pets have you cared for?</label>
                <input type="text" value={formData.petsCaredForCount} onChange={e => updateForm('petsCaredForCount', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
              </div>
            </div>
          )}

          <h2 className="text-xl font-extrabold text-[#007672] mb-6 mt-8 border-b pb-2">3. Your Home / Homestay</h2>
          <MultiSelectCheckbox label="What type of property do you live in?" field="propertyType" otherField="otherPropertyType" options={['Apartment', 'Independent house', 'Villa', 'Farmhouse']} />
          <RadioGroup label="Do you own or rent the property?" field="ownOrRent" options={['Own', 'Rent']} />
          <MultiSelectCheckbox label="What type of space will be available for the pet?" field="spaceAvailable" otherField="otherSpaceAvailable" options={['Dedicated pet room', 'Separate room', 'Shared room', 'Living area', 'Entire home', 'Outdoor area']} />
          
          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Approximate size of the available pet area:</label>
            <input type="text" value={formData.spaceSize} onChange={e => updateForm('spaceSize', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
          </div>

          <RadioGroup label="Do you have a balcony?" field="balcony" options={['Yes', 'No']} />
          <RadioGroup label="Do you have a terrace?" field="terrace" options={['Yes', 'No']} />
          <RadioGroup label="Do you have a garden/open space?" field="garden" options={['Yes', 'No']} />
          <RadioGroup label="Is your home pet-proofed?" field="petProofed" options={['Yes', 'Partially', 'No', 'Not sure']} />
          <RadioGroup label="Is the home located in a gated/society premises?" field="gatedSociety" options={['Yes', 'No']} />
          <RadioGroup label="Are pets allowed by your society/building?" field="societyAllowsPets" options={['Yes', 'No', 'Need to check']} />

          <h2 className="text-xl font-extrabold text-[#007672] mb-6 mt-8 border-b pb-2">4. Existing Facilities</h2>
          <MultiSelectCheckbox label="Which facilities can you provide?" field="facilitiesProvided" otherField="otherFacility" options={['Sleeping area', 'Individual sleeping space', 'Air conditioning', 'Fan / ventilation', 'Garden / outdoor space', 'Walking area nearby', 'Play area', 'Toys', 'Pet beds', 'Food/water bowls', 'Crate', 'CCTV', 'Separate area for pets']} />
          <RadioGroup label="Can you provide a separate space for pets that don't get along with other animals?" field="separateSpaceForUnfriendly" options={['Yes', 'No', 'Depends on the situation']} />
          <MultiSelectCheckbox label="Do you currently have any pet-related equipment?" field="petEquipment" otherField="otherEquipment" options={['Leash', 'Crate', 'Pet bed', 'Toys', 'Grooming equipment', 'Feeding equipment', 'First-aid kit']} />

          <h2 className="text-xl font-extrabold text-[#007672] mb-6 mt-8 border-b pb-2">5. Pets You Can Accommodate</h2>
          <MultiSelectCheckbox label="Which pets are you comfortable hosting?" field="petsComfortableHosting" otherField="otherPetsComfortable" options={['Dogs', 'Cats', 'Puppies', 'Senior pets', 'Small breeds', 'Medium breeds', 'Large breeds']} />
          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Are there any breeds/types of pets you would NOT be comfortable hosting?</label>
            <input type="text" value={formData.notComfortableBreeds} onChange={e => updateForm('notComfortableBreeds', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
          </div>
          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Maximum number of pets you can accommodate at one time:</label>
            <input type="text" value={formData.maxPets} onChange={e => updateForm('maxPets', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
          </div>
          <RadioGroup label="Would you accept multiple pets from different families at the same time?" field="multipleFamilies" options={['Yes', 'No', 'Depends on compatibility']} />


          <h2 className="text-xl font-extrabold text-[#007672] mb-6 mt-8 border-b pb-2">6. Services You Can Provide</h2>
          <MultiSelectCheckbox label="What would you like to provide as part of your homestay?" field="servicesProvided" otherField="otherService" options={['Accommodation', 'Feeding', 'Walking', 'Playtime', 'Individual attention', 'Outdoor time', 'Socialization', 'Medication administration', 'Grooming', 'Bathing', 'Training', 'Pickup & drop', 'Special meals']} />
          <RadioGroup label="Can you follow specific feeding instructions provided by the pet parent?" field="followFeedingInstructions" options={['Yes', 'No']} />
          <RadioGroup label="Can you administer medication if required?" field="administerMedication" options={['Yes', 'No', 'Depends on the medication']} />
          <RadioGroup label="Can you handle pets with special needs?" field="specialNeeds" options={['Yes', 'No', 'Depends on the requirement']} />
          <RadioGroup label="Can you provide regular photos/videos to the pet parent?" field="providePhotosVideos" options={['Yes', 'No']} />
          <RadioGroup label="Would you be willing to provide a daily pet-care report?" field="provideDailyReport" options={['Yes', 'No']} />

          <h2 className="text-xl font-extrabold text-[#007672] mb-6 mt-8 border-b pb-2">7. Availability</h2>
          <MultiSelectCheckbox label="When are you available to provide homestay services?" field="availability" options={['Weekdays', 'Weekends', 'Public holidays', 'School/college holidays', 'Any day']} />
          <MultiSelectCheckbox label="How much advance notice do you need for a booking?" field="advanceNotice" otherField="otherAdvanceNotice" options={['Same day', '1 day', '2–3 days', '1 week']} />
          <MultiSelectCheckbox label="What is the maximum duration you can host a pet?" field="maxDuration" options={['1–2 days', '3–7 days', '1–2 weeks', '2–4 weeks', 'More than 1 month', 'Depends on the situation']} />

          <h2 className="text-xl font-extrabold text-[#007672] mb-6 mt-8 border-b pb-2">8. Pricing</h2>
          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">How much would you charge per pet per night? (₹)</label>
            <input type="number" value={formData.pricePerNight} onChange={e => updateForm('pricePerNight', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
          </div>
          <RadioGroup label="Would your price change based on the size/breed of the pet?" field="priceChangeBasedOnSize" options={['Yes', 'No']} />
          <RadioGroup label="Would you charge extra for additional services?" field="extraChargeForServices" options={['Yes', 'No']} />
          {formData.extraChargeForServices === 'Yes' && (
            <div className="mb-6 -mt-2">
              <input type="text" value={formData.extraServicesDetails} onChange={e => updateForm('extraServicesDetails', e.target.value)} placeholder="If yes, which services?" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
          )}

          <h2 className="text-xl font-extrabold text-[#007672] mb-6 mt-8 border-b pb-2">9. Safety & Verification</h2>
          <RadioGroup label="Would you be comfortable with MyPet9 verifying your identity?" field="verifyIdentity" options={['Yes', 'No']} />
          <RadioGroup label="Would you be comfortable submitting KYC documents?" field="submitKYC" options={['Yes', 'No']} />
          <RadioGroup label="Would you be comfortable with a MyPet9 team member visiting and inspecting your home before activation?" field="teamVisit" options={['Yes', 'No']} />
          <RadioGroup label="Would you be comfortable providing photographs/videos of your home for your MyPet9 profile?" field="photosVideosProfile" options={['Yes', 'No']} />
          <RadioGroup label="Would you be comfortable with pet parents viewing your verified profile before booking?" field="parentsViewProfile" options={['Yes', 'No']} />


          <h2 className="text-xl font-extrabold text-[#007672] mb-6 mt-8 border-b pb-2">10. Your Motivation</h2>
          <MultiSelectCheckbox label="Why are you interested in providing pet homestay?" field="motivation" otherField="otherMotivation" options={['I love animals', 'I already have pets', 'I enjoy taking care of pets', 'I want to earn additional income', 'I work from home', 'I have available space at home', 'I have previous pet-care experience']} />
          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">What do you think makes you a good pet caretaker?</label>
            <textarea value={formData.goodCaretakerReason} onChange={e => updateForm('goodCaretakerReason', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672] min-h-[80px]" />
          </div>
          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">What kind of pets would you especially enjoy taking care of?</label>
            <input type="text" value={formData.enjoyTakingCareOf} onChange={e => updateForm('enjoyTakingCareOf', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
          </div>
          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">What concerns or difficulties do you think you might face while providing pet homestay?</label>
            <textarea value={formData.concernsDifficulties} onChange={e => updateForm('concernsDifficulties', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672] min-h-[80px]" />
          </div>
          <MultiSelectCheckbox label="What support would you expect from MyPet9?" field="expectSupport" otherField="otherSupport" options={['Finding customers', 'Booking management', 'Customer communication', 'Payment collection', 'Emergency support', 'Veterinary support', 'Pet-care guidance', 'Training', 'Marketing/profile promotion']} />


          <h2 className="text-xl font-extrabold text-[#007672] mb-6 mt-8 border-b pb-2">11. Final Partner Information</h2>
          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Why should MyPet9 choose your home as a pet homestay?</label>
            <textarea value={formData.whyChooseHome} onChange={e => updateForm('whyChooseHome', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672] min-h-[80px]" />
          </div>
          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Additional Information / Remarks:</label>
            <textarea value={formData.remarks} onChange={e => updateForm('remarks', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672] min-h-[80px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div>
              <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Partner Signature (Type Name):</label>
              <input type="text" value={formData.signature} onChange={e => updateForm('signature', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
            <div>
              <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Date:</label>
              <input type="date" value={formData.date} onChange={e => updateForm('date', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">MyPet9 Team Remarks (Internal Use):</label>
            <textarea value={formData.myPet9Remarks} onChange={e => updateForm('myPet9Remarks', e.target.value)} className="w-full p-3 bg-[#FFF9EC] border border-amber-200 rounded-[10px] text-[13px] outline-none focus:border-amber-400 min-h-[100px]" placeholder="Enter internal remarks here..." />
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-[#007672] hover:bg-[#00605c] text-white py-4 rounded-[12px] font-extrabold text-[16px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Saving...' : 'Save & Start New Entry'}
              {!loading && <ChevronRight size={20} />}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
