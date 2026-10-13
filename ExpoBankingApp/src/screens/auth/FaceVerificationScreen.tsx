import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Easing, Linking, StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from '../../services/camera/visionCameraSafe';
import { Button } from '../../components/common/Button';
import { SecureScreenWrapper } from '../../components/security/SecureScreenWrapper';
import { useAuth } from '../../hooks/useAuth';
import { faceAuthService } from '../../services/auth/faceAuthService';
import { faceEnrollmentService } from '../../services/auth/faceEnrollmentService';
import { deviceCryptoService } from '../../services/auth/deviceCryptoService';
import { tokenStorageService } from '../../services/auth/tokenStorageService';
import { pushNotificationService } from '../../services/notification/pushNotificationService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MASK_SIZE = Math.min(Math.max(Math.floor(SCREEN_WIDTH * 0.72), 240), 320);

export const FaceVerificationScreen = () => {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const { setAuthenticated } = useAuth();
    const { hasPermission, requestPermission } = useCameraPermission();

    const [isProcessing, setIsProcessing] = React.useState(false);
    const [statusMessage, setStatusMessage] = React.useState('Align your face within the frame');
    
    // JS Thread lock to debounce repeated triggers
    const isVerifyingRef = React.useRef(false);
    const hasAutoPromptedRef = React.useRef(false);

    // Smooth Animation for scanning laser line
    const scanLineAnim = React.useRef(new Animated.Value(0)).current;
    const mountAnim = React.useRef(new Animated.Value(0)).current;
    const cornerPulseAnim = React.useRef(new Animated.Value(0.6)).current;
    const successAnim = React.useRef(new Animated.Value(1)).current;

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

    // Looping scanner animation
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

    // Mount animation
    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(mountAnim, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    }, [mountAnim]);

    // Corner bracket pulse animation
    React.useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(cornerPulseAnim, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(cornerPulseAnim, {
                    toValue: 0.5,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [cornerPulseAnim]);

    const handleFaceVerification = React.useCallback(async () => {
        if (isVerifyingRef.current) return;
        isVerifyingRef.current = true;

        setIsProcessing(true);
        setStatusMessage('Verifying identity securely...');

        try {
            // 1. Check whether biometric authentication has been registered on this device
            const isEnrolled = await faceEnrollmentService.isFaceEnrolled();
            if (!isEnrolled) {
                setIsProcessing(false);
                isVerifyingRef.current = false;
                Alert.alert(
                    'Face ID Not Enrolled',
                    'Biometric Face ID has not been set up on this device.\n\nPlease sign in with your email and password, then register Face ID under Profile > Security Controls.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Sign in with Password', onPress: () => navigation.goBack() }
                    ]
                );
                return;
            }

            const faceMeta = await faceEnrollmentService.getEnrolledFaceInfo();
            const enrolledEmail = faceMeta?.email;

            const isDeviceKeyEnrolled = await deviceCryptoService.isDeviceEnrolled(enrolledEmail);
            if (!isDeviceKeyEnrolled) {
                setIsProcessing(false);
                isVerifyingRef.current = false;
                Alert.alert(
                    'Biometric Key Missing',
                    'Your device biometric key is missing or expired.\n\nPlease sign in with your email and password, then re-register Face ID under Profile > Security Controls.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Sign in with Password', onPress: () => navigation.goBack() }
                    ]
                );
                return;
            }

            // 2. Hardware biometric authentication gate (Face ID / Touch ID policy)
            setStatusMessage('Verifying biometric sensor...');
            const hw = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Verify identity with NovaBank Face ID',
                cancelLabel: 'Use Password',
                fallbackLabel: 'Enter PIN',
                disableDeviceFallback: false,
            });

            if (!hw.success) {
                if (hw.error === 'user_cancel' || hw.error === 'app_cancel') {
                    setIsProcessing(false);
                    isVerifyingRef.current = false;
                    setStatusMessage('Authentication cancelled');
                    return;
                }
                throw new Error('Biometric hardware authentication failed. Please sign in with your password.');
            }

            // 3. Request unpredictable server challenge for this registered device
            setStatusMessage('Requesting authentication challenge...');
            const deviceId = await deviceCryptoService.getDeviceId();
            const challengeData = await faceAuthService.requestChallenge(deviceId);

            if (!challengeData?.challenge) {
                throw new Error('Unable to obtain authentication challenge from server.');
            }

            // 4. Sign challenge using protected device key in SecureStore
            setStatusMessage('Signing authentication proof...');
            const { signature } = await deviceCryptoService.signChallenge(
                challengeData.challenge,
                enrolledEmail
            );

            // 5. Submit cryptographic proof to backend /api/v1/auth/device/login
            setStatusMessage('Verifying with banking server...');
            const loginResponse = await faceAuthService.loginWithDevice(
                deviceId,
                challengeData.challenge,
                signature
            );

            // Fail-closed invariant: Never grant access unless backend issued a genuine JWT token and profile
            if (!loginResponse?.token || !loginResponse?.user) {
                throw new Error('Biometric authorization failed: Banking server did not return a valid session token.');
            }

            // 6. Persist authoritative tokens in SecureStore
            await tokenStorageService.saveTokens(loginResponse.token, loginResponse.refreshToken || '');

            if (loginResponse.user.email) {
                try {
                    pushNotificationService.initialize(loginResponse.user.email);
                } catch (e) {
                    console.log('[WebSocket] STOMP notification error:', e);
                }
            }

            setStatusMessage('Verification Successful!');

            // Success flash animation
            Animated.sequence([
                Animated.timing(successAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
                Animated.timing(successAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
            ]).start();

            // Transition to authenticated application
            setTimeout(() => {
                setAuthenticated({ user: loginResponse.user });
            }, 300);

        } catch (error: any) {
            const status = error?.response?.status;
            const errMsg = error?.response?.data?.message || error?.message || 'Verification failed. Please try again.';

            if (status === 423 || errMsg.toLowerCase().includes('lock')) {
                Alert.alert(
                    'Security Alert',
                    'Your account is locked due to security restrictions. Please contact customer support.',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert(
                    'Authentication Failed',
                    errMsg,
                    [
                        { text: 'Try Again', style: 'cancel' },
                        { text: 'Sign in with Password', onPress: () => navigation.goBack() }
                    ]
                );
            }

            setStatusMessage('Align your face within the frame');
            setIsProcessing(false);
            isVerifyingRef.current = false;
        }
    }, [navigation, setAuthenticated]);

    // Auto-prompt once per focus entrance after brief camera stabilization
    React.useEffect(() => {
        if (isFocused && !hasAutoPromptedRef.current) {
            hasAutoPromptedRef.current = true;
            let active = true;
            const timer = setTimeout(() => {
                if (!active) return;
                handleFaceVerification();
            }, 1200);
            return () => {
                active = false;
                clearTimeout(timer);
            };
        } else if (!isFocused) {
            hasAutoPromptedRef.current = false;
        }
    }, [isFocused, handleFaceVerification]);

    if (!hasPermission) {
        return (
            <SecureScreenWrapper style={styles.centerContainer}>
                <View style={styles.permissionBox}>
                    <Ionicons name="camera-outline" size={52} color={colors.primary} style={{ marginBottom: 16 }} />
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
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.statusText}>Initializing Secure Camera...</Text>
            </SecureScreenWrapper>
        );
    }

    return (
        <SecureScreenWrapper style={styles.container}>
            {/* Front Camera Sensor */}
            {isFocused && (
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={isFocused && !isProcessing}
                    pixelFormat="yuv"
                />
            )}

            {/* Enterprise Dark Mask Overlay */}
            <View style={styles.overlay}>
                <View style={styles.overlayOpaque} />
                <View style={styles.overlayRow}>
                    <View style={styles.overlayOpaque} />

                    <Animated.View style={[styles.cutoutContainer, { transform: [{ scale: successAnim }] }]}>
                        <View style={[styles.cutout, isProcessing && styles.cutoutSuccess]} />

                        {!isProcessing && (
                            <Animated.View
                                style={[styles.scanLine, { transform: [{ translateY: scanLineAnim }] }]}
                            />
                        )}

                        <Animated.View style={[styles.corner, styles.topLeft, { opacity: cornerPulseAnim }]} />
                        <Animated.View style={[styles.corner, styles.topRight, { opacity: cornerPulseAnim }]} />
                        <Animated.View style={[styles.corner, styles.bottomLeft, { opacity: cornerPulseAnim }]} />
                        <Animated.View style={[styles.corner, styles.bottomRight, { opacity: cornerPulseAnim }]} />
                    </Animated.View>

                    <View style={styles.overlayOpaque} />
                </View>
                <View style={styles.overlayOpaque} />
            </View>

            <Animated.View style={[styles.uiLayer, { opacity: mountAnim }]}>
                <View style={styles.header}>
                    <Text style={styles.title}>Biometric Login</Text>
                    <Text style={styles.subtitle}>End-to-End Cryptographic Device Verification</Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.statusContainer}>
                        {isProcessing ? (
                            <ActivityIndicator size="small" color={colors.success} style={{ marginRight: 8 }} />
                        ) : (
                            <Ionicons name="shield-checkmark-outline" size={18} color={colors.white} style={{ marginRight: 8 }} />
                        )}
                        <Text style={[styles.statusText, isProcessing && { color: colors.success }]}>
                            {statusMessage}
                        </Text>
                    </View>

                    <Button
                        title={isProcessing ? "Verifying..." : "Verify with Face ID"}
                        variant="primary"
                        onPress={handleFaceVerification}
                        loading={isProcessing}
                        style={{ width: '100%', marginBottom: 12 }}
                    />

                    <Button
                        title="Sign in with Password"
                        variant="secondary"
                        onPress={() => navigation.goBack()}
                        style={styles.cancelBtn}
                    />
                </View>
            </Animated.View>
        </SecureScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.black },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: spacing.lg },

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
    statusText: { color: colors.white, fontSize: 15, fontWeight: '700' },
    cancelBtn: { width: '100%', backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 0 },

    overlay: { ...(StyleSheet.absoluteFill as object), justifyContent: 'center' },
    overlayOpaque: { flex: 1, backgroundColor: 'rgba(18, 49, 43, 0.88)' },
    overlayRow: { flexDirection: 'row', height: MASK_SIZE },

    cutoutContainer: { width: MASK_SIZE, height: MASK_SIZE, position: 'relative' },
    cutout: { flex: 1, borderRadius: MASK_SIZE / 2, backgroundColor: 'transparent' },
    cutoutSuccess: { backgroundColor: 'rgba(35, 122, 87, 0.22)' },

    scanLine: {
        position: 'absolute', top: 0, left: '5%', width: '90%', height: 3,
        backgroundColor: colors.success, shadowColor: colors.success, shadowOpacity: 0.9, shadowRadius: 10, elevation: 5,
    },

    corner: { position: 'absolute', width: 44, height: 44, borderColor: colors.success, borderWidth: 0 },
    topLeft: { top: -10, left: -10, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 22 },
    topRight: { top: -10, right: -10, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 22 },
    bottomLeft: { bottom: -10, left: -10, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 22 },
    bottomRight: { bottom: -10, right: -10, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 22 },

    permissionBox: { backgroundColor: colors.surface, padding: 30, borderRadius: 24, alignItems: 'center', width: '100%', shadowColor: colors.primary, shadowOpacity: 0.1, shadowRadius: 20 },
    errorText: { color: colors.textSecondary, fontSize: 15, fontWeight: '500', textAlign: 'center', marginBottom: 24 },
});