declare module 'react-native-vision-camera' {
  export const Camera: any;
  export type Frame = any;
  export function useCameraDevice(position: 'front' | 'back'): any;
  export function useCameraPermission(): {
    hasPermission: boolean;
    requestPermission: () => Promise<boolean>;
  };
  export function useFrameProcessor(processor: (frame: any) => void, deps: any[]): any;
}

declare module 'react-native-nitro-inspire-face' {
  export const InspireFace: any;
}

declare module 'react-native-worklets-core' {
  export function useRunOnJS<T extends (...args: any[]) => any>(fn: T, deps?: any[]): T;
  export function runOnJS<T extends (...args: any[]) => any>(fn: T): T;
}
