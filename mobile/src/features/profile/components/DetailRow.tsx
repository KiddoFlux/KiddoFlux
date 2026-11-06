import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';

type DetailRowProps = {
  label: string;
  value: string;
  numberOfLines?: number;
  /** Text size of the value; the profile card uses 22, the academic card 20. */
  valueClassName?: string;
};

/** A small steel label with its value underneath. Shared by every detail on the profile. */
export function DetailRow({
  label,
  value,
  numberOfLines = 1,
  valueClassName = 'text-[22px]',
}: DetailRowProps) {
  return (
    <View className="gap-1 self-stretch">
      <AppText numberOfLines={1} className="text-[13px] text-steel">
        {label}
      </AppText>
      <AppText numberOfLines={numberOfLines} className={valueClassName}>
        {value}
      </AppText>
    </View>
  );
}
