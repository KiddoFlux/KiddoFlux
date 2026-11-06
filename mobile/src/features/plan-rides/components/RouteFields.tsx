import { Lock } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';

type RouteFieldsProps = {
  homeAddress: string;
  onChangeHomeAddress: (address: string) => void;
};

export function RouteFields({
  homeAddress,
  onChangeHomeAddress,
}: RouteFieldsProps) {
  return (
    <View className="gap-2">
      <View className="h-[52px] flex-row items-center gap-2 rounded-full bg-steel/10 px-4">
        <View className="h-3 w-3 rounded-full border-2 border-navy" />
        <AppText className="text-[12px] text-navy">Acasă</AppText>
        <TextInput
          accessibilityLabel="Adresa de acasă"
          value={homeAddress}
          onChangeText={onChangeHomeAddress}
          numberOfLines={1}
          placeholder="Adresa de acasă"
          placeholderTextColor={colors.steel}
          className="flex-1 p-0 font-sans text-[15px] text-ink"
        />
      </View>

      <View
        accessible
        accessibilityLabel="Școala, adresă stabilită"
        className="h-[52px] flex-row items-center gap-2 rounded-full bg-steel/10 px-4"
      >
        <View className="h-3 w-3 rounded-full bg-peach" />
        <AppText className="text-[12px] text-navy">Școala</AppText>
        <AppText numberOfLines={1} className="flex-1 text-[15px]">
          Adresă stabilită
        </AppText>
        <Lock size={14} color={colors.steel} strokeWidth={ICON_STROKE_WIDTH} />
      </View>
    </View>
  );
}
