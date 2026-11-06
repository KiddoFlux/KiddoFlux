import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { dateToTime, timeToDate, type TimeString } from '@/utils/time';

const PICKER_LOCALE = 'ro-RO';

const EMPTY_TIME_LABEL = '--:--';

type TimeFieldProps = {
  label: string;
  /** Null until the parent picks a time. */
  value: TimeString | null;
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
  const [draft, setDraft] = useState(() => new Date());

  const handlePress = () => {
    // With no time chosen yet, the picker simply opens at the current time.
    const initialDate = value ? timeToDate(value) : new Date();

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode: 'time',
        is24Hour: true,
        value: initialDate,
        onValueChange: (_event, date) => onChange(dateToTime(date)),
      });
      return;
    }

    setDraft(initialDate);
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
        accessibilityLabel={`${accessibilityLabel}, ${
          value ? `ora ${value}` : 'nealeasă'
        }`}
        onPress={handlePress}
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
