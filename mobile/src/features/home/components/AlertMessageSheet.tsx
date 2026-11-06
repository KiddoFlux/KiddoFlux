import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';

type AlertMessageSheetProps = {
  onClose: () => void;
};

/**
 * The height of the open keyboard, or 0. The sheet sits in a Modal with a
 * translucent status and navigation bar, so Android does not resize it for the
 * keyboard on its own, and this works the same on both platforms.
 */
function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) =>
      setHeight(event.endCoordinates.height),
    );
    const hideSubscription = Keyboard.addListener(hideEvent, () =>
      setHeight(0),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return height;
}

/** A text box for a message to the other parents. Sending does nothing yet. */
export function AlertMessageSheet({ onClose }: AlertMessageSheetProps) {
  const [message, setMessage] = useState('');
  const keyboardHeight = useKeyboardHeight();

  const handleSend = () => {
    // TODO: save the message to Firebase and send it to the group's parents.
    // For now the sheet only closes.
    onClose();
  };

  return (
    <BottomSheet closeLabel="Închide mesajul" onClose={onClose}>
      <View style={{ paddingBottom: keyboardHeight }}>
        <View className="gap-4 px-5 pt-5">
          <View className="flex-row items-center gap-3">
            <AppText
              accessibilityRole="header"
              numberOfLines={1}
              className="flex-1 text-[22px]"
            >
              Mesaj pentru părinți
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Închide mesajul"
              onPress={onClose}
              className="h-11 w-11 items-center justify-center rounded-full bg-steel/10"
            >
              <X
                size={22}
                color={colors.ink}
                strokeWidth={ICON_STROKE_WIDTH}
              />
            </Pressable>
          </View>

          <TextInput
            accessibilityLabel="Mesaj pentru ceilalți părinți"
            value={message}
            onChangeText={setMessage}
            placeholder="Scrie un mesaj pentru ceilalți părinți..."
            placeholderTextColor={colors.steel}
            multiline
            autoFocus
            textAlignVertical="top"
            className="min-h-[120px] rounded-[20px] bg-steel/10 p-4 text-[16px] text-ink"
          />

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Trimite"
            onPress={handleSend}
            className="h-14 items-center justify-center rounded-full bg-navy"
          >
            <AppText className="text-[16px] text-mint">Trimite</AppText>
          </PressableScale>
        </View>
      </View>
    </BottomSheet>
  );
}
