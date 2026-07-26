import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLocked } from '../state/authSlice';
import { AutoLockManager } from '../security/AutoLockManager';

export const useAppLock = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    AutoLockManager.resetTimer();
    return () => {
      AutoLockManager.stopTimer();
    };
  }, []);

  const unlockApp = () => {
    dispatch(setLocked(false));
    AutoLockManager.resetTimer();
  };

  return { unlockApp };
};
