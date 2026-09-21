import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CaretakerApplicationForm } from './CaretakerApplicationForm';
import { CaretakerApplicationScreen } from './CaretakerApplicationScreen';

// Firebase imports
import { auth, db } from '../../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

type AuthMode = 'login' | 'signup';

const AuthScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>(location.state?.mode || 'login');
  const [authRole, setAuthRole] = useState<'user' | 'caretaker'>('user');
  const [caretakerMode, setCaretakerMode] = useState<'apply' | 'auth'>('apply');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user, userData } = useAuth();

  useEffect(() => {
    // Only redirect if explicitly not trying to apply as a new caretaker
    if (user && userData && caretakerMode === 'auth') {
      if (userData.type === 'caretaker') {
        const status = userData.status || 'draft';
        if (status === 'under_review') {
          navigate('/caretaker/under-review');
        } else if (status === 'approved') {
          navigate('/caretaker/dashboard');
        }
      } else {
        navigate('/home');
      }
    }
  }, [user, userData, navigate, caretakerMode]);

  const toggleMode = () => {
    if (authRole === 'caretaker') return; // Caretakers cannot toggle to signup
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setError(''); // Clear errors when switching
  };

  const isLogin = mode === 'login' || authRole === 'caretaker';

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login Flow
        if (!email || !password) {
          throw new Error('Please enter both email and password.');
        }
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Admin shortcut — hardcoded for now
        if (userCredential.user.email === 'admin@gmail.com') {
          navigate('/admin');
          return;
        }

        // Check role to redirect
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        const actualRole = userDoc.exists() ? userDoc.data().type : 'pet_parent';

        if (authRole === 'caretaker' && actualRole !== 'caretaker') {
          await auth.signOut();
          throw new Error('This is a Pet Parent account. Please switch to the Pet Parent login, or sign up for a new Caretaker account.');
        }

        if (authRole === 'user' && actualRole === 'caretaker') {
          await auth.signOut();
          throw new Error('This is a Caretaker account. Please switch to the Caretaker login.');
        }

        if (actualRole === 'admin') {
          navigate('/admin');
        } else if (actualRole === 'caretaker') {
          const status = userDoc.data()?.status || 'draft';
          
          if (status === 'draft') {
            setCaretakerMode('apply');
            return;
          } else if (status === 'under_review') {
            navigate('/caretaker/under-review');
          } else if (status === 'approved') {
            navigate('/caretaker/congratulations');
          } else {
            setCaretakerMode('apply');
            return;
          }
        } else {
          navigate('/home');
        }
      } else {
        // Signup Flow
        if (!name || !email || !phone || !password || !confirmPassword) {
          throw new Error('Please fill in all fields.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        // 1. Create the user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Update their display name in Auth
        await updateProfile(user, { displayName: name });

        // 3. Save additional details to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name,
          email,
          phone: `+91${phone}`,
          createdAt: new Date().toISOString(),
          type: authRole === 'user' ? 'pet_parent' : 'caretaker'
        });

        // 4. Navigate based on role
        if (authRole === 'caretaker') {
          navigate('/caretaker/onboarding');
        } else {
          navigate('/home');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      // Firebase throws errors with codes, we can make them readable
      let msg = err.message;
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
      if (err.code === 'auth/invalid-credential') {
        msg = 'Incorrect email or password.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (authRole === 'caretaker' && caretakerMode === 'apply') {
    return (
      <CaretakerApplicationScreen 
        onBack={() => setAuthRole('user')} 
        onLoginClick={() => setCaretakerMode('auth')} 
      />
    );
  }

  return (
    <div className={`flex flex-col min-h-screen lg:h-screen w-full relative lg:overflow-hidden bg-[#F8F9FA] transition-all duration-700 ease-in-out ${authRole === 'caretaker' ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
      
      {/* Mobile Background Image (Hidden on Desktop) */}
      <div className="absolute inset-0 z-0 lg:hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img src={authRole === 'caretaker' ? "/auth-caretaker-bg.png" : "/auth-bg.png"} alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* 
        Left Side: Form
        Mobile: 100% width, centered content.
        Desktop: 50% width, centered content in a floating premium card.
      */}
      <div 
        className="flex flex-col w-full lg:w-[45%] min-h-screen lg:min-h-0 lg:h-full lg:px-12 xl:px-16 items-center pb-8 relative z-10 lg:bg-white lg:overflow-y-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 25 }}
          className="w-full max-w-[380px] px-6 lg:px-0 flex flex-col items-center bg-transparent my-auto"
        >
          
          {/* Sticky Header Wrapper */}
          <div className="sticky top-0 z-30 w-full flex flex-col items-center pt-8 pb-4 bg-black/40 backdrop-blur-md lg:bg-white lg:backdrop-blur-none rounded-b-3xl lg:rounded-none -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white/20 backdrop-blur-md lg:bg-[#FBBF24]/10 p-2.5 rounded-xl mb-3 shadow-sm lg:shadow-none">
              <PawPrint size={28} className="text-white lg:text-[#FBBF24]" strokeWidth={2.5} />
            </div>
            <h1 className="text-[28px] font-extrabold text-white lg:text-[#1B2B48] mb-0.5 tracking-tight drop-shadow-lg lg:drop-shadow-none">
              Mypet<span className="lg:text-[#FBBF24]">9</span>
            </h1>
            <p className="text-white/90 lg:text-gray-500 font-medium text-[13px] drop-shadow-md lg:drop-shadow-none">
              Safe Homes. Happy Pets.
            </p>
          </div>

          {/* Toggle Tabs (Only for Pet Parents) */}
          {authRole === 'user' && (
            <div className="flex max-w-[280px] mx-auto w-full bg-black/20 lg:bg-gray-100 rounded-full p-1 backdrop-blur-md lg:backdrop-blur-none mb-5 relative">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#FBBF24] rounded-full transition-all duration-300 ease-out shadow-sm`}
                style={{ left: isLogin ? '4px' : 'calc(50%)' }}
              />
              <button 
                className={`flex-1 py-2 text-[13px] font-extrabold tracking-wide z-10 transition-colors duration-300 rounded-full ${isLogin ? 'text-[#1B2B48]' : 'text-white/80 lg:text-gray-500 hover:text-white lg:hover:text-[#1B2B48] drop-shadow-sm lg:drop-shadow-none'}`}
                onClick={() => setMode('login')}
              >
                Log In
              </button>
              <button 
                className={`flex-1 py-2 text-[13px] font-extrabold tracking-wide z-10 transition-colors duration-300 rounded-full ${!isLogin ? 'text-[#1B2B48]' : 'text-white/80 lg:text-gray-500 hover:text-white lg:hover:text-[#1B2B48] drop-shadow-sm lg:drop-shadow-none'}`}
                onClick={() => setMode('signup')}
              >
                Sign Up
              </button>
            </div>
          )}

          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full bg-red-50 text-red-600 text-[13px] font-bold p-3 rounded-xl mb-3 border border-red-100">
              {error}
            </div>
          )}

          {/* Only render Form if mode allows it */}
          <div className="w-full flex flex-col space-y-3">
            <AnimatePresence mode="popLayout">
              {isLogin ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col space-y-3 w-full"
                >
                  <Input 
                    placeholder="Email Address" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail size={18} />}
                  />
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock size={18} />}
                    rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="signup-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col space-y-3 w-full"
                >
                  <Input 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    leftIcon={<User size={18} />}
                  />
                  <Input 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail size={18} />}
                    type="email"
                  />
                  <Input 
                    placeholder="Phone Number" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<span className="text-[14px] font-bold text-gray-400">+91</span>}
                    type="tel"
                  />
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Set Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock size={18} />}
                    rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                  />
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    leftIcon={<Lock size={18} />}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Button fullWidth className="mt-3 h-[48px] text-[14px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] font-bold shadow-lg shadow-[#FBBF24]/20 border-none hover:shadow-[#FBBF24]/30 hover:-translate-y-0.5 transition-all duration-300" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
            </Button>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center my-4">
            <div className="flex-1 h-px bg-white/30 lg:bg-gray-200" />
            <span className="px-4 text-[10px] uppercase tracking-wider font-extrabold text-white/80 lg:text-gray-400 drop-shadow-sm lg:drop-shadow-none">or continue with</span>
            <div className="flex-1 h-px bg-white/30 lg:bg-gray-200" />
          </div>

          {/* Social Buttons */}
          <div className="flex justify-center space-x-4">
            <button className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            </button>
            <button className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all text-[#1B2B48]">
              <PawPrint size={20} className="fill-current" />
            </button>
          </div>

          {/* Footer Text */}
          <div className="mt-4 flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center space-x-1.5 text-[12px] font-bold">
              <span className="text-white/90 lg:text-gray-500 drop-shadow-sm lg:drop-shadow-none">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button 
                className="text-[#FBBF24] lg:text-[#FBBF24] hover:underline focus:outline-none drop-shadow-sm lg:drop-shadow-none"
                onClick={toggleMode}
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </div>
            
            {/* New Apply link for caretakers */}
            {authRole === 'caretaker' && (
              <div className="flex items-center space-x-1.5 text-[12px] font-bold">
                <span className="text-white/90 lg:text-gray-500 drop-shadow-sm lg:drop-shadow-none">
                  Want to become a Caretaker?
                </span>
                <button 
                  className="text-[#FBBF24] lg:text-[#FBBF24] hover:underline focus:outline-none drop-shadow-sm lg:drop-shadow-none"
                  onClick={() => setCaretakerMode('apply')}
                >
                  Apply Here
                </button>
              </div>
            )}
          </div>

          {/* Swap Role Button (Mobile only) */}
          <div className="mt-6 flex justify-center w-full lg:hidden">
            <button 
              onClick={() => {
                setAuthRole(authRole === 'user' ? 'caretaker' : 'user');
                if (authRole === 'user') setCaretakerMode('apply');
              }}
              className="group px-6 py-3.5 w-full max-w-[300px] bg-[#FBBF24] active:bg-[#F59E0B] text-[#1B2B48] font-extrabold text-[14px] tracking-wide rounded-2xl transition-all duration-300 ease-out flex items-center justify-center space-x-2 shadow-[0_8px_25px_rgba(251,191,36,0.3)] border border-[#FBBF24]"
            >
              <span>{authRole === 'user' ? 'Become a Caretaker' : 'Login as Pet Parent'}</span>
              <ArrowRight size={18} className="transition-transform duration-300 group-active:translate-x-1" />
            </button>
          </div>

        </motion.div>
      </div>

      {/* Image Side (Desktop only) */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-black transition-all duration-700">
        {/* Toggle Button in Top Corner */}
        <div className={`absolute top-8 z-30 transition-all duration-700 ${authRole === 'caretaker' ? 'left-8' : 'right-8'}`}>
          <button 
            onClick={() => {
              setAuthRole(authRole === 'user' ? 'caretaker' : 'user');
              if (authRole === 'user') setCaretakerMode('apply');
            }}
            className="group px-6 py-3 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] font-extrabold text-[13px] tracking-wide rounded-full transition-all duration-300 ease-out flex items-center space-x-2 shadow-[0_8px_20px_rgba(251,191,36,0.3)] hover:shadow-[0_8px_25px_rgba(251,191,36,0.5)] hover:-translate-y-0.5 border border-[#FBBF24]"
          >
            <span>{authRole === 'user' ? 'Become a Caretaker' : 'Login as Pet Parent'}</span>
            <ArrowRight size={18} className={authRole === 'caretaker' ? 'rotate-180 transition-transform duration-300 group-hover:-translate-x-1' : 'transition-transform duration-300 group-hover:translate-x-1'} />
          </button>
        </div>

        {/* Clean, dark gradient from the bottom to ensure text is perfectly readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
        
        <motion.img 
          key={authRole}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src={authRole === 'caretaker' ? "/auth-caretaker-bg.png" : "/auth-bg.png"} 
          alt="Pets" 
          className="w-full h-full object-cover relative z-0"
        />
        
        {/* Floating cards / trust badges */}
        <div className="absolute z-20 bottom-16 left-12 right-12 flex items-end justify-between">
          <motion.div 
            key={`text-${authRole}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white max-w-md"
          >
            <h2 className="text-4xl font-extrabold mb-4 leading-tight drop-shadow-lg">
              {authRole === 'user' ? (
                <>Your pet's <span className="text-[#FBBF24]">second home</span>.</>
              ) : (
                <>Turn your love for pets into <span className="text-[#FBBF24]">earnings</span>.</>
              )}
            </h2>
            <p className="text-white/80 font-medium text-lg leading-relaxed">
              {authRole === 'user' 
                ? "Connect with verified, loving caretakers in your neighborhood. Real-time updates, complete peace of mind."
                : "Join our community of verified caretakers. Set your own schedule, prices, and do what you love."}
            </p>
          </motion.div>

          {/* Small glass card */}
          <div className="hidden xl:flex items-center space-x-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl">
            <div className="flex -space-x-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" className="w-10 h-10 rounded-full border-2 border-[#FBBF24]" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User" className="w-10 h-10 rounded-full border-2 border-[#FBBF24]" />
              <div className="w-10 h-10 rounded-full border-2 border-[#FBBF24] bg-[#FBBF24] flex items-center justify-center text-[#1B2B48] text-xs font-bold">
                +2k
              </div>
            </div>
            <div>
              <div className="flex items-center text-amber-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span className="font-bold text-white ml-1 text-sm">4.9/5</span>
              </div>
              <p className="text-white/80 text-xs font-medium">Happy Parents</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AuthScreen;
