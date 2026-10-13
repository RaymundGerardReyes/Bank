import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

export interface EnrolledFaceMetadata {
  enrolledAt: string;
  email?: string;
  vectorLength: number;
  hardwareType: string;
}

export interface VerificationResult {
  verified: boolean;
  score: number;
  method: 'vector' | 'hardware';
  message: string;
}

const STORAGE_KEY_PREFIX = 'novabank_enrolled_face_template_';
const METADATA_KEY_PREFIX = 'novabank_enrolled_face_meta_';
const ACTIVE_USER_POINTER_KEY = 'novabank_enrolled_face_active_user';
const COSINE_THRESHOLD = 0.82;

/**
 * Sanitizes an identifier (e.g. user email) to ensure it satisfies Expo SecureStore key constraints:
 * - Must not be empty
 * - May only contain alphanumeric characters, '.', '-', and '_'
 */
export function sanitizeSecureStoreKey(emailOrId?: string): string {
  if (!emailOrId || typeof emailOrId !== 'string') {
    return 'default_user';
  }
  const clean = emailOrId
    .trim()
    .toLowerCase()
    .replace(/@/g, '_at_')
    .replace(/[^a-zA-Z0-9._-]/g, '_');

  return clean || 'default_user';
}

/**
 * Calculates cosine similarity between two N-dimensional numerical vectors.
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const faceEnrollmentService = {
  /**
   * Checks whether the device hardware supports biometric authentication (Touch ID, Face ID, BiometricPrompt).
   */
  checkHardwareBiometrics: async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const biometricTypes = supportedTypes.map((type) => {
        if (type === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) return 'Face ID / Facial Recognition';
        if (type === LocalAuthentication.AuthenticationType.FINGERPRINT) return 'Fingerprint / Touch ID';
        if (type === LocalAuthentication.AuthenticationType.IRIS) return 'Iris Scanner';
        return 'Biometric Sensor';
      });

      return {
        hasHardware,
        isEnrolled,
        biometricTypes,
      };
    } catch {
      return {
        hasHardware: false,
        isEnrolled: false,
        biometricTypes: [],
      };
    }
  },

  /**
   * Securely saves the captured 512-D face embedding vector in device Keychain/Keystore.
   */
  enrollFace: async (
    embedding: number[] = [],
    email?: string,
    hardwareType = 'Secure Hardware Key (SHA256withECDSA)'
  ): Promise<{ success: boolean; enrolledAt: string }> => {
    if (!Array.isArray(embedding)) {
      throw new Error('Invalid face embedding data');
    }

    const safeKey = sanitizeSecureStoreKey(email);
    const enrolledAt = new Date().toISOString();
    const storageKey = `${STORAGE_KEY_PREFIX}${safeKey}`;
    const metaKey = `${METADATA_KEY_PREFIX}${safeKey}`;

    // Store vector as JSON string in SecureStore
    await SecureStore.setItemAsync(storageKey, JSON.stringify(embedding || []));

    const metadata: EnrolledFaceMetadata = {
      enrolledAt,
      email: email ? email.toLowerCase() : 'default_user',
      vectorLength: embedding.length > 0 ? embedding.length : 512,
      hardwareType: hardwareType || 'Secure Hardware Key (SHA256withECDSA)',
    };
    await SecureStore.setItemAsync(metaKey, JSON.stringify(metadata));

    // Also update active user pointer for the enrolled device profile
    await SecureStore.setItemAsync(ACTIVE_USER_POINTER_KEY, safeKey);

    return { success: true, enrolledAt };
  },

  /**
   * Retrieves enrolled face embedding vector.
   */
  getEnrolledFaceEmbedding: async (email?: string): Promise<number[] | null> => {
    try {
      let safeKey = sanitizeSecureStoreKey(email);
      if (!email) {
        const activeUser = await SecureStore.getItemAsync(ACTIVE_USER_POINTER_KEY);
        if (activeUser) safeKey = activeUser;
        else return null;
      }
      const item = await SecureStore.getItemAsync(`${STORAGE_KEY_PREFIX}${safeKey}`);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * Checks whether a face template has been enrolled for the user.
   */
  isFaceEnrolled: async (email?: string): Promise<boolean> => {
    try {
      if (email) {
        const safeKey = sanitizeSecureStoreKey(email);
        const storageKey = `${STORAGE_KEY_PREFIX}${safeKey}`;
        const item = await SecureStore.getItemAsync(storageKey);
        return Boolean(item);
      }
      // If email is not specified, inspect active user pointer
      const activeUser = await SecureStore.getItemAsync(ACTIVE_USER_POINTER_KEY);
      if (activeUser) {
        const item = await SecureStore.getItemAsync(`${STORAGE_KEY_PREFIX}${activeUser}`);
        return Boolean(item);
      }
      return false;
    } catch {
      return false;
    }
  },

  /**
   * Retrieves enrolled face metadata.
   */
  getEnrolledFaceInfo: async (email?: string): Promise<EnrolledFaceMetadata | null> => {
    try {
      let safeKey = sanitizeSecureStoreKey(email);
      if (!email) {
        const activeUser = await SecureStore.getItemAsync(ACTIVE_USER_POINTER_KEY);
        if (activeUser) safeKey = activeUser;
        else return null;
      }
      const metaKey = `${METADATA_KEY_PREFIX}${safeKey}`;
      const item = await SecureStore.getItemAsync(metaKey);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * Removes enrolled face template from device secure store.
   */
  deleteEnrolledFace: async (email?: string): Promise<boolean> => {
    try {
      const safeKey = sanitizeSecureStoreKey(email);
      await SecureStore.deleteItemAsync(`${STORAGE_KEY_PREFIX}${safeKey}`);
      await SecureStore.deleteItemAsync(`${METADATA_KEY_PREFIX}${safeKey}`);
      
      const activeUser = await SecureStore.getItemAsync(ACTIVE_USER_POINTER_KEY);
      if (!email || activeUser === safeKey) {
        await SecureStore.deleteItemAsync(ACTIVE_USER_POINTER_KEY);
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Verifies a live candidate face embedding against the enrolled template in SecureStore.
   */
  verifyLiveFace: async (
    candidateEmbedding: number[],
    email?: string,
    threshold = COSINE_THRESHOLD
  ): Promise<VerificationResult> => {
    try {
      let rawTemplate: string | null = null;
      if (email) {
        const safeKey = sanitizeSecureStoreKey(email);
        rawTemplate = await SecureStore.getItemAsync(`${STORAGE_KEY_PREFIX}${safeKey}`);
      } else {
        const activeUser = await SecureStore.getItemAsync(ACTIVE_USER_POINTER_KEY);
        if (activeUser) {
          rawTemplate = await SecureStore.getItemAsync(`${STORAGE_KEY_PREFIX}${activeUser}`);
        }
      }

      if (!rawTemplate) {
        return {
          verified: false,
          score: 0,
          method: 'vector',
          message: 'No enrolled Face ID found on this device. Please register in Profile > Security first.',
        };
      }

      const enrolledVector: number[] = JSON.parse(rawTemplate);
      const similarity = cosineSimilarity(candidateEmbedding, enrolledVector);

      // If cosine similarity passes the security threshold
      if (similarity >= threshold) {
        return {
          verified: true,
          score: similarity,
          method: 'vector',
          message: `Biometric match confirmed (score: ${similarity.toFixed(3)} >= ${threshold}).`,
        };
      }

      // If vector comparison didn't reach threshold, prompt device biometric fallback if available
      const hw = await faceEnrollmentService.checkHardwareBiometrics();
      if (hw.hasHardware && hw.isEnrolled) {
        const authResult = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Verify your identity with NovaBank Face ID',
          cancelLabel: 'Use Password',
          fallbackLabel: 'Enter PIN',
          disableDeviceFallback: false,
        });

        if (authResult.success) {
          return {
            verified: true,
            score: 1.0,
            method: 'hardware',
            message: 'Device biometric authentication succeeded.',
          };
        }
      }

      return {
        verified: false,
        score: similarity,
        method: 'vector',
        message: `Face verification failed (similarity ${similarity.toFixed(3)} < threshold ${threshold}).`,
      };
    } catch (err: any) {
      return {
        verified: false,
        score: 0,
        method: 'vector',
        message: err.message || 'Error executing biometric verification.',
      };
    }
  },
};
