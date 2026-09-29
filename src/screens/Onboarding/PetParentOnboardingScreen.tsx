import React, { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, CheckCircle2, ChevronRight, ClipboardList, RefreshCcw, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PetParentOnboardingScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const initialFormState = {
    // Pet Parent Details
    parentName: '',
    mobile: '',
    email: '',
    address: '',
    // Pet Details
    petName: '',
    breed: '',
    age: '',
    gender: '',
    numberOfPets: '',
    timeWithPet: '',
    
    // Q11
    problems: [] as string[],
    otherProblem: '',
    // Q12
    travelCare: [] as string[],
    otherTravelCare: '',
    // Q13
    biggestConcern: [] as string[],
    otherConcern: '',
    // Q14
    badExperience: '',
    badExperienceDetails: '',
    // Q15
    wishBetter: '',
    // Q16
    usedBoarding: '',
    // Q17
    boardingProblems: [] as string[],
    otherBoardingProblem: '',
    // Q18
    comfortableBoarding: '',
    // Q19
    updatesWanted: [] as string[],
    otherUpdate: '',
    // Q20
    perfectService: '',
    // Q21
    biggestProblemToSolve: '',
    // Q22
    trustFactors: [] as string[],
    otherTrustFactor: '',
    // Q23
    searchPlaces: [] as string[],
    otherSearchPlace: '',
    // Q24
    mostImportant: [] as string[],
    otherMostImportant: '',
    // Q25
    difficultToFindGood: '',
    
    // Remarks
    remarks: ''
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
      await addDoc(collection(db, 'field_leads_parents'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData(initialFormState); // Reset form instantly for next entry
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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

  if (success) {
    return (
      <div className="min-h-screen bg-[#F0F9F9] flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full text-center">
          <CheckCircle2 size={64} className="text-[#10B981] mb-4" />
          <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-2">Saved Successfully!</h2>
          <p className="text-[#465E87] mb-6">The pet parent lead has been recorded.</p>
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
            <h1 className="text-[16px] md:text-lg font-extrabold text-[#1B2B48] truncate">Pet Parent Onboarding</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/join/partner')}
              className="flex items-center gap-2 bg-white border border-[#007672] text-[#007672] px-3 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
            >
              <RefreshCcw size={16} />
              <span className="hidden sm:inline">Switch to Partner</span>
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
          
          <h2 className="text-xl font-extrabold text-[#007672] mb-6 border-b pb-2">Part 1: Pet Parent Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Parent Name</label>
              <input type="text" required value={formData.parentName} onChange={e => updateForm('parentName', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
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
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Address / Location</label>
              <input type="text" value={formData.address} onChange={e => updateForm('address', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-[#007672] mb-6 border-b pb-2">Part 2: Pet Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Pet Name</label>
              <input type="text" value={formData.petName} onChange={e => updateForm('petName', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Pet Breed</label>
              <input type="text" value={formData.breed} onChange={e => updateForm('breed', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Pet Age</label>
              <input type="text" value={formData.age} onChange={e => updateForm('age', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">Gender</label>
              <div className="flex gap-2">
                <label className="flex-1 flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-[10px] cursor-pointer">
                  <input type="radio" name="gender" checked={formData.gender === 'Male'} onChange={() => updateForm('gender', 'Male')} className="text-[#007672]" />
                  <span className="text-[13px]">Male</span>
                </label>
                <label className="flex-1 flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-[10px] cursor-pointer">
                  <input type="radio" name="gender" checked={formData.gender === 'Female'} onChange={() => updateForm('gender', 'Female')} className="text-[#007672]" />
                  <span className="text-[13px]">Female</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">How many pets do you have?</label>
              <input type="number" value={formData.numberOfPets} onChange={e => updateForm('numberOfPets', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1B2B48] mb-1">How long have you had your pet?</label>
              <input type="text" value={formData.timeWithPet} onChange={e => updateForm('timeWithPet', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672]" />
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-[#007672] mb-6 border-b pb-2">Part 3: Understanding Your Pet-Care Problems</h2>
          
          <MultiSelectCheckbox 
            label="11. What are the biggest problems you face while taking care of your pet?"
            field="problems"
            otherField="otherProblem"
            options={[
              'Finding a trustworthy pet sitter/caretaker', 'Finding a safe place for pet boarding', 'Finding a good home-stay for my pet', 
              'Leaving my pet alone when I am at work', 'Taking care of my pet when I travel', 'Finding reliable grooming services',
              'Finding a groomer who understands my pet', 'Finding a good veterinarian', 'Getting veterinary help in an emergency',
              'Finding good pet food', 'Choosing the right food for my pet', 'Finding good-quality pet products', 'Finding products at reasonable prices',
              'Getting medicines/supplements for my pet', 'Finding someone for daily walks', 'Finding someone to play/exercise with my pet',
              'Managing my pet\'s behaviour', 'Training my pet', 'Keeping my pet mentally stimulated', 'Managing separation anxiety',
              'Managing my pet\'s diet/nutrition', 'Keeping track of vaccinations/medicines', 'Finding trustworthy people to care for my pet',
              'Lack of personalized care', 'Lack of updates when someone else is caring for my pet'
            ]}
          />

          <MultiSelectCheckbox 
            label="12. When you travel, what do you usually do with your pet?"
            field="travelCare"
            otherField="otherTravelCare"
            options={['Take my pet with me', 'Leave my pet with family/friends', 'Hire a pet sitter', 'Use a boarding facility', 'Use a home-stay', 'Leave my pet at home with someone visiting', 'I have difficulty finding someone']}
          />

          <MultiSelectCheckbox 
            label="13. What is your biggest concern when leaving your pet with someone else?"
            field="biggestConcern"
            otherField="otherConcern"
            options={['Safety', 'Hygiene', 'Food/diet being followed correctly', 'Medication being given correctly', 'Pet getting enough exercise', 'Pet getting enough attention', 'Pet feeling lonely/stressed', 'Interaction with other pets', 'Caretaker\'s experience', 'Emergency handling', 'Lack of regular updates/photos/videos', 'Hidden/extra charges', 'Trust']}
          />

          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-3">14. Have you ever had a bad experience with a pet-care service?</label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="badExperience" checked={formData.badExperience === 'Yes'} onChange={() => updateForm('badExperience', 'Yes')} className="w-4 h-4 text-[#007672]" />
                <span className="text-[13px]">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="badExperience" checked={formData.badExperience === 'No'} onChange={() => updateForm('badExperience', 'No')} className="w-4 h-4 text-[#007672]" />
                <span className="text-[13px]">No</span>
              </label>
            </div>
            {formData.badExperience === 'Yes' && (
              <textarea 
                value={formData.badExperienceDetails}
                onChange={e => updateForm('badExperienceDetails', e.target.value)}
                placeholder="What happened?"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672] min-h-[80px]"
              />
            )}
          </div>

          <div className="mb-8">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">15. What do you wish existing pet-care services did better?</label>
            <textarea value={formData.wishBetter} onChange={e => updateForm('wishBetter', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672] min-h-[80px]" />
          </div>


          <h2 className="text-xl font-extrabold text-[#007672] mb-6 border-b pb-2">Part 4: Boarding & Home-Stay</h2>

          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-3">16. Have you ever used a pet boarding/home-stay service?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="usedBoarding" checked={formData.usedBoarding === 'Yes'} onChange={() => updateForm('usedBoarding', 'Yes')} className="w-4 h-4 text-[#007672]" />
                <span className="text-[13px]">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="usedBoarding" checked={formData.usedBoarding === 'No'} onChange={() => updateForm('usedBoarding', 'No')} className="w-4 h-4 text-[#007672]" />
                <span className="text-[13px]">No</span>
              </label>
            </div>
          </div>

          {formData.usedBoarding === 'Yes' && (
            <MultiSelectCheckbox 
              label="17. If yes, what problems did you face?"
              field="boardingProblems"
              otherField="otherBoardingProblem"
              options={['Finding availability', 'Trusting the provider', 'Cleanliness/hygiene', 'Small/overcrowded space', 'Too many pets together', 'Lack of individual attention', 'Food was not given as instructed', 'Exercise/playtime was insufficient', 'No regular updates', 'Poor communication', 'Pet became stressed/uncomfortable', 'Staff/caretaker behaviour', 'Price', 'Distance', 'Transportation']}
            />
          )}

          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">18. What would make you comfortable leaving your pet at a boarding/home-stay facility?</label>
            <textarea value={formData.comfortableBoarding} onChange={e => updateForm('comfortableBoarding', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672] min-h-[80px]" />
          </div>

          <MultiSelectCheckbox 
            label="19. What would you like to receive while your pet is staying there?"
            field="updatesWanted"
            otherField="otherUpdate"
            options={['Daily photos', 'Daily videos', 'Daily activity updates', 'Feeding updates', 'Walk/exercise updates', 'Sleep/rest updates', 'Behaviour observations', 'Health updates', 'Grooming', 'Playtime', 'Individual attention', 'Emergency updates', 'Daily/weekly pet report']}
          />

          <h2 className="text-xl font-extrabold text-[#007672] mb-6 mt-8 border-b pb-2">Part 5: Understanding Ideal Service</h2>

          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">20. If you could create the perfect pet-care service, what would you want it to provide?</label>
            <textarea value={formData.perfectService} onChange={e => updateForm('perfectService', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672] min-h-[80px]" />
          </div>

          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">21. What is the one biggest problem you want someone to solve for you as a pet parent?</label>
            <textarea value={formData.biggestProblemToSolve} onChange={e => updateForm('biggestProblemToSolve', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672] min-h-[80px]" />
          </div>

          <MultiSelectCheckbox 
            label="22. What would make you trust a new pet-care platform?"
            field="trustFactors"
            otherField="otherTrustFactor"
            options={['Verified caretakers', 'KYC verification', 'Facility inspection', 'Reviews from other pet parents', 'Photos/videos of the facility', 'Meet the caretaker before booking', 'Regular updates', 'Emergency support', 'Insurance/protection', 'Transparent pricing', 'Pet-specific care instructions']}
          />

          <MultiSelectCheckbox 
            label="23. Where do you usually search for pet-care services?"
            field="searchPlaces"
            otherField="otherSearchPlace"
            options={['Google Search / Google Maps', 'Instagram', 'Facebook', 'WhatsApp groups', 'Friends & family recommendations', 'Other pet parents', 'Veterinarian recommendations', 'Pet shops', 'Local pet stores', 'Pet-care apps', 'Online marketplaces', 'Apartment / society groups', 'Local pet communities', 'I search on Google and contact businesses directly', 'I already have a trusted service provider']}
          />

          <MultiSelectCheckbox 
            label="24. When you search for a pet-care service, what is most important to you?"
            field="mostImportant"
            otherField="otherMostImportant"
            options={['Trust & safety', 'Reviews & ratings', 'Price', 'Location / distance', 'Experience of the provider', 'Photos & videos of the facility', 'Availability', 'Quality of service', 'Personalized care', 'Recommendations from people I trust', 'Convenience of booking', 'Regular updates about my pet']}
          />

          <div className="mb-6">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">25. What makes it difficult to find a good pet-care service?</label>
            <textarea value={formData.difficultToFindGood} onChange={e => updateForm('difficultToFindGood', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] outline-none focus:border-[#007672] min-h-[80px]" />
          </div>

          <div className="mb-10">
            <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Remarks (Any additional notes from interviewer)</label>
            <textarea value={formData.remarks} onChange={e => updateForm('remarks', e.target.value)} className="w-full p-3 bg-[#FFF9EC] border border-amber-200 rounded-[10px] text-[13px] outline-none focus:border-amber-400 min-h-[100px]" placeholder="Enter internal remarks here..." />
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
