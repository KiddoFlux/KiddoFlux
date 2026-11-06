import type { BottomTabBarProps } from 'expo-router/js-tabs';
import {
  Calendar,
  House,
  Map as MapIcon,
  Settings,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

export const TAB_BAR_HEIGHT = 68;
export const TAB_BAR_BOTTOM_GAP = 18;

type TabDefinition = {
  routeName: string;
  label: string;
  Icon: LucideIcon;
};

const TABS: readonly TabDefinition[] = [
  { routeName: 'index', label: 'Acasă', Icon: House },
  { routeName: 'harta', label: 'Hartă', Icon: MapIcon },
  { routeName: 'calendar', label: 'Calendar', Icon: Calendar },
  { routeName: 'setari', label: 'Setări', Icon: Settings },
];

export function TabBar({
  state,
  emitter,
  navigateToTab,
  insets,
}: BottomTabBarProps) {
  const activeRoute = state.routes[state.index];

  return (
    <View
      className="absolute left-5 right-5 flex-row items-center justify-between rounded-full bg-ink p-2"
      style={[
        shadows.dark,
        {
          height: TAB_BAR_HEIGHT,
          bottom: insets.bottom + TAB_BAR_BOTTOM_GAP,
        },
      ]}
    >
      {TABS.map(({ routeName, label, Icon }) => {
        // A tab without a route yet stays inert (Acasă, Hartă and Calendar for now).
        // A tab stays inert until its route exists (Hartă and Profil for now).
        const route = state.routes.find((item) => item.name === routeName);
        const isActive = route !== undefined && route.key === activeRoute?.key;

        const handlePress = () => {
          if (!route) return;

          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isActive && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        };

        return (
          <Pressable
            key={routeName}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: isActive, disabled: !route }}
            disabled={!route}
            onPress={handlePress}
            className={
              isActive
                ? 'h-[52px] flex-row items-center gap-2 rounded-full bg-peach px-4'
                : 'h-[52px] w-[52px] items-center justify-center rounded-full'
            }
          >
            <Icon
              size={22}
              color={isActive ? colors.ink : colors.mint}
              strokeWidth={ICON_STROKE_WIDTH}
            />
            {isActive ? (
              <AppText numberOfLines={1} className="text-[16px]">
                {label}
              </AppText>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
