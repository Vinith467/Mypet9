import React, { useState } from 'react';
import type { CaretakerFormData } from './types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { auth, db } from '../../../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface Props {
  data: CaretakerFormData;
  updateData: (data: Partial<CaretakerFormData>) => void;
  onNext: () => void;
  onLoginClick: () => void;
}

export const Step1SignUp = ({ data, updateData, onNext, onLoginClick }: Props) => {
  const [email, setEmail] = useState(data.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError('');
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save additional details to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        createdAt: new Date().toISOString(),
        type: 'caretaker',
        status: 'draft' // Draft status until they finish step 10
      });

      // Update local form data
      updateData({ email, authMethod: 'email' });
      
      onNext();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        // Try to sign them in instead if they already have an account but haven't finished
        try {
          const userCred = await signInWithEmailAndPassword(auth, email, password);
          
          // Check if they already submitted an application
          const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
          if (userDoc.exists()) {
            const status = userDoc.data().status;
            if (status === 'under_review' || status === 'approved') {
              setError('You have already submitted an application! Please log in from the main screen to check your status.');
              setLoading(false);
              return;
            }
          }
          
          updateData({ email, authMethod: 'email' });
          onNext();
          return;
        } catch (signInErr: any) {
          if (signInErr.code === 'auth/invalid-credential') {
            setError('This email is already registered. Please log in or use the correct password.');
          } else {
            setError(signInErr.message);
          }
        }
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white px-4 md:px-8 py-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px]">
      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-2xl font-extrabold text-[#1B2B48] mt-2 mb-2">Create Your Account</h2>
        <p className="text-sm text-gray-500 font-medium text-center px-4 mb-6">
          Start your application to become a trusted MyPet9 Caretaker.
        </p>

        {error && (
          <div className="w-full bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-4 border border-red-100">
            {error}
          </div>
        )}

        <div className="w-full space-y-4">
          <Input 
            type="email"
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={18} />}
          />
          <Input 
            type={showPassword ? 'text' : 'password'}
            placeholder="Password (min 6 characters)" 
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

          <Button 
            onClick={handleSignUp} 
            disabled={loading}
            className="w-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] font-bold shadow-md shadow-[#FBBF24]/20 mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Account & Continue'}
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-4 w-full">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">OR</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="mt-6 text-center">
          <span className="text-gray-500 font-medium text-sm">Already have an account? </span>
          <button 
            onClick={onLoginClick}
            className="text-[#FBBF24] font-extrabold text-sm hover:underline"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
