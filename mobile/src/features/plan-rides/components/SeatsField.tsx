import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';

import { MAX_SEATS, MIN_SEATS } from '../rideRules';

type SeatsFieldProps = {
  value: number;
  dayName: string;
  onChange: (seats: number) => void;
};

export function SeatsField({ value, dayName, onChange }: SeatsFieldProps) {
  const [text, setText] = useState(String(value));

  const handleChangeText = (next: string) => {
    if (next === '') {
      setText('');
      return;
    }

    const seats = Number(next);
    if (Number.isInteger(seats) && seats >= MIN_SEATS && seats <= MAX_SEATS) {
      setText(next);
      onChange(seats);
    }
  };

  return (
    <View className="h-16 flex-1 justify-center rounded-[20px] bg-steel/10 px-3">
      <AppText numberOfLines={1} className="text-[12px] text-navy">
        Locuri
      </AppText>
      <TextInput
        accessibilityLabel={`Locuri ${dayName}, între ${MIN_SEATS} și ${MAX_SEATS}`}
        value={text}
        onChangeText={handleChangeText}
        onBlur={() => setText(String(value))}
        keyboardType="number-pad"
        maxLength={1}
        selectTextOnFocus
        className="p-0 font-sans text-[20px] text-ink"
      />
    </View>
  );
}
