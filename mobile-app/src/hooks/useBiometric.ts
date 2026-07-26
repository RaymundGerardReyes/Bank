import { useState, useEffect } from 'react';
import { biometricAuthService } from '../services/auth/biometricAuthService';

export const useBiometric = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    biometricAuthService.isSupported().then(setIsSupported);
  }, []);

  const authenticate = async (promptMessage?: string): Promise<boolean> => {
    return await biometricAuthService.authenticate(promptMessage);
  };

  return { isSupported, authenticate };
};
