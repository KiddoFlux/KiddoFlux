import { useState } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type PressableScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
};

const PRESSED_STYLE: ViewStyle = { transform: [{ scale: 0.98 }] };

export function PressableScale({ style, ...props }: PressableScaleProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      {...props}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[style, pressed && PRESSED_STYLE]}
    />
  );
}
