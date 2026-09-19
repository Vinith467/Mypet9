import { useState, useEffect } from 'react';

export const useSavedCaretakers = () => {
  const [savedCaretakers, setSavedCaretakers] = useState<any[]>([]);

  useEffect(() => {
    const loadSaved = () => {
      const saved = localStorage.getItem('savedCaretakers');
      if (saved) {
        try {
          setSavedCaretakers(JSON.parse(saved));
        } catch (e) {
          setSavedCaretakers([]);
        }
      }
    };

    loadSaved();
    
    // Listen for storage changes across tabs
    window.addEventListener('storage', loadSaved);
    return () => window.removeEventListener('storage', loadSaved);
  }, []);

  const toggleSaved = (provider: any) => {
    const exists = savedCaretakers.find(c => c.id === provider.id);
    let newSaved;
    if (exists) {
      newSaved = savedCaretakers.filter(c => c.id !== provider.id);
    } else {
      newSaved = [...savedCaretakers, provider];
    }
    setSavedCaretakers(newSaved);
    localStorage.setItem('savedCaretakers', JSON.stringify(newSaved));
    
    // Dispatch a custom event so other components on the same page can re-render immediately
    window.dispatchEvent(new Event('storage'));
  };

  const isSaved = (id: string) => !!savedCaretakers.find(c => c.id === id);

  return { savedCaretakers, toggleSaved, isSaved };
};
