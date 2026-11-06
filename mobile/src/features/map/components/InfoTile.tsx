import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';

const TONE_CLASS = {
  steel: 'bg-steel/10',
  peach: 'bg-peach/[0.28]',
  alert: 'bg-peach',
} as const;

type InfoTileProps = {
  label: string;
  value: string;
  tone: keyof typeof TONE_CLASS;
  /** A short line under the value, for example "întârziere 4 min". */
  note?: string;
};

export function InfoTile({ label, value, tone, note }: InfoTileProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}${note ? `, ${note}` : ''}`}
      className={`flex-1 rounded-[18px] px-3 py-[10px] ${TONE_CLASS[tone]}`}
    >
      <AppText numberOfLines={1} className="text-[12px] text-navy">
        {label}
      </AppText>
      <AppText
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        className="text-[20px]"
      >
        {value}
      </AppText>
      {note ? (
        <AppText
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          className="text-[11px]"
        >
          {note}
        </AppText>
      ) : null}
    </View>
  );
}
