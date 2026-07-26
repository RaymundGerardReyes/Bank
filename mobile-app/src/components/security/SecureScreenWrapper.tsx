import * as React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ScreenshotGuard } from '../../security/ScreenshotGuard';
import { colors } from '../../theme/colors';

interface SecureScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SecureScreenWrapper = ({ children, style }: SecureScreenWrapperProps) => {
  React.useEffect(() => {
    ScreenshotGuard.enableFlagSecure();
    return () => {
      ScreenshotGuard.disableFlagSecure();
    };
  }, []);

  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
