import { Minus, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { toMinutes, type TimeString } from '@/utils/time';

type TimeUnit = 'hour' | 'minute';

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_IN_HOUR;
const MINUTE_STEP = 5;
const HOURS_PER_ROW = 6;
const MINUTES_PER_ROW = 4;
const EMPTY_SEGMENT = '--';

const HOURS = Array.from({ length: HOURS_IN_DAY }, (_, hour) => hour);
const MINUTES = Array.from(
  { length: MINUTES_IN_HOUR / MINUTE_STEP },
  (_, index) => index * MINUTE_STEP,
);

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function toRows(values: readonly number[], perRow: number): number[][] {
  const rows: number[][] = [];
  for (let start = 0; start < values.length; start += perRow) {
    rows.push(values.slice(start, start + perRow));
  }
  return rows;
}

const HOUR_ROWS = toRows(HOURS, HOURS_PER_ROW);
const MINUTE_ROWS = toRows(MINUTES, MINUTES_PER_ROW);

type TimeSegmentProps = {
  value: number | null;
  caption: string;
  isActive: boolean;
  accessibilityLabel: string;
  onPress: () => void;
};

function TimeSegment({
  value,
  caption,
  isActive,
  accessibilityLabel,
  onPress,
}: TimeSegmentProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: isActive }}
      onPress={onPress}
      className={`h-[92px] flex-1 items-center justify-center rounded-[24px] ${
        isActive ? 'bg-navy' : 'bg-steel/10'
      }`}
    >
      <AppText
        numberOfLines={1}
        className={`font-bold text-[44px] ${isActive ? 'text-mint' : 'text-ink'}`}
      >
        {value === null ? EMPTY_SEGMENT : pad(value)}
      </AppText>
      <AppText
        numberOfLines={1}
        className={`text-[12px] ${isActive ? 'text-sage' : 'text-navy'}`}
      >
        {caption}
      </AppText>
    </PressableScale>
  );
}

type TimeChipProps = {
  value: number;
  unitLabel: string;
  isSelected: boolean;
  onPress: () => void;
};

function TimeChip({ value, unitLabel, isSelected, onPress }: TimeChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${value} ${unitLabel}`}
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      className={`h-11 flex-1 items-center justify-center rounded-[14px] ${
        isSelected ? 'bg-peach' : 'bg-steel/10'
      }`}
    >
      <AppText numberOfLines={1} className="text-[16px]">
        {pad(value)}
      </AppText>
    </Pressable>
  );
}

type MinuteStepperProps = {
  label: string;
  accessibilityLabel: string;
  Icon: typeof Plus;
  disabled: boolean;
  onPress: () => void;
};

function MinuteStepper({
  label,
  accessibilityLabel,
  Icon,
  disabled,
  onPress,
}: MinuteStepperProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`h-11 flex-1 flex-row items-center justify-center gap-1 rounded-[14px] border-[1.5px] border-dashed border-steel ${
        disabled ? 'opacity-40' : ''
      }`}
    >
      <Icon size={16} color={colors.ink} strokeWidth={ICON_STROKE_WIDTH} />
      <AppText numberOfLines={1} className="text-[14px]">
        {label}
      </AppText>
    </Pressable>
  );
}

type TimePickerSheetProps = {
  title: string;
  /** Tells the parent which ride this time belongs to. */
  subtitle: string;
  /** Null when no time has been chosen yet. */
  initialValue: TimeString | null;
  onConfirm: (time: TimeString) => void;
  onClose: () => void;
};

/** Tap the hour, tap the minutes, done. Render it only while open. */
export function TimePickerSheet({
  title,
  subtitle,
  initialValue,
  onConfirm,
  onClose,
}: TimePickerSheetProps) {
  const initialMinutes = initialValue ? toMinutes(initialValue) : null;
  const [hour, setHour] = useState(
    initialMinutes === null
      ? null
      : Math.floor(initialMinutes / MINUTES_IN_HOUR),
  );
  const [minute, setMinute] = useState(
    initialMinutes === null ? null : initialMinutes % MINUTES_IN_HOUR,
  );
  const [activeUnit, setActiveUnit] = useState<TimeUnit>('hour');

  const handleSelectHour = (selected: number) => {
    setHour(selected);
    // A full hour is the common case, so one tap is already a valid time.
    setMinute((current) => current ?? 0);
    setActiveUnit('minute');
  };

  const handleSelectMinute = (selected: number) => {
    setMinute(selected);
    if (hour === null) setActiveUnit('hour');
  };

  const handleStep = (delta: number) => {
    if (hour === null || minute === null) return;

    const total =
      (hour * MINUTES_IN_HOUR + minute + delta + MINUTES_IN_DAY) %
      MINUTES_IN_DAY;
    setHour(Math.floor(total / MINUTES_IN_HOUR));
    setMinute(total % MINUTES_IN_HOUR);
  };

  const isComplete = hour !== null && minute !== null;

  const handleConfirm = () => {
    if (!isComplete) return;
    onConfirm(`${pad(hour)}:${pad(minute)}`);
  };

  return (
    <BottomSheet closeLabel="Închide selectorul de oră" onClose={onClose}>
      <View className="gap-4 px-5 pt-5">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <AppText
              accessibilityRole="header"
              numberOfLines={1}
              className="text-[22px]"
            >
              {title}
            </AppText>
            <AppText numberOfLines={1} className="text-[13px] text-navy">
              {subtitle}
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Închide selectorul de oră"
            onPress={onClose}
            className="h-11 w-11 items-center justify-center rounded-full bg-ink/[0.08]"
          >
            <X size={22} color={colors.ink} strokeWidth={ICON_STROKE_WIDTH} />
          </Pressable>
        </View>

        <View className="flex-row items-center gap-2">
          <TimeSegment
            value={hour}
            caption="oră"
            isActive={activeUnit === 'hour'}
            accessibilityLabel={`Schimbă ora, ${hour ?? 'nealeasă'}`}
            onPress={() => setActiveUnit('hour')}
          />
          <AppText className="font-bold text-[36px]">:</AppText>
          <TimeSegment
            value={minute}
            caption="minute"
            isActive={activeUnit === 'minute'}
            accessibilityLabel={`Schimbă minutele, ${minute ?? 'nealese'}`}
            onPress={() => setActiveUnit('minute')}
          />
        </View>

        {/* Both grids take four rows, so the sheet doesn't jump between steps. */}
        <View accessibilityLiveRegion="polite" className="gap-2">
          <AppText numberOfLines={1} className="text-[13px] text-navy">
            {activeUnit === 'hour' ? 'Alege ora' : 'Alege minutele'}
          </AppText>

          {activeUnit === 'hour'
            ? HOUR_ROWS.map((row) => (
                <View key={row[0]} className="flex-row gap-2">
                  {row.map((value) => (
                    <TimeChip
                      key={value}
                      value={value}
                      unitLabel="ora"
                      isSelected={value === hour}
                      onPress={() => handleSelectHour(value)}
                    />
                  ))}
                </View>
              ))
            : MINUTE_ROWS.map((row) => (
                <View key={row[0]} className="flex-row gap-2">
                  {row.map((value) => (
                    <TimeChip
                      key={value}
                      value={value}
                      unitLabel="minute"
                      isSelected={value === minute}
                      onPress={() => handleSelectMinute(value)}
                    />
                  ))}
                </View>
              ))}

          {activeUnit === 'minute' ? (
            <View className="flex-row gap-2">
              <MinuteStepper
                label="1 min"
                accessibilityLabel="Scade un minut"
                Icon={Minus}
                disabled={!isComplete}
                onPress={() => handleStep(-1)}
              />
              <MinuteStepper
                label="1 min"
                accessibilityLabel="Adaugă un minut"
                Icon={Plus}
                disabled={!isComplete}
                onPress={() => handleStep(1)}
              />
            </View>
          ) : null}
        </View>

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={
            isComplete ? `Gata, ora ${pad(hour)}:${pad(minute)}` : 'Gata'
          }
          accessibilityState={{ disabled: !isComplete }}
          disabled={!isComplete}
          onPress={handleConfirm}
          className={`h-14 items-center justify-center rounded-full bg-navy ${
            isComplete ? '' : 'opacity-40'
          }`}
        >
          <AppText className="text-[16px] text-mint">Gata</AppText>
        </PressableScale>
      </View>
    </BottomSheet>
  );
}
