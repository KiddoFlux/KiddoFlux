import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TAB_BAR_BOTTOM_GAP,
  TAB_BAR_HEIGHT,
} from '@/components/navigation/TabBar';

import { AddRideCard } from './components/AddRideCard';
import { HomeHeader } from './components/HomeHeader';
import { NextRideCard } from './components/NextRideCard';
import { QuickActionsMenu } from './components/QuickActionsMenu';
import type { CurrentUser, NextRide, RideDraft } from './types';

const SCREEN_TOP_PADDING = 26;
const SCREEN_SIDE_PADDING = 20;
const SECTION_GAP = 18;

export type HomeScreenProps = {
  user: CurrentUser;
  nextRide: NextRide;
  hasUnreadNotifications: boolean;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenNextRide: () => void;
  onOpenSchedule: () => void;
  onOpenMap: () => void;
  onScanCode: () => void;
  onReportAlert: () => void;
  onPublishRide: (draft: RideDraft) => void;
};

export function HomeScreen({
  user,
  nextRide,
  hasUnreadNotifications,
  onOpenProfile,
  onOpenNotifications,
  onOpenNextRide,
  onOpenSchedule,
  onOpenMap,
  onScanCode,
  onReportAlert,
  onPublishRide,
}: HomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-mint"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: SECTION_GAP,
          paddingHorizontal: SCREEN_SIDE_PADDING,
          paddingTop: insets.top + SCREEN_TOP_PADDING,
          paddingBottom:
            insets.bottom + TAB_BAR_BOTTOM_GAP + TAB_BAR_HEIGHT + SECTION_GAP,
        }}
      >
        <HomeHeader
          user={user}
          hasUnreadNotifications={hasUnreadNotifications}
          onOpenProfile={onOpenProfile}
          onOpenNotifications={onOpenNotifications}
        />
        <NextRideCard ride={nextRide} onPress={onOpenNextRide} />
        <QuickActionsMenu
          onOpenSchedule={onOpenSchedule}
          onOpenMap={onOpenMap}
          onScanCode={onScanCode}
          onReportAlert={onReportAlert}
        />
        <AddRideCard onPublish={onPublishRide} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
