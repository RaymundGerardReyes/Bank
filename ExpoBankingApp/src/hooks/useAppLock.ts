import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLocked } from 'src/state/authSlice';
import { AutoLockManager } from 'src/security/AutoLockManager';

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
