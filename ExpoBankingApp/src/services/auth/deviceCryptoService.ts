import * as SecureStore from 'expo-secure-store';
import { sanitizeSecureStoreKey } from './faceEnrollmentService';

export interface DeviceKeyInfo {
  deviceId: string;
  publicKey: string; // Base64 SubjectPublicKeyInfo
  algorithm: string;
}

const DEVICE_ID_KEY = 'novabank_device_id';
const DEVICE_KEY_PREFIX = 'novabank_device_key_';
const DEVICE_PUB_PREFIX = 'novabank_device_pub_';

/**
 * Base64 encoding/decoding utilities compatible with React Native Hermes & web environments.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  if (typeof btoa === 'function') {
    return btoa(binary);
  }
  // Fallback if btoa is unavailable
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    result += chars[b0 >> 2];
    result += chars[((b0 & 3) << 4) | (b1 >> 4)];
    result += i + 1 < bytes.length ? chars[((b1 & 15) << 2) | (b2 >> 6)] : '=';
    result += i + 2 < bytes.length ? chars[b2 & 63] : '=';
  }
  return result;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  if (typeof atob === 'function') {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Pure JavaScript Base64 decoding fallback for Hermes / React Native
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const clean = base64.replace(/[^A-Za-z0-9+/]/g, '');
  const len = clean.length;
  const bufferLen = Math.floor((len * 3) / 4);
  const bytes = new Uint8Array(bufferLen);
  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const enc1 = chars.indexOf(clean[i]);
    const enc2 = chars.indexOf(clean[i + 1]);
    const enc3 = i + 2 < len ? chars.indexOf(clean[i + 2]) : 64;
    const enc4 = i + 3 < len ? chars.indexOf(clean[i + 3]) : 64;

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;

    if (p < bufferLen) bytes[p++] = chr1;
    if (enc3 !== 64 && p < bufferLen) bytes[p++] = chr2;
    if (enc4 !== 64 && p < bufferLen) bytes[p++] = chr3;
  }
  return bytes.slice(0, p).buffer;
}

export const deviceCryptoService = {
  /**
   * Retrieves or generates a persistent device UUID stored in device Keychain/Keystore.
   */
  getDeviceId: async (): Promise<string> => {
    try {
      let id = await SecureStore.getItemAsync(DEVICE_ID_KEY);
      if (!id) {
        id = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
        await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
      }
      return id;
    } catch {
      return 'dev_fallback_' + Date.now().toString(36);
    }
  },

  /**
   * Generates or loads the ECDSA P-256 keypair for this device bound to user email.
   * Private key is persisted exclusively in SecureStore.
   */
  getOrCreateDeviceKey: async (email?: string): Promise<DeviceKeyInfo> => {
    const deviceId = await deviceCryptoService.getDeviceId();
    const safeKey = sanitizeSecureStoreKey(email);
    const pubKeyStorage = `${DEVICE_PUB_PREFIX}${safeKey}`;
    const privKeyStorage = `${DEVICE_KEY_PREFIX}${safeKey}`;

    // 1. Check if public and private keys already exist
    const existingPub = await SecureStore.getItemAsync(pubKeyStorage);
    const existingPriv = await SecureStore.getItemAsync(privKeyStorage);

    if (existingPub && existingPriv) {
      return {
        deviceId,
        publicKey: existingPub,
        algorithm: 'SHA256withECDSA',
      };
    }

    // 2. Generate new ECDSA P-256 keypair using standard Web Crypto API
    const cryptoApi = globalThis.crypto;
    if (!cryptoApi || !cryptoApi.subtle) {
      throw new Error('Web Cryptography API is not available in the current runtime.');
    }

    const keyPair = await cryptoApi.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true,
      ['sign', 'verify']
    );

    // Export keys
    const spkiBuffer = await cryptoApi.subtle.exportKey('spki', keyPair.publicKey);
    const pkcs8Buffer = await cryptoApi.subtle.exportKey('pkcs8', keyPair.privateKey);

    const publicKeyBase64 = arrayBufferToBase64(spkiBuffer);
    const privateKeyBase64 = arrayBufferToBase64(pkcs8Buffer);

    // Store in SecureStore (Keychain on iOS, EncryptedSharedPreferences on Android)
    await SecureStore.setItemAsync(pubKeyStorage, publicKeyBase64);
    await SecureStore.setItemAsync(privKeyStorage, privateKeyBase64);

    return {
      deviceId,
      publicKey: publicKeyBase64,
      algorithm: 'SHA256withECDSA',
    };
  },

  /**
   * Signs the server challenge using the device private key with domain separation.
   */
  signChallenge: async (
    challenge: string,
    email?: string,
    purpose = 'BIOMETRIC_LOGIN'
  ): Promise<{ deviceId: string; signature: string }> => {
    const deviceId = await deviceCryptoService.getDeviceId();
    const safeKey = sanitizeSecureStoreKey(email);
    const privKeyStorage = `${DEVICE_KEY_PREFIX}${safeKey}`;

    const privKeyBase64 = await SecureStore.getItemAsync(privKeyStorage);
    if (!privKeyBase64) {
      throw new Error('Device credential not found. Please register biometric authentication first.');
    }

    const cryptoApi = globalThis.crypto;
    if (!cryptoApi || !cryptoApi.subtle) {
      throw new Error('Web Cryptography API is unavailable.');
    }

    // Import private key from PKCS#8
    const pkcs8Buffer = base64ToArrayBuffer(privKeyBase64);
    const privateKey = await cryptoApi.subtle.importKey(
      'pkcs8',
      pkcs8Buffer,
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      false,
      ['sign']
    );

    // Construct canonical domain-separated message
    const canonicalMessage = `NOVABANK_AUTH:${deviceId}:${challenge}:${purpose}`;
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(canonicalMessage);

    const signatureBuffer = await cryptoApi.subtle.sign(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' },
      },
      privateKey,
      dataBytes
    );

    const signature = arrayBufferToBase64(signatureBuffer);

    return {
      deviceId,
      signature,
    };
  },

  /**
   * Checks whether this device has an enrolled cryptographic key for the specified user.
   */
  isDeviceEnrolled: async (email?: string): Promise<boolean> => {
    try {
      const safeKey = sanitizeSecureStoreKey(email);
      const privKey = await SecureStore.getItemAsync(`${DEVICE_KEY_PREFIX}${safeKey}`);
      return Boolean(privKey);
    } catch {
      return false;
    }
  },

  /**
   * Erases the device credential for the specified user from SecureStore.
   */
  revokeLocalCredential: async (email?: string): Promise<void> => {
    try {
      const safeKey = sanitizeSecureStoreKey(email);
      await SecureStore.deleteItemAsync(`${DEVICE_KEY_PREFIX}${safeKey}`);
      await SecureStore.deleteItemAsync(`${DEVICE_PUB_PREFIX}${safeKey}`);
      await SecureStore.deleteItemAsync(DEVICE_ID_KEY);
    } catch {
      // Ignore cleanup error
    }
  },
};

