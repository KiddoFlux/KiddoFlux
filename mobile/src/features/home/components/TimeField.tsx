import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';

import { dateToTime, timeToDate } from '../time';
import type { TimeString } from '../types';

const PICKER_LOCALE = 'ro-RO';

type TimeFieldProps = {
  label: string;
  value: TimeString;
  tone: 'steel' | 'peach';
  accessibilityLabel: string;
  onChange: (time: TimeString) => void;
};

export function TimeField({
  label,
  value,
  tone,
  accessibilityLabel,
  onChange,
}: TimeFieldProps) {
  const insets = useSafeAreaInsets();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [draft, setDraft] = useState(() => timeToDate(value));

  const handlePress = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode: 'time',
        is24Hour: true,
        value: timeToDate(value),
        onValueChange: (_event, date) => onChange(dateToTime(date)),
      });
      return;
    }

    setDraft(timeToDate(value));
    setIsSheetOpen(true);
  };

  const handleConfirm = () => {
    onChange(dateToTime(draft));
    setIsSheetOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel}, ora ${value}`}
        onPress={handlePress}
        className={`h-16 flex-1 justify-center rounded-[20px] px-3 ${
          tone === 'peach' ? 'bg-peach/30' : 'bg-steel/10'
        }`}
      >
        <AppText numberOfLines={1} className="text-[12px] text-navy">
          {label}
        </AppText>
        <AppText numberOfLines={1} className="text-[20px]">
          {value}
        </AppText>
      </Pressable>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={isSheetOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setIsSheetOpen(false)}
        >
          <View className="flex-1 justify-end">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Închide selectorul de oră"
              className="flex-1"
              onPress={() => setIsSheetOpen(false)}
            />
            <View
              className="gap-3 rounded-t-[28px] bg-white px-5 pt-5"
              style={{ paddingBottom: insets.bottom + 20 }}
            >
              <AppText className="text-[22px]">{label}</AppText>
              <DateTimePicker
                mode="time"
                display="spinner"
                is24Hour
                locale={PICKER_LOCALE}
                themeVariant="light"
                textColor={colors.ink}
                value={draft}
                onValueChange={(_event, date) => setDraft(date)}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Gata"
                onPress={handleConfirm}
                className="h-14 items-center justify-center rounded-full bg-navy"
              >
                <AppText className="text-[16px] text-mint">Gata</AppText>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}
