import { Bell, FileText, Info, LogOut, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TAB_BAR_BOTTOM_GAP,
  TAB_BAR_HEIGHT,
} from '@/components/navigation/TabBar';
import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';

import { ProfileRow } from './components/ProfileRow';
import { SettingsHeader } from './components/SettingsHeader';
import { SettingsRow } from './components/SettingsRow';
import type { SettingsUser } from './types';

const SCREEN_TOP_PADDING = 26;
const SCREEN_SIDE_PADDING = 20;
const ROW_GAP = 14;
// Rows use a 14 gap; the log out button gets 24 of space above it.
const LOGOUT_EXTRA_TOP_MARGIN = 10;

export type SettingsScreenProps = {
  user: SettingsUser;
  notificationsEnabled: boolean;
  onOpenProfile: () => void;
  onToggleNotifications: (next: boolean) => void;
  onOpenAbout: () => void;
  onOpenTerms: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
};

export function SettingsScreen({
  user,
  notificationsEnabled,
  onOpenProfile,
  onToggleNotifications,
  onOpenAbout,
  onOpenTerms,
  onDeleteAccount,
  onLogout,
}: SettingsScreenProps) {
  const insets = useSafeAreaInsets();
  // Local copy so the switch works right away, even before real data is plugged in.
  const [notifications, setNotifications] = useState(notificationsEnabled);

  const handleToggleNotifications = (next: boolean) => {
    setNotifications(next);
    onToggleNotifications(next);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Ștergi contul?', 'Această acțiune nu poate fi anulată.', [
      { text: 'Anulează', style: 'cancel' },
      { text: 'Șterge contul', style: 'destructive', onPress: onDeleteAccount },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-mint"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: ROW_GAP,
        paddingHorizontal: SCREEN_SIDE_PADDING,
        paddingTop: insets.top + SCREEN_TOP_PADDING,
        paddingBottom:
          insets.bottom + TAB_BAR_BOTTOM_GAP + TAB_BAR_HEIGHT + ROW_GAP,
      }}
    >
      <SettingsHeader user={user} onOpenProfile={onOpenProfile} />

      <ProfileRow onPress={onOpenProfile} />

      <SettingsRow
        Icon={Bell}
        trailing="switch"
        accessibilityLabel="Permite notificări"
        value={notifications}
        onValueChange={handleToggleNotifications}
      >
        Permite notificări
      </SettingsRow>

      <SettingsRow
        Icon={Info}
        accessibilityLabel="Despre KiddoFlux"
        onPress={onOpenAbout}
      >
        Despre KiddoFlux
      </SettingsRow>

      <SettingsRow
        Icon={FileText}
        accessibilityLabel="Termeni și Condiții"
        onPress={onOpenTerms}
      >
        Termeni și Condiții
      </SettingsRow>

      <SettingsRow
        Icon={Trash2}
        iconTone="sensitive"
        accessibilityLabel="Ștergere cont"
        onPress={handleDeleteAccount}
      >
        Ștergere cont
      </SettingsRow>

      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Deconectează-te"
        onPress={onLogout}
        className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-navy px-6"
        style={{ marginTop: LOGOUT_EXTRA_TOP_MARGIN }}
      >
        <LogOut size={22} color={colors.mint} strokeWidth={ICON_STROKE_WIDTH} />
        <AppText numberOfLines={1} className="text-[18px] text-mint">
          Deconectează-te
        </AppText>
      </PressableScale>
    </ScrollView>
  );
}
