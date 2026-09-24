import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { X, Mail, Lock, User, Eye, EyeOff, Phone } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

// Firebase imports
import { auth, db } from '../../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

type AuthStep = 'initial' | 'login' | 'signup' | 'phone';

const AuthScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle } = useAuth();
  
  const [step, setStep] = useState<AuthStep>('initial');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      const returnTo = location.state?.returnTo || '/home';
      navigate(returnTo, { state: location.state?.searchState });
    } catch (error: any) {
      console.error(error);
      setError(error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (step === 'login') {
        if (!email || !password) throw new Error('Please enter both email and password.');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Admin shortcut
        if (userCredential.user.email === 'admin@gmail.com') {
          navigate('/admin');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        const actualRole = userDoc.exists() ? userDoc.data().type : 'pet_parent';

        if (actualRole === 'caretaker') {
          await auth.signOut();
          throw new Error('This is a Caretaker account. Please use the Caretaker App to login.');
        }

        if (actualRole === 'admin') {
          navigate('/admin');
        } else {
          const returnTo = location.state?.returnTo || '/home';
          navigate(returnTo, { state: location.state?.searchState });
        }

      } else if (step === 'signup') {
        if (!name || !email || !phone || !password || !confirmPassword) throw new Error('Please fill in all fields.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name,
          email,
          phone: `+91${phone}`,
          createdAt: new Date().toISOString(),
          type: 'pet_parent'
        });

        const returnTo = location.state?.returnTo || '/home';
        navigate(returnTo, { state: location.state?.searchState });
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message;
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
      if (err.code === 'auth/invalid-credential') msg = 'Incorrect email or password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved
        }
      });
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const phoneNumber = `+91${phone}`;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      (window as any).confirmationResult = confirmationResult;
      setVerificationId(confirmationResult.verificationId);
    } catch (err: any) {
      console.error(err);
      
      // Special friendly message for the region error
      if (err.message?.includes('operation-not-allowed')) {
        setError('SMS is not enabled for this region in Firebase yet.');
      } else {
        setError(err.message || 'Failed to send OTP');
      }
      
      // Reset the recaptcha widget so it can be used again without throwing an error
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.render().then(function(widgetId: any) {
            (window as any).grecaptcha.reset(widgetId);
          });
        } catch (resetErr) {
          console.error("Could not reset recaptcha", resetErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const confirmationResult = (window as any).confirmationResult;
      const result = await confirmationResult.confirm(otp);
      
      // Check if user exists, if not create default profile
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name: 'Pet Parent',
          phone: `+91${phone}`,
          createdAt: new Date().toISOString(),
          type: 'pet_parent'
        });
      }
      const returnTo = location.state?.returnTo || '/home';
      navigate(returnTo, { state: location.state?.searchState });
    } catch (err: any) {
      console.error(err);
      setError('Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white w-full font-sans">
      {/* Header */}
      <div className="bg-[#FBBF24] text-[#1B2B48] flex items-center justify-between px-4 py-4 sticky top-0 z-50">
        <button onClick={() => step === 'initial' ? navigate(-1) : setStep('initial')} className="p-2 -ml-2 rounded-full hover:bg-[#1B2B48]/10 transition-colors">
          <X size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-bold tracking-wide">MyPet9</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="flex-1 w-full max-w-md mx-auto p-6 md:p-8 flex flex-col pt-8">
        {step === 'initial' && (
          <div className="flex flex-col">
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-[#1a1a1a] leading-tight mb-8">
              Sign in to access members-only benefits – it's free to join!
            </h2>

            {error && (
              <div className="w-full bg-red-50 text-red-600 text-sm font-bold p-3 rounded-lg mb-6 border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <button 
                onClick={handleGoogleSignIn}
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-[#1a1a1a] font-semibold py-3.5 px-4 rounded-md flex items-center justify-center relative transition-colors shadow-sm"
              >
                <div className="absolute left-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                Continue with Google
              </button>

              <button 
                onClick={() => setStep('phone')}
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-[#1a1a1a] font-semibold py-3.5 px-4 rounded-md flex items-center justify-center relative transition-colors shadow-sm"
              >
                <div className="absolute left-4 text-[#1B2B48]">
                  <Phone size={20} />
                </div>
                Continue with Phone
              </button>

              <button 
                onClick={() => setStep('login')}
                className="w-full bg-[#1B2B48] hover:bg-[#121c2e] text-white font-semibold py-3.5 px-4 rounded-md flex items-center justify-center transition-colors shadow-sm"
              >
                Continue with email
              </button>
            </div>

            <div className="mt-auto text-center">
              <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-4">
                By signing in or creating an account, you agree with our <br/>
                <a href="#" className="text-[#1B2B48] font-bold hover:underline">Terms & conditions</a> and <a href="#" className="text-[#1B2B48] font-bold hover:underline">Privacy statement</a>
              </p>
              <p className="text-[12px] text-gray-400">
                © 2006–2026 MyPet9
              </p>
            </div>
          </div>
        )}

        {/* Email Login/Signup Flow */}
        {(step === 'login' || step === 'signup') && (
          <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-6">
              {step === 'login' ? 'Sign in with Email' : 'Create an Account'}
            </h2>

            {error && (
              <div className="w-full bg-red-50 text-red-600 text-sm font-bold p-3 rounded-lg mb-6 border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-8">
              {step === 'signup' && (
                <Input 
                  leftIcon={<User size={18} />} 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 focus:border-[#1B2B48] rounded-md shadow-sm"
                />
              )}
              
              <Input 
                leftIcon={<Mail size={18} />} 
                placeholder="Email Address" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-gray-300 text-gray-900 focus:border-[#1B2B48] rounded-md shadow-sm"
              />

              {step === 'signup' && (
                <div className="flex gap-2">
                  <div className="w-[70px] bg-gray-50 border border-gray-300 rounded-md flex items-center justify-center text-gray-600 font-semibold text-sm shadow-sm">
                    +91
                  </div>
                  <Input 
                    placeholder="Phone Number" 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 bg-white border-gray-300 text-gray-900 focus:border-[#1B2B48] rounded-md shadow-sm"
                  />
                </div>
              )}

              <div className="relative">
                <Input 
                  leftIcon={<Lock size={18} />} 
                  placeholder={step === 'login' ? 'Password' : 'Create Password'} 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 focus:border-[#1B2B48] rounded-md shadow-sm pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {step === 'signup' && (
                <div className="relative">
                  <Input 
                    leftIcon={<Lock size={18} />} 
                    placeholder="Confirm Password" 
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 focus:border-[#1B2B48] rounded-md shadow-sm pr-10"
                  />
                </div>
              )}
            </div>

            <Button 
              className="w-full py-3.5 bg-[#1B2B48] hover:bg-[#121c2e] text-white font-semibold rounded-md shadow-sm transition-colors mb-4"
              onClick={handleEmailSubmit}
              loading={loading}
            >
              {step === 'login' ? 'Sign In' : 'Create Account'}
            </Button>

            <button 
              onClick={() => setStep(step === 'login' ? 'signup' : 'login')}
              className="text-[#1B2B48] font-bold text-sm hover:underline text-center w-full"
            >
              {step === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        )}

        {/* Phone Flow */}
        {step === 'phone' && (
          <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-6">
              Sign in with Phone
            </h2>

            {error && (
              <div className="w-full bg-red-50 text-red-600 text-sm font-bold p-3 rounded-lg mb-6 border border-red-100">
                {error}
              </div>
            )}

            {!verificationId ? (
              <div className="space-y-4 mb-8">
                <div className="flex gap-2">
                  <div className="w-[70px] bg-gray-50 border border-gray-300 rounded-md flex items-center justify-center text-gray-600 font-semibold text-sm shadow-sm">
                    +91
                  </div>
                  <Input 
                    placeholder="Phone Number" 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 bg-white border-gray-300 text-gray-900 focus:border-[#1B2B48] rounded-md shadow-sm"
                  />
                </div>
                <div id="recaptcha-container"></div>
                <Button 
                  className="w-full py-3.5 bg-[#1B2B48] hover:bg-[#121c2e] text-white font-semibold rounded-md shadow-sm transition-colors mb-4"
                  onClick={handleSendOtp}
                  loading={loading}
                >
                  Send OTP
                </Button>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                <Input 
                  placeholder="Enter 6-digit OTP" 
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="bg-white border-gray-300 text-gray-900 focus:border-[#1B2B48] rounded-md shadow-sm text-center tracking-widest text-lg font-bold"
                />
                <Button 
                  className="w-full py-3.5 bg-[#1B2B48] hover:bg-[#121c2e] text-white font-semibold rounded-md shadow-sm transition-colors mb-4"
                  onClick={handleVerifyOtp}
                  loading={loading}
                >
                  Verify OTP
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
