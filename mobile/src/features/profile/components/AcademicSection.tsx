import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { shadows } from '@/theme/shadows';

import { DetailRow } from './DetailRow';

export type AcademicField = {
  label: string;
  value: string;
  numberOfLines?: number;
};

type AcademicSectionProps = {
  /** One detail row per entry, so more fields can be added without touching the layout. */
  fields: readonly AcademicField[];
};

export function AcademicSection({ fields }: AcademicSectionProps) {
  return (
    <View className="gap-3">
      <AppText
        accessibilityRole="header"
        className="font-bold text-[20px]"
        numberOfLines={1}
      >
        Informații academice
      </AppText>

      <View className="gap-5 rounded-[28px] bg-white p-5" style={shadows.soft}>
        {fields.map((field) => (
          <DetailRow
            key={field.label}
            label={field.label}
            value={field.value}
            numberOfLines={field.numberOfLines}
            valueClassName="text-[20px]"
          />
        ))}
      </View>
    </View>
  );
}
