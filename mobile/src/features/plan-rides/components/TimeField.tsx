import { useState } from 'react';
import { Pressable } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import type { TimeString } from '@/utils/time';

import { TimePickerSheet } from './TimePickerSheet';

const EMPTY_TIME_LABEL = '--:--';

type TimeFieldProps = {
  label: string;
  /** Null until the parent picks a time. */
  value: TimeString | null;
  tone: 'steel' | 'peach';
  accessibilityLabel: string;
  /** Shown in the picker, to tell which ride this time belongs to. */
  pickerSubtitle: string;
  onChange: (time: TimeString) => void;
};

export function TimeField({
  label,
  value,
  tone,
  accessibilityLabel,
  pickerSubtitle,
  onChange,
}: TimeFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel}, ${
          value ? `ora ${value}` : 'nealeasă'
        }`}
        onPress={() => setIsPickerOpen(true)}
        className={`h-16 flex-1 justify-center rounded-[20px] px-3 ${
          tone === 'peach' ? 'bg-peach/30' : 'bg-steel/10'
        }`}
      >
        <AppText numberOfLines={1} className="text-[12px] text-navy">
          {label}
        </AppText>
        <AppText
          numberOfLines={1}
          className={`text-[20px] ${value ? 'text-ink' : 'text-steel'}`}
        >
          {value ?? EMPTY_TIME_LABEL}
        </AppText>
      </Pressable>

      {isPickerOpen ? (
        <TimePickerSheet
          title={label}
          subtitle={pickerSubtitle}
          initialValue={value}
          onClose={() => setIsPickerOpen(false)}
          onConfirm={(time) => {
            onChange(time);
            setIsPickerOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
