import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

import type { SettingsUser } from '../types';

const AVATAR_SIZE = 72;

type SettingsHeaderProps = {
  user: SettingsUser;
  onOpenProfile: () => void;
};

export function SettingsHeader({ user, onOpenProfile }: SettingsHeaderProps) {
  return (
    <View className="flex-row items-center gap-4">
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Deschide profilul"
        onPress={onOpenProfile}
        // A solid background lets the shadow render on Android too.
        style={[
          shadows.soft,
          {
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
            backgroundColor: colors.white,
          },
        ]}
      >
        <Avatar initial={user.initial} size={AVATAR_SIZE} />
      </PressableScale>

      <AppText
        accessibilityRole="header"
        numberOfLines={1}
        className="flex-1 font-bold text-[32px] tracking-[-0.6px]"
      >
        Setări
      </AppText>
    </View>
  );
}
