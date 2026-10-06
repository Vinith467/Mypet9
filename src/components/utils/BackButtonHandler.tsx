import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';

export const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let listener: any;
    
    const handleBackButton = async () => {
      listener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        // Prevent going back if we are at the root or auth screen
        if (location.pathname === '/' || location.pathname === '/auth') {
          CapacitorApp.exitApp();
        } else if (canGoBack) {
          navigate(-1);
        } else {
          CapacitorApp.exitApp();
        }
      });
    };

    handleBackButton();

    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
    };
  }, [navigate, location.pathname]);

  return null;
};
