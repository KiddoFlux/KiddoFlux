import { Bell } from 'lucide-react-native';
import { Image, Pressable, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import type { CurrentUser } from '../types';

const logo = require('../../../../assets/logo-steel.png');

// The image is 1001x160. These keep that ratio, and the file is far larger than
// the size shown, so it stays sharp on high-density screens.
const LOGO_WIDTH = 124;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 160) / 1001);

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
    <View className="flex-row items-center justify-between">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Deschide profilul"
        onPress={onOpenProfile}
      >
        <Avatar initial={user.initial} />
      </Pressable>

      {/* Centered on the screen, whatever the widths of the two buttons. */}
      <View
        pointerEvents="none"
        className="absolute inset-x-0 items-center justify-center"
      >
        <Image
          source={logo}
          accessibilityRole="image"
          accessibilityLabel="KiddoFlux"
          resizeMode="contain"
          style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT }}
        />
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
