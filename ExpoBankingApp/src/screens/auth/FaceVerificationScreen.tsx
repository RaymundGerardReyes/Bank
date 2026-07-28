import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import { Camera, Frame, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useRunOnJS } from 'react-native-worklets-core';

import { Button } from '../../components/common/Button';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAuth } from '../../hooks/useAuth';
import { faceAuthService } from '../../services/auth/faceAuthService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const FaceVerificationScreen = () => {
    const navigation = useNavigation<any>();
    const { setAuthenticated } = useAuth() as any;

    const { hasPermission, requestPermission } = useCameraPermission();

    const [isProcessing, setIsProcessing] = React.useState(false);
    const [statusMessage, setStatusMessage] = React.useState('Align your face within the frame.');

    // Get the front-facing camera for selfie verification
    const device = useCameraDevice('front');

    React.useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    /**
     * Executes the secure API call.
     * 3. We wrap this in React.useCallback so it retains a stable reference for the worklet hook.
     */
    const handleFaceVerification = React.useCallback(async (embedding: number[]) => {
        setIsProcessing(true);
        setStatusMessage('Verifying identity securely...');

        try {
            // Send the 512-D array to the backend, NOT a photo
            const response = await faceAuthService.verifyFace(embedding);

            setStatusMessage('Verification Successful!');
            setAuthenticated({ user: response.user });
            navigation.replace('MainTabs');

        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || 'Face verification failed. Please try again.';
            Alert.alert('Verification Failed', errorMsg);
            setStatusMessage('Align your face within the frame.');
            setIsProcessing(false);
        }
    }, [navigation, setAuthenticated]);

    // 4. Create a safely memoized function that the worklet can call to hop back to the JS thread
    const runHandleFaceVerification = useRunOnJS(handleFaceVerification, [handleFaceVerification]);

    /**
     * Frame Processor: Runs synchronously on the UI thread (via JSI/Nitro).
     */
    const frameProcessor = useFrameProcessor((frame: Frame) => {
        'worklet';
        if (isProcessing) return;

        try {
            // Mocking the analysis of the frame to satisfy TS (ts(6133))
            const isValidFrame = frame.isValid;

            // Pseudo-code representation of the SDK's expected output:
            const faceData = {
                hasFace: isValidFrame ? true : false,
                isLive: true,
                embedding: Array.from({ length: 512 }, () => Math.random())
            };

            if (faceData.hasFace && faceData.isLive) {
                const embeddingVector = faceData.embedding;

                // 5. CRITICAL: Call the memoized hook function instead of wrapping it manually
                runHandleFaceVerification(embeddingVector);
            }
        } catch (error) {
            console.error('Face processing error', error);
        }
    }, [isProcessing, runHandleFaceVerification]);

    if (!hasPermission) {
        return (
            <SecureScreenWrapper style={styles.centerContainer}>
                <Text style={styles.errorText}>Camera permission is required for secure login.</Text>
                <Button title="Grant Permission" onPress={requestPermission} />
                <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" style={{ marginTop: 16 }} />
            </SecureScreenWrapper>
        );
    }

    if (device == null) {
        return (
            <SecureScreenWrapper style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={styles.statusText}>Initializing Secure Camera...</Text>
            </SecureScreenWrapper>
        );
    }

    return (
        <SecureScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Biometric Login</Text>
                <Text style={styles.subtitle}>End-to-End Encrypted Face Verification</Text>
            </View>

            <View style={styles.cameraWrapper}>
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={!isProcessing}
                    pixelFormat="yuv"
                    {...{ frameProcessor } as any}
                />

                <View style={styles.faceGuide} />
            </View>

            <View style={styles.footer}>
                {isProcessing ? (
                    <ActivityIndicator size="large" color={colors.accent} style={{ marginBottom: spacing.md }} />
                ) : null}
                <Text style={styles.statusText}>{statusMessage}</Text>
                <Button
                    title="Cancel"
                    variant="secondary"
                    onPress={() => navigation.goBack()}
                    style={styles.cancelBtn}
                />
            </View>
        </SecureScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.dominant },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.dominant, padding: spacing.lg },
    header: { padding: spacing.lg, paddingTop: spacing.xxl, alignItems: 'center' },
    title: { color: colors.accent, fontSize: 24, fontWeight: '800' },
    subtitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', marginTop: spacing.xs },
    cameraWrapper: { flex: 1, margin: spacing.lg, borderRadius: spacing.borderRadius.lg, overflow: 'hidden', backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    faceGuide: { width: 250, height: 300, borderWidth: 3, borderColor: colors.secondary, borderRadius: 150, borderStyle: 'dashed' },
    footer: { padding: spacing.lg, paddingBottom: spacing.xxl, alignItems: 'center' },
    statusText: { color: colors.accent, fontSize: 16, fontWeight: '700', textAlign: 'center' },
    errorText: { color: colors.danger, fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: spacing.lg },
    cancelBtn: { marginTop: spacing.lg, width: '100%' },
});