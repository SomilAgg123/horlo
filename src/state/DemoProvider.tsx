import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { catalogue, type Watch } from '../data/catalogue';
import { freshDemo, readDemo, writeDemo, type DemoState } from './storage';

interface DemoContextValue {
  state: DemoState;
  watches: Watch[];
  toast: string;
  warning: string;
  notify: (message: string) => void;
  toggleWatch: (id: string) => void;
  addCustomWatch: (watch: Watch) => void;
  saveProfile: (profile: DemoState['profile']) => void;
  reset: () => void;
}
const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => {
    try {
      return readDemo(window.localStorage);
    } catch {
      return {
        state: freshDemo(),
        warning: 'Browser storage is unavailable. Changes will last for this visit only.',
      };
    }
  });
  const [state, setState] = useState(initial.state);
  const [warning, setWarning] = useState(initial.warning);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      if (!writeDemo(window.localStorage, state))
        setWarning(
          'Browser storage is full or unavailable. Your latest changes will last for this visit only.',
        );
    } catch {
      setWarning('Browser storage is unavailable. Changes will last for this visit only.');
    }
  }, [state]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const watches = [...catalogue, ...state.customWatches];
  function toggleWatch(id: string) {
    const removing = state.collectionIds.includes(id);
    setState((current) => ({
      ...current,
      collectionIds: current.collectionIds.includes(id)
        ? current.collectionIds.filter((item) => item !== id)
        : [...current.collectionIds, id],
    }));
    setToast(removing ? 'Watch removed from your collection' : 'Watch added to your collection');
  }
  function addCustomWatch(watch: Watch) {
    setState((current) => ({
      ...current,
      customWatches: [...current.customWatches, watch],
      collectionIds: [...current.collectionIds, watch.id],
    }));
    setToast('Your watch is now in your collection');
  }
  function saveProfile(profile: DemoState['profile']) {
    setState((current) => ({ ...current, profile }));
    setToast('Collector profile updated');
  }
  function reset() {
    setState(freshDemo());
    setWarning('');
    setToast('Demo reset. A fresh start for your collection.');
  }
  return (
    <DemoContext.Provider
      value={{
        state,
        watches,
        toast,
        warning,
        notify: setToast,
        toggleWatch,
        addCustomWatch,
        saveProfile,
        reset,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used inside DemoProvider');
  return context;
}
