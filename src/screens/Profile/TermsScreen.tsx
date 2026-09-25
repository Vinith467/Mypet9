import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const TermsScreen = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#FAFAFA] pb-24 lg:pb-12">
        {/* Header */}
        <div className="sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-md z-30 px-5 lg:px-8 py-4 lg:py-6 flex items-center shadow-sm border-b border-gray-100">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#1B2B48] hover:bg-gray-50 transition-colors mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[20px] lg:text-[24px] font-extrabold text-[#1B2B48]">Terms & Privacy Policy</h1>
        </div>

        {/* Content */}
        <div className="px-5 lg:px-8 pt-6 max-w-3xl mx-auto w-full">
          <div className="bg-white rounded-[20px] p-6 lg:p-8 shadow-sm border border-gray-100 prose prose-sm lg:prose-base prose-slate max-w-none">
            <h2>Privacy Policy</h2>
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            
            <p>
              Welcome to MyPet9. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our 
              application and tell you about your privacy rights and how the law protects you.
            </p>

            <h3>1. The Data We Collect About You</h3>
            <p>
              We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul>
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
              <li><strong>Profile Data:</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
            </ul>

            <h3>2. How We Use Your Personal Data</h3>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul>
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., matching you with a pet caretaker).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>

            <h3>3. Data Security</h3>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
            </p>

            <hr className="my-8" />

            <h2>Terms of Service</h2>
            <p>
              By accessing or using the MyPet9 platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
            </p>
            <ul>
              <li><strong>Account Registration:</strong> You must provide accurate, complete, and current information when creating an account.</li>
              <li><strong>User Conduct:</strong> You are responsible for all activities that occur under your account.</li>
              <li><strong>Caretaker Services:</strong> MyPet9 is a platform that connects pet parents with caretakers. We do not provide pet care services directly.</li>
              <li><strong>Payments:</strong> All payments for services must be processed through the MyPet9 platform.</li>
            </ul>
            
            <p className="mt-8 text-gray-500 italic">
              For full legal inquiries or to request data deletion, please contact support@mypet9.com.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
