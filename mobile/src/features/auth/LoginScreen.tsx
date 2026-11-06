import { LogIn } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  type TextInputInstance,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';

const SCREEN_SIDE_PADDING = 24;

export type LoginScreenProps = {
  /** Arunca o eroare cu un mesaj gata de afisat daca autentificarea esueaza. */
  onSubmit: (telefon: string, cod: string) => Promise<void>;
};

export function LoginScreen({ onSubmit }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const codRef = useRef<TextInputInstance>(null);
  const [telefon, setTelefon] = useState('');
  const [cod, setCod] = useState('');
  const [eroare, setEroare] = useState<string | null>(null);
  const [seTrimite, setSeTrimite] = useState(false);

  const poateTrimite = telefon.trim().length > 0 && cod.length > 0 && !seTrimite;

  const handleSubmit = async () => {
    if (!poateTrimite) return;

    setEroare(null);
    setSeTrimite(true);
    try {
      await onSubmit(telefon, cod);
      // La succes, ecranul este inlocuit automat de aplicatie.
    } catch (e) {
      setEroare(e instanceof Error ? e.message : 'Nu te-am putut conecta.');
      setSeTrimite(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-mint"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          gap: 28,
          paddingHorizontal: SCREEN_SIDE_PADDING,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View className="gap-2">
          <AppText
            accessibilityRole="header"
            className="font-bold text-[34px] tracking-[-0.6px] text-navy"
          >
            KiddoFlux
          </AppText>
          <AppText className="text-[18px] text-steel">
            Conectează-te cu numărul de telefon al părintelui.
          </AppText>
        </View>

        <View
          className="gap-4 rounded-[32px] bg-white p-6"
          style={shadows.strong}
        >
          <View className="gap-1">
            <AppText className="text-[13px] text-steel">Număr de telefon</AppText>
            <TextInput
              accessibilityLabel="Număr de telefon"
              value={telefon}
              onChangeText={setTelefon}
              placeholder="07xx xxx xxx"
              placeholderTextColor={colors.steel}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => codRef.current?.focus()}
              editable={!seTrimite}
              className="h-[52px] rounded-full bg-steel/10 px-4 font-sans text-[18px] text-ink"
            />
          </View>

          <View className="gap-1">
            <AppText className="text-[13px] text-steel">Cod de acces</AppText>
            <TextInput
              ref={codRef}
              accessibilityLabel="Cod de acces"
              value={cod}
              onChangeText={setCod}
              placeholder="Codul tău"
              placeholderTextColor={colors.steel}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              editable={!seTrimite}
              className="h-[52px] rounded-full bg-steel/10 px-4 font-sans text-[18px] text-ink"
            />
          </View>

          {eroare ? (
            <View
              accessibilityRole="alert"
              className="rounded-[20px] bg-peach/30 px-4 py-3"
            >
              <AppText className="text-[15px]">{eroare}</AppText>
            </View>
          ) : null}

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Conectează-te"
            accessibilityState={{ disabled: !poateTrimite, busy: seTrimite }}
            disabled={!poateTrimite}
            onPress={handleSubmit}
            className={`h-14 flex-row items-center justify-center gap-2 rounded-full bg-navy px-6 ${
              poateTrimite ? '' : 'opacity-50'
            }`}
          >
            {seTrimite ? (
              <ActivityIndicator color={colors.mint} />
            ) : (
              <LogIn size={22} color={colors.mint} strokeWidth={ICON_STROKE_WIDTH} />
            )}
            <AppText numberOfLines={1} className="text-[18px] text-mint">
              Conectează-te
            </AppText>
          </PressableScale>
        </View>

        {/* Doar pentru demo: conturi fictive. Sterge blocul cand apar conturi reale. */}
        <AppText className="text-center text-[13px] text-steel">
          Cont demo: 0700 100 001 · cod 123456
        </AppText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
