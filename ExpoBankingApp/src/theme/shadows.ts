import { Platform } from 'react-native';
import { colors } from './colors';

export const shadows = {
  none: {},
  subtle: Platform.select({
    ios: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.05,
      shadowRadius: 14,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }),
  raised: Platform.select({
    ios: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
    },
    android: {
      elevation: 3,
    },
    default: {},
  }),
};
