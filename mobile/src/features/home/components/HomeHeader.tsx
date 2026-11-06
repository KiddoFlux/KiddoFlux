import { Bell } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import type { CurrentUser } from '../types';

type HomeHeaderProps = {
  user: CurrentUser;
  hasUnreadNotifications: boolean;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
};

export function HomeHeader({
  user,
  hasUnreadNotifications,
  onOpenProfile,
  onOpenNotifications,
}: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <View className="flex-1 flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Deschide profilul"
          onPress={onOpenProfile}
        >
          <Avatar initial={user.initial} />
        </Pressable>
        <View className="flex-1">
          <AppText numberOfLines={1} className="text-[13px] text-navy">
            {user.greeting}
          </AppText>
          <AppText numberOfLines={1} className="text-[22px] tracking-[-0.4px]">
            {user.name}
          </AppText>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          hasUnreadNotifications
            ? 'Notificări, ai notificări necitite'
            : 'Notificări'
        }
        onPress={onOpenNotifications}
        className="h-12 w-12 items-center justify-center rounded-full bg-white"
        style={shadows.soft}
      >
        <Bell size={22} color={colors.ink} strokeWidth={ICON_STROKE_WIDTH} />
        {hasUnreadNotifications ? (
          <View className="absolute right-[10px] top-[10px] h-[13px] w-[13px] rounded-full border-2 border-white bg-peach" />
        ) : null}
      </Pressable>
    </View>
  );
}
