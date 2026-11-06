import { Text, type TextProps } from 'react-native';

const FONT_CLASS = /(^|\s)font-(regular|sans|bold)(\s|$)/;

/**
 * Text that defaults to the app font (Inter Tight Medium).
 * Pass `font-regular` or `font-bold` in className to pick another weight.
 */
export default function AppText({ className = '', ...props }: TextProps) {
  const resolved = FONT_CLASS.test(className)
    ? className
    : `font-sans ${className}`;
  return <Text className={resolved} {...props} />;
}
