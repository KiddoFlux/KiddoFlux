import { ArrowRight, Lock, Repeat } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

import { DEFAULT_ARRIVAL_TIME, toMinutes } from '../time';
import type { RideDraft, TimeString } from '../types';
import { TimeField } from './TimeField';

const DEFAULT_FROM = 'Acasă · Str. Lalelelor 12';
const DEFAULT_DEPARTURE_TIME: TimeString = '07:35';
const DEFAULT_SEATS = 3;
const MIN_SEATS = 1;
const MAX_SEATS = 7;

// Tap area grows from 36px to 44px without changing the chip's visual height.
const CHIP_HIT_SLOP = 4;

type AddRideCardProps = {
  onPublish: (draft: RideDraft) => void;
};

export function AddRideCard({ onPublish }: AddRideCardProps) {
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [departureTime, setDepartureTime] = useState(DEFAULT_DEPARTURE_TIME);
  const [arrivalTime, setArrivalTime] = useState(DEFAULT_ARRIVAL_TIME);
  const [seats, setSeats] = useState(DEFAULT_SEATS);
  const [seatsText, setSeatsText] = useState(String(DEFAULT_SEATS));
  const [recurring, setRecurring] = useState(false);

  const handleSeatsChange = (text: string) => {
    if (text === '') {
      setSeatsText('');
      return;
    }

    const next = Number(text);
    if (Number.isInteger(next) && next >= MIN_SEATS && next <= MAX_SEATS) {
      setSeats(next);
      setSeatsText(String(next));
    }
  };

  const trimmedFrom = from.trim();
  const isTimeOrderValid = toMinutes(departureTime) < toMinutes(arrivalTime);
  const canPublish = isTimeOrderValid && trimmedFrom.length > 0;

  const handlePublish = () => {
    if (!canPublish) return;

    onPublish({
      from: trimmedFrom,
      departureTime,
      arrivalTime,
      seats,
      recurring,
    });
  };

  return (
    <View
      className="gap-3 rounded-[28px] bg-white p-[18px]"
      style={shadows.soft}
    >
      <View className="flex-row items-center justify-between gap-3">
        <AppText numberOfLines={1} className="flex-1 text-[22px]">
          Adaugă cursă
        </AppText>
        <Pressable
          accessibilityRole="switch"
          accessibilityLabel="Cursă recurentă"
          accessibilityState={{ checked: recurring }}
          hitSlop={CHIP_HIT_SLOP}
          onPress={() => setRecurring((current) => !current)}
          className={`h-9 flex-row items-center gap-[6px] rounded-full border-[1.5px] border-dashed border-steel px-3 ${
            recurring ? 'bg-peach' : ''
          }`}
        >
          <Repeat
            size={16}
            color={colors.ink}
            strokeWidth={ICON_STROKE_WIDTH}
          />
          <AppText className="text-[13px]">Recurentă</AppText>
        </Pressable>
      </View>

      <View className="gap-2">
        <View className="h-[52px] flex-row items-center gap-2 rounded-full bg-steel/10 px-4">
          <View className="h-3 w-3 rounded-full border-2 border-navy" />
          <AppText className="text-[12px] text-navy">Plecare</AppText>
          <TextInput
            accessibilityLabel="Adresa de plecare"
            value={from}
            onChangeText={setFrom}
            numberOfLines={1}
            placeholder="Adresa de plecare"
            placeholderTextColor={colors.steel}
            className="flex-1 p-0 font-sans text-[15px] text-ink"
          />
        </View>

        <View
          accessible
          accessibilityLabel="Spre Școala, adresă stabilită"
          className="h-[52px] flex-row items-center gap-2 rounded-full bg-steel/10 px-4"
        >
          <View className="h-3 w-3 rounded-full bg-peach" />
          <AppText className="text-[12px] text-navy">Spre</AppText>
          <AppText numberOfLines={1} className="flex-1 text-[15px]">
            Școala
          </AppText>
          <Lock
            size={14}
            color={colors.steel}
            strokeWidth={ICON_STROKE_WIDTH}
          />
        </View>
      </View>

      <View className="flex-row gap-2">
        <TimeField
          label="Plecare"
          value={departureTime}
          tone="steel"
          accessibilityLabel="Alege ora de plecare"
          onChange={setDepartureTime}
        />
        <TimeField
          label="Ajung la"
          value={arrivalTime}
          tone="peach"
          accessibilityLabel="Alege ora de sosire la școală"
          onChange={setArrivalTime}
        />
        <View className="h-16 flex-1 justify-center rounded-[20px] bg-steel/10 px-3">
          <AppText numberOfLines={1} className="text-[12px] text-navy">
            Locuri
          </AppText>
          <TextInput
            accessibilityLabel={`Număr de locuri, între ${MIN_SEATS} și ${MAX_SEATS}`}
            value={seatsText}
            onChangeText={handleSeatsChange}
            onBlur={() => setSeatsText(String(seats))}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            className="p-0 font-sans text-[20px] text-ink"
          />
        </View>
      </View>

      {!isTimeOrderValid ? (
        <AppText
          accessibilityLiveRegion="polite"
          className="text-[13px] text-navy"
        >
          Ora de plecare trebuie să fie înainte de ora de sosire.
        </AppText>
      ) : null}
      {trimmedFrom.length === 0 ? (
        <AppText
          accessibilityLiveRegion="polite"
          className="text-[13px] text-navy"
        >
          Completează adresa de plecare.
        </AppText>
      ) : null}

      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Publică cursa"
        accessibilityState={{ disabled: !canPublish }}
        disabled={!canPublish}
        onPress={handlePublish}
        className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-navy ${
          canPublish ? '' : 'opacity-50'
        }`}
      >
        <AppText className="text-[16px] text-mint">Publică cursa</AppText>
        <ArrowRight
          size={20}
          color={colors.mint}
          strokeWidth={ICON_STROKE_WIDTH}
        />
      </PressableScale>
    </View>
  );
}
