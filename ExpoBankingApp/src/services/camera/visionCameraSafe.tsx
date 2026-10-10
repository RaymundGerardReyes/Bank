import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

export type Frame = any;
export type Code = any;
export type CameraProps = any;

let realVisionCamera: any = null;
let expoCameraModule: any = null;

try {
  expoCameraModule = require('expo-camera');
} catch (e) {
  expoCameraModule = null;
}

try {
  const ExpoConstants = (global as any).expo?.modules?.ExponentConstants;
  if (ExpoConstants?.appOwnership !== 'expo') {
    realVisionCamera = require('react-native-vision-camera');
  }
} catch {
  realVisionCamera = null;
}

/**
 * Returns true if ANY supported hardware camera provider is available (VisionCamera or ExpoCamera).
 */
export const isNativeCameraAvailable = (): boolean => {
  return Boolean(realVisionCamera || expoCameraModule);
};

/**
 * Returns true only if VisionCamera's 60FPS Worklet Frame Processor is supported.
 */
export const isWorkletFrameProcessorSupported = (): boolean => {
  return Boolean(realVisionCamera && realVisionCamera.Camera);
};

export const useCameraPermission = () => {
  if (realVisionCamera && typeof realVisionCamera.useCameraPermission === 'function') {
    return realVisionCamera.useCameraPermission();
  }

  if (expoCameraModule && typeof expoCameraModule.useCameraPermissions === 'function') {
    const [permission, requestPermission] = expoCameraModule.useCameraPermissions();
    return {
      hasPermission: Boolean(permission?.granted),
      requestPermission: async () => {
        const res = await requestPermission();
        return Boolean(res?.granted);
      },
    };
  }

  const [hasPermission, setHasPermission] = React.useState(true);
  return {
    hasPermission,
    requestPermission: async () => {
      setHasPermission(true);
      return true;
    },
  };
};

export const useCameraDevice = (position: 'front' | 'back') => {
  if (realVisionCamera && typeof realVisionCamera.useCameraDevice === 'function') {
    return realVisionCamera.useCameraDevice(position);
  }

  return {
    id: `hardware-camera-${position}`,
    position,
    hasFlash: true,
    hasTorch: true,
    isMultiCam: false,
    supportsParallelVideoProcessing: true,
    supportsLowLightBoost: false,
    supportsFocus: true,
    minZoom: 1,
    maxZoom: 1,
    neutralZoom: 1,
    minExposure: 0,
    maxExposure: 0,
    formats: [],
  };
};

export const useFrameProcessor = (callback: any, dependencies: any[] = []) => {
  if (realVisionCamera && typeof realVisionCamera.useFrameProcessor === 'function') {
    return realVisionCamera.useFrameProcessor(callback, dependencies);
  }
  return callback;
};

export const useCodeScanner = (config: any) => {
  if (realVisionCamera && typeof realVisionCamera.useCodeScanner === 'function') {
    return realVisionCamera.useCodeScanner(config);
  }
  return config;
};

export const useRunOnJS = (callback: any, dependencyList: any[] = []) => {
  if (realVisionCamera) {
    try {
      const worklets = require('react-native-worklets-core');
      if (worklets && typeof worklets.useRunOnJS === 'function') {
        return worklets.useRunOnJS(callback, dependencyList);
      }
    } catch {
      // Fallback
    }
  }
  return React.useCallback(callback, dependencyList);
};

export const Camera = React.forwardRef<any, any>((props, ref) => {
  // 1. Prefer react-native-vision-camera if active in development build
  if (realVisionCamera && realVisionCamera.Camera) {
    const RealCamera = realVisionCamera.Camera;
    return <RealCamera ref={ref} {...props} />;
  }

  // 2. Seamlessly render live camera stream via expo-camera (Expo Go & standard builds)
  if (expoCameraModule && expoCameraModule.CameraView) {
    const CameraView = expoCameraModule.CameraView;
    const facing = props.device?.position || props.facing || 'back';
    const enableTorch = props.torch === 'on' || props.enableTorch === true;

    // Route barcode scanning events
    const onBarcodeScanned = props.codeScanner?.onCodeScanned
      ? ({ data, raw, type }: any) => {
          props.codeScanner.onCodeScanned([
            {
              value: data || raw,
              type: type || 'qr',
            },
          ]);
        }
      : props.onBarcodeScanned;

    return (
      <CameraView
        ref={ref}
        style={[StyleSheet.absoluteFill, props.style]}
        facing={facing}
        enableTorch={enableTorch}
        barcodeScannerSettings={
          onBarcodeScanned
            ? {
                barcodeTypes: ['qr'],
              }
            : undefined
        }
        onBarcodeScanned={onBarcodeScanned}
      >
        {props.children}
      </CameraView>
    );
  }

  // 3. Fallback container if no camera library is available
  return (
    <View
      ref={ref}
      style={[
        props.style,
        {
          backgroundColor: colors.black,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      {props.children}
    </View>
  );
});

Camera.displayName = 'CameraSafe';
