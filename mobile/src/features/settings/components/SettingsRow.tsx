import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Switch, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

// Steel at 30% opacity.
const SWITCH_OFF_TRACK = 'rgba(80, 140, 164, 0.3)';

type SettingsRowBaseProps = {
  Icon: LucideIcon;
  /** `sensitive` gives the icon ring a peach background (used for account deletion). */
  iconTone?: 'default' | 'sensitive';
  accessibilityLabel: string;
  /** A string becomes the two-tone label; pass nodes for custom content. */
  children: ReactNode;
};

type PlainRowProps = SettingsRowBaseProps & {
  trailing?: 'chevron' | 'none';
  onPress: () => void;
};

type SwitchRowProps = SettingsRowBaseProps & {
  trailing: 'switch';
  value: boolean;
  onValueChange: (next: boolean) => void;
};

export type SettingsRowProps = PlainRowProps | SwitchRowProps;

/** First word in steel, the rest in ink. A single word stays fully ink. */
function TwoToneLabel({ text }: { text: string }) {
  const firstSpace = text.indexOf(' ');

  if (firstSpace === -1) {
    return (
      <AppText numberOfLines={1} className="text-[20px] tracking-[-0.4px]">
        {text}
      </AppText>
    );
  }

  const first = text.slice(0, firstSpace);
  const rest = text.slice(firstSpace);

  return (
    <AppText numberOfLines={1} className="text-[20px] tracking-[-0.4px]">
      <AppText className="text-steel">{first}</AppText>
      {rest}
    </AppText>
  );
}

export function SettingsRow(props: SettingsRowProps) {
  const { Icon, iconTone = 'default', accessibilityLabel, children } = props;

  const handlePress = () => {
    if (props.trailing === 'switch') {
      props.onValueChange(!props.value);
    } else {
      props.onPress();
    }
  };

  return (
    <PressableScale
      accessibilityRole={props.trailing === 'switch' ? 'switch' : 'button'}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={
        props.trailing === 'switch' ? { checked: props.value } : undefined
      }
      onPress={handlePress}
      className="h-[72px] flex-row items-center gap-3 rounded-full bg-white pl-[11px] pr-5"
      style={shadows.soft}
    >
      {/* Soft filled bubble: navy tint with a navy icon, peach tint for sensitive rows. */}
      <View
        className={`h-[50px] w-[50px] items-center justify-center rounded-full ${
          iconTone === 'sensitive' ? 'bg-peach/30' : 'bg-navy/10'
        }`}
      >
        <Icon
          size={24}
          color={iconTone === 'sensitive' ? colors.ink : colors.navy}
          strokeWidth={ICON_STROKE_WIDTH}
        />
      </View>

      <View className="flex-1">
        {typeof children === 'string' ? (
          <TwoToneLabel text={children} />
        ) : (
          children
        )}
      </View>

      {props.trailing === 'switch' ? (
        // The row itself is the accessible switch; this one only draws the control.
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Switch
            value={props.value}
            onValueChange={props.onValueChange}
            trackColor={{ false: SWITCH_OFF_TRACK, true: colors.peach }}
            thumbColor={colors.white}
            ios_backgroundColor={SWITCH_OFF_TRACK}
          />
        </View>
      ) : props.trailing === 'none' ? null : (
        <View className="h-8 w-8 items-center justify-center rounded-full bg-mint">
          <ChevronRight
            size={18}
            color={colors.steel}
            strokeWidth={ICON_STROKE_WIDTH}
          />
        </View>
      )}
    </PressableScale>
  );
}
