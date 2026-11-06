import { Check, MessageCircle, Phone, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { AvatarStack } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';
import type { Child } from '@/types/ride';
import { toMinutes } from '@/utils/time';

import type { LiveRideState, MapRide } from '../types';
import { formatDistance, getDirectionCopy } from '../utils';
import { InfoTile } from './InfoTile';
import { ProgressTrack } from './ProgressTrack';

const BOTTOM_GAP = 18;

type LiveStatusSheetProps = {
  ride: MapRide;
  live: LiveRideState;
  /** My children in this ride. Empty when I'm only the driver. */
  myChildren: readonly Child[];
  isConfirmed: boolean;
  onClose: () => void;
  onCallDriver: () => void;
  onMessageDriver: () => void;
  onConfirmArrival: () => void;
};

function getTitle(
  myChildren: readonly Child[],
  hasArrived: boolean,
  arrivedAt: string,
): string {
  const names = myChildren.map((child) => child.name).join(', ');
  const isPlural = myChildren.length > 1;

  if (myChildren.length === 0) {
    return hasArrived ? `Ai ajuns ${arrivedAt}` : 'Ești în drum';
  }
  if (hasArrived) return `${names} ${isPlural ? 'au' : 'a'} ajuns ${arrivedAt}`;
  return `${names} ${isPlural ? 'sunt' : 'e'} în drum`;
}

export function LiveStatusSheet({
  ride,
  live,
  myChildren,
  isConfirmed,
  onClose,
  onCallDriver,
  onMessageDriver,
  onConfirmArrival,
}: LiveStatusSheetProps) {
  const insets = useSafeAreaInsets();
  const { driver } = ride;
  const copy = getDirectionCopy(ride.direction);
  const hasArrived = live.status === 'arrived';

  const lateMinutes = toMinutes(live.eta) - toMinutes(live.targetArrival);
  const isLate = !hasArrived && lateMinutes > 0;

  const shownChild = myChildren[0] ?? ride.children[0];
  const avatars = [
    ...(shownChild
      ? [
          {
            id: shownChild.id,
            initial: shownChild.initial,
            tone: 'peach' as const,
          },
        ]
      : []),
    { id: driver.id, initial: driver.initial, tone: 'sage' as const },
  ];

  const companion = driver.isCurrentUser
    ? ride.children.map((child) => child.name).join(', ')
    : driver.name;
  const distanceLabel = formatDistance(live.distanceRemainingMeters);

  return (
    <View
      className="absolute left-4 right-4 overflow-hidden rounded-[32px] bg-white"
      style={[shadows.strong, { bottom: insets.bottom + BOTTOM_GAP }]}
    >
      <View className="gap-[14px] bg-navy px-5 pb-[18px] pt-5">
        <View className="flex-row items-center gap-3">
          <AvatarStack items={avatars} size={44} ringColor={colors.navy} />
          <View className="flex-1">
            <AppText numberOfLines={2} className="text-[19px] text-mint">
              {getTitle(myChildren, hasArrived, copy.arrivedAt)}
            </AppText>
            <AppText numberOfLines={1} className="text-[13px] text-sage">
              cu {companion} · {copy.toward}
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Închide urmărirea live"
            onPress={onClose}
            className="h-11 w-11 items-center justify-center rounded-full bg-mint/[0.16]"
          >
            <X size={22} color={colors.mint} strokeWidth={ICON_STROKE_WIDTH} />
          </Pressable>
        </View>

        {hasArrived ? (
          <View
            accessible
            accessibilityLiveRegion="polite"
            accessibilityLabel={`A ajuns la ora ${live.arrivedAt ?? live.eta}`}
            className="flex-row items-center gap-3"
          >
            <Check
              size={44}
              color={colors.peach}
              strokeWidth={ICON_STROKE_WIDTH}
            />
            <AppText className="text-[52px] tracking-[-1.5px] text-mint">
              {live.arrivedAt ?? live.eta}
            </AppText>
          </View>
        ) : (
          <>
            <View
              accessible
              accessibilityLiveRegion="polite"
              accessibilityLabel={`${distanceLabel} ${copy.until}`}
              className="flex-row items-baseline gap-2"
            >
              <AppText
                numberOfLines={1}
                className="text-[52px] tracking-[-1.5px] text-mint"
              >
                {distanceLabel}
              </AppText>
              <AppText
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                className="flex-1 text-[20px] text-sage"
              >
                {copy.until}
              </AppText>
            </View>
            <ProgressTrack
              progress={live.progress}
              accessibilityLabel={`Progresul cursei ${copy.toward}`}
            />
          </>
        )}
      </View>

      <View className="gap-4 px-5 pb-5 pt-[18px]">
        <View className="flex-row gap-2">
          <InfoTile label="Preluată" value={live.pickedUpAt} tone="steel" />
          <InfoTile
            label="Estimat"
            value={live.eta}
            tone={isLate ? 'alert' : 'steel'}
            note={isLate ? `întârziere ${lateMinutes} min` : undefined}
          />
          <InfoTile label="Ora țintă" value={live.targetArrival} tone="peach" />
        </View>

        {hasArrived ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={isConfirmed ? 'Confirmat' : 'Confirmă sosirea'}
            accessibilityState={{ disabled: isConfirmed }}
            disabled={isConfirmed}
            onPress={onConfirmArrival}
            className={`h-14 flex-row items-center justify-center gap-2 rounded-full ${
              isConfirmed ? 'bg-peach' : 'bg-navy'
            }`}
          >
            {isConfirmed ? (
              <Check
                size={20}
                color={colors.ink}
                strokeWidth={ICON_STROKE_WIDTH}
              />
            ) : null}
            <AppText
              className={`text-[16px] ${isConfirmed ? 'text-ink' : 'text-mint'}`}
            >
              {isConfirmed ? 'Confirmat' : 'Confirmă sosirea'}
            </AppText>
          </PressableScale>
        ) : driver.isCurrentUser ? null : (
          <View className="flex-row gap-2">
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={`Sună șoferul, ${driver.name}`}
              onPress={onCallDriver}
              className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-navy"
            >
              <Phone
                size={20}
                color={colors.mint}
                strokeWidth={ICON_STROKE_WIDTH}
              />
              <AppText numberOfLines={1} className="text-[16px] text-mint">
                Sună șoferul
              </AppText>
            </PressableScale>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Trimite un mesaj către ${driver.name}`}
              onPress={onMessageDriver}
              className="h-14 w-14 items-center justify-center rounded-full bg-ink/[0.08]"
            >
              <MessageCircle
                size={22}
                color={colors.ink}
                strokeWidth={ICON_STROKE_WIDTH}
              />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
