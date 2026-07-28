import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

export const passkeyService = {
  isSupported: (): boolean => {
    return typeof window !== "undefined" && window.PublicKeyCredential !== undefined;
  },

  registerPasskey: async (optionsJSON: Parameters<typeof startRegistration>[0]["optionsJSON"]) => {
    return startRegistration({ optionsJSON });
  },

  authenticatePasskey: async (optionsJSON: Parameters<typeof startAuthentication>[0]["optionsJSON"]) => {
    return startAuthentication({ optionsJSON });
  },
};
