import {
  Clock,
  QrCode,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react-native';
import { useWindowDimensions, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import {
  MAP_THUMBNAIL_HEIGHT,
  MAP_THUMBNAIL_WIDTH,
  MapThumbnail,
} from './MapThumbnail';
import { PushingPerson } from './PushingPerson';

const MENU_SCREEN_MARGIN = 16;
const ROW_GAP = 8;
const ROW_ONE_RATIO = 0.78;
const ROW_TWO_INSET = 8;

type ActionPillProps = {
  verb: string;
  noun: string;
  Icon: LucideIcon;
  width: number;
  accessibilityLabel: string;
  onPress: () => void;
};

function ActionPill({
  verb,
  noun,
  Icon,
  width,
  accessibilityLabel,
  onPress,
}: ActionPillProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className="h-[72px] flex-row items-center gap-3 rounded-full bg-white pl-[11px] pr-5"
      style={[shadows.soft, { width }]}
    >
      <View className="h-[50px] w-[50px] items-center justify-center rounded-full border-[1.5px] border-dashed border-steel">
        <Icon size={24} color={colors.ink} strokeWidth={ICON_STROKE_WIDTH} />
      </View>
      {/* Shrinks to fit when the pill is too narrow, e.g. "Scanează Cod" on 360dp. */}
      <AppText
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        className="flex-1 text-[25px] tracking-[-0.5px] text-steel"
      >
        {verb} <AppText className="text-ink">{noun}</AppText>
      </AppText>
    </PressableScale>
  );
}

type MapPillProps = {
  onPress: () => void;
};

function MapPill({ onPress }: MapPillProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Deschide harta"
      onPress={onPress}
      className="rounded-full bg-white"
      style={[
        shadows.soft,
        { width: MAP_THUMBNAIL_WIDTH, height: MAP_THUMBNAIL_HEIGHT },
      ]}
    >
      <MapThumbnail />
    </PressableScale>
  );
}

type QuickActionsMenuProps = {
  onOpenSchedule: () => void;
  onOpenMap: () => void;
  onScanCode: () => void;
  onReportAlert: () => void;
};

export function QuickActionsMenu({
  onOpenSchedule,
  onOpenMap,
  onScanCode,
  onReportAlert,
}: QuickActionsMenuProps) {
  const { width: screenWidth } = useWindowDimensions();

  const available = screenWidth - MENU_SCREEN_MARGIN * 2;
  const rowOneWidth = available * ROW_ONE_RATIO;
  const rowTwoWidth = available - ROW_TWO_INSET;
  const scanPillWidth = rowTwoWidth - MAP_THUMBNAIL_WIDTH - ROW_GAP;

  return (
    <View className="-ml-1 gap-[10px]">
      {/* The pill leaves a little room on its right, where a tiny person pushes it. */}
      <View className="flex-row items-center">
        <ActionPill
          verb="Vezi"
          noun="Program"
          Icon={Clock}
          width={rowOneWidth}
          accessibilityLabel="Vezi programul"
          onPress={onOpenSchedule}
        />
        <PushingPerson />
      </View>

      <View className="flex-row" style={{ gap: ROW_GAP }}>
        <MapPill onPress={onOpenMap} />
        <ActionPill
          verb="Scanează"
          noun="Cod"
          Icon={QrCode}
          width={scanPillWidth}
          accessibilityLabel="Scanează codul"
          onPress={onScanCode}
        />
      </View>

      <ActionPill
        verb="Raportează"
        noun="Alertă"
        Icon={TriangleAlert}
        width={available}
        accessibilityLabel="Raportează o alertă"
        onPress={onReportAlert}
      />
    </View>
  );
}
