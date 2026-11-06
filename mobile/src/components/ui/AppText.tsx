import { Text, type TextProps } from 'react-native';

const HAS_FONT = /(^|\s)font-(regular|sans|bold)(\s|$)/;
const HAS_COLOR =
  /(^|\s)text-(mint|navy|peach|ink|steel|sage|white)(\/\d+)?(\s|$)/;

// Defaults are skipped when overridden: NativeWind does not resolve conflicting
// utilities by their order in the class string.
export function AppText({ className = '', ...props }: TextProps) {
  const font = HAS_FONT.test(className) ? '' : 'font-sans';
  const color = HAS_COLOR.test(className) ? '' : 'text-ink';

  return <Text className={`${font} ${color} ${className}`} {...props} />;
}
