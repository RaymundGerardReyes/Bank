import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { ActivityIndicator, Alert, Animated, Easing, Linking, StyleSheet, Text, View } from 'react-native';
import { Camera, Frame, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useRunOnJS } from 'react-native-worklets-core';
import { Button } from '../../components/common/Button';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAuth } from '../../hooks/useAuth';
import { faceAuthService } from '../../services/auth/faceAuthService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const MASK_SIZE = 280;

export const FaceVerificationScreen = () => {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused(); // Track screen focus for camera lifecycle
    const { setAuthenticated } = useAuth() as any;
    const { hasPermission, requestPermission } = useCameraPermission();

    const [isProcessing, setIsProcessing] = React.useState(false);
    const [statusMessage, setStatusMessage] = React.useState('Align your face within the frame');
    
    // JS Thread lock to debounce 60FPS worklet calls
    const isVerifyingRef = React.useRef(false);

    // Smooth Animation for the scanning laser line
    const scanLineAnim = React.useRef(new Animated.Value(0)).current;
    const device = useCameraDevice('front');

    const handleRequestPermission = React.useCallback(async () => {
        const granted = await requestPermission();
        if (!granted) {
            Alert.alert(
                'Camera Access Denied',
                'Please enable camera access in your device settings to securely verify your identity.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() }
                ]
            );
        }
    }, [requestPermission]);

    React.useEffect(() => {
        if (!hasPermission) requestPermission();
    }, [hasPermission, requestPermission]);

    // Start the looping scanner animation
    React.useEffect(() => {
        const loopAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, {
                    toValue: MASK_SIZE,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scanLineAnim, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        );
        loopAnimation.start();
        return () => loopAnimation.stop();
    }, [scanLineAnim]);

    const handleFaceVerification = React.useCallback(async (embedding: number[]) => {
        if (isVerifyingRef.current) return;
        isVerifyingRef.current = true;

        setIsProcessing(true);
        setStatusMessage('Verifying identity securely...');

        try {
            const response = await faceAuthService.verifyFace(embedding);
            setStatusMessage('Verification Successful!');

            // 2. Wait 300ms for the Android OS to gracefully halt the camera sensor.
            // This explicitly prevents the 'ViewNotFoundError' crash!
            setTimeout(() => {
                // 3. Dispatch global state. RootNavigator will AUTOMATICALLY swap 
                // AuthNavigator -> MainStackNavigator. NO manual navigation required!
                setAuthenticated({ user: response.user });
            }, 300);

        } catch (error: any) {
            // ONLY unlock the camera if verification actually failed
            const errorMsg = error?.response?.data?.message || 'Verification failed. Please try again.';
            Alert.alert('Security Alert', errorMsg);
            setStatusMessage('Align your face within the frame');

            setIsProcessing(false);
            isVerifyingRef.current = false;
        }
    }, [setAuthenticated]);

    const runHandleFaceVerification = useRunOnJS(handleFaceVerification, [handleFaceVerification]);

    const frameProcessor = useFrameProcessor((frame: Frame) => {
        'worklet';

        try {
            const isValidFrame = frame.isValid;
            const faceData = {
                hasFace: isValidFrame ? true : false,
                isLive: true,
                embedding: Array.from({ length: 512 }, () => Math.random()) // Simulated 512D Vector
            };

            if (faceData.hasFace && faceData.isLive) {
                runHandleFaceVerification(faceData.embedding);
            }
        } catch (error) {
            console.error('Face processing error', error);
        }
    }, [runHandleFaceVerification]);

    if (!hasPermission) {
        return (
            <SecureScreenWrapper style={styles.centerContainer}>
                <View style={styles.permissionBox}>
                    <Text style={styles.permissionIcon}>📷</Text>
                    <Text style={styles.title}>Camera Access</Text>
                    <Text style={styles.errorText}>Camera permission is required for secure authentication.</Text>
                    <Button title="Enable Camera" onPress={handleRequestPermission} />
                    <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" style={{ marginTop: 12 }} />
                </View>
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
            {/* Bind isActive to isFocused and !isProcessing to freeze frame on success */}
            {isFocused && (
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={isFocused && !isProcessing}
                    pixelFormat="yuv"
                    {...{ frameProcessor } as any}
                />
            )}

            {/* Enterprise Dark Mask Overlay */}
            <View style={styles.overlay}>
                <View style={styles.overlayOpaque} />
                <View style={styles.overlayRow}>
                    <View style={styles.overlayOpaque} />

                    <View style={styles.cutoutContainer}>
                        <View style={[styles.cutout, isProcessing && styles.cutoutSuccess]} />

                        {!isProcessing && (
                            <Animated.View
                                style={[styles.scanLine, { transform: [{ translateY: scanLineAnim }] }]}
                            />
                        )}

                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>

                    <View style={styles.overlayOpaque} />
                </View>
                <View style={styles.overlayOpaque} />
            </View>

            <View style={styles.uiLayer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Biometric Login</Text>
                    <Text style={styles.subtitle}>End-to-End Encrypted Verification</Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.statusContainer}>
                        {isProcessing ? (
                            <ActivityIndicator size="small" color={colors.success} style={{ marginRight: 8 }} />
                        ) : (
                            <Text style={styles.statusIcon}>🔒</Text>
                        )}
                        <Text style={[styles.statusText, isProcessing && { color: colors.success }]}>
                            {statusMessage}
                        </Text>
                    </View>

                    <Button
                        title="Cancel"
                        variant="secondary"
                        onPress={() => navigation.goBack()}
                        style={styles.cancelBtn}
                    />
                </View>
            </View>
        </SecureScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.dominant, padding: spacing.lg },

    uiLayer: { flex: 1, justifyContent: 'space-between', paddingVertical: 60, paddingHorizontal: spacing.lg },
    header: { alignItems: 'center' },
    title: { color: colors.white, fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
    subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600', marginTop: 4 },
    footer: { alignItems: 'center', paddingBottom: spacing.lg },

    statusContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30, marginBottom: spacing.xl,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
    },
    statusIcon: { fontSize: 16, marginRight: 8 },
    statusText: { color: colors.white, fontSize: 15, fontWeight: '700' },
    cancelBtn: { width: '100%', backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 0 },

    overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center' },
    overlayOpaque: { flex: 1, backgroundColor: 'rgba(15, 44, 89, 0.85)' },
    overlayRow: { flexDirection: 'row', height: MASK_SIZE },

    cutoutContainer: { width: MASK_SIZE, height: MASK_SIZE, position: 'relative' },
    cutout: { flex: 1, borderRadius: MASK_SIZE / 2, backgroundColor: 'transparent' },
    cutoutSuccess: { backgroundColor: 'rgba(22, 163, 74, 0.2)' },

    scanLine: {
        position: 'absolute', top: 0, left: '5%', width: '90%', height: 3,
        backgroundColor: '#38BDF8', shadowColor: '#38BDF8', shadowOpacity: 1, shadowRadius: 10, elevation: 5,
    },

    corner: { position: 'absolute', width: 40, height: 40, borderColor: '#38BDF8', borderWidth: 0 },
    topLeft: { top: -10, left: -10, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 20 },
    topRight: { top: -10, right: -10, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 20 },
    bottomLeft: { bottom: -10, left: -10, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 20 },
    bottomRight: { bottom: -10, right: -10, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 20 },

    permissionBox: { backgroundColor: colors.surface, padding: 30, borderRadius: 24, alignItems: 'center', width: '100%', shadowColor: colors.accent, shadowOpacity: 0.1, shadowRadius: 20 },
    permissionIcon: { fontSize: 48, marginBottom: 16 },
    errorText: { color: colors.textSecondary, fontSize: 15, fontWeight: '500', textAlign: 'center', marginBottom: 24 },
});