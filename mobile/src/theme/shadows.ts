import type { ViewStyle } from 'react-native';

import { colors } from './colors';

export const shadows = {
  soft: {
    shadowColor: colors.navy,
    shadowOpacity: 0.14,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  strong: {
    shadowColor: colors.navy,
    shadowOpacity: 0.3,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  peach: {
    shadowColor: colors.peach,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  dark: {
    shadowColor: colors.ink,
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
} satisfies Record<string, ViewStyle>;
