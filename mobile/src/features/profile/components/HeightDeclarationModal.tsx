import {
  Baby,
  Check,
  CheckCircle2,
  Minus,
  Plus,
  Ruler,
  Shield,
  Sparkles,
  X,
} from 'lucide-react-native';
import { useId, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';
import { ICON_STROKE_WIDTH } from '@/theme/icons';
import { shadows } from '@/theme/shadows';
import type { Copil } from '@/types/profil';
import { determinaTipScaun } from '@/utils/scaunAuto';

const MIN_HEIGHT = 60;
const MAX_HEIGHT = 200;

export type HeightDeclarationModalProps = {
  visible: boolean;
  /** Daca este true, utilizatorul NU poate inchide modalul fara salvare/confirmare (blocant). */
  isBlocking?: boolean;
  motiv: 'prima_autentificare' | 'lunar' | 'manual';
  copii: Copil[];
  onSave: (copiiActualizati: Copil[]) => Promise<void>;
  onConfirmUnchanged?: () => Promise<void>;
  onClose?: () => void;
};

export function HeightDeclarationModal({
  visible,
  isBlocking = true,
  motiv,
  copii,
  onSave,
  onConfirmUnchanged,
  onClose,
}: HeightDeclarationModalProps) {
  const insets = useSafeAreaInsets();
  const inputId = useId();

  // State local pentru inaltimile fiecarui copil
  const [inaltimi, setInaltimi] = useState<number[]>(() =>
    copii.map((c) => (c.inaltimeCm >= MIN_HEIGHT ? c.inaltimeCm : 120)),
  );
  const [seSalveaza, setSeSalveaza] = useState(false);
  const [eroare, setEroare] = useState<string | null>(null);

  if (!visible) return null;

  const actualizeazaInaltime = (index: number, valoare: number) => {
    const clamped = Math.max(
      MIN_HEIGHT,
      Math.min(MAX_HEIGHT, Math.round(valoare)),
    );
    setInaltimi((prev) => {
      const urmator = [...prev];
      urmator[index] = clamped;
      return urmator;
    });
  };

  const handleSave = async () => {
    setEroare(null);
    setSeSalveaza(true);
    try {
      const actualizati = copii.map((copil, idx) => ({
        ...copil,
        inaltimeCm: inaltimi[idx] ?? copil.inaltimeCm,
      }));
      await onSave(actualizati);
      if (!isBlocking && onClose) {
        onClose();
      }
    } catch (e) {
      setEroare(e instanceof Error ? e.message : 'Eroare la salvare.');
      setSeSalveaza(false);
    }
  };

  const handleConfirmUnchanged = async () => {
    if (!onConfirmUnchanged) return;
    setEroare(null);
    setSeSalveaza(true);
    try {
      await onConfirmUnchanged();
      if (!isBlocking && onClose) {
        onClose();
      }
    } catch (e) {
      setEroare(e instanceof Error ? e.message : 'Eroare la confirmare.');
      setSeSalveaza(false);
    }
  };

  const estePrimaAutentificare = motiv === 'prima_autentificare';
  const esteLunar = motiv === 'lunar';

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="fade"
      onRequestClose={isBlocking ? () => {} : onClose}
    >
      <View className="flex-1 justify-end bg-ink/50">
        {/* Backdrop dismiss doar daca nu e blocant */}
        {!isBlocking && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Închide"
            onPress={onClose}
            className="absolute inset-0"
          />
        )}

        <View
          accessibilityViewIsModal
          className="max-h-[92%] overflow-hidden rounded-t-[32px] bg-white"
          style={{
            paddingBottom: Math.max(insets.bottom, 20) + 16,
            ...shadows.strong,
          }}
        >
          {/* Header */}
          <View className="border-b border-mint/80 px-6 pb-4 pt-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-2xl bg-mint">
                  {estePrimaAutentificare ? (
                    <Sparkles
                      size={22}
                      color={colors.navy}
                      strokeWidth={ICON_STROKE_WIDTH}
                    />
                  ) : (
                    <Ruler
                      size={22}
                      color={colors.navy}
                      strokeWidth={ICON_STROKE_WIDTH}
                    />
                  )}
                </View>
                <View>
                  <AppText className="font-bold text-[22px] tracking-[-0.4px] text-navy">
                    {estePrimaAutentificare
                      ? 'Bun venit în KiddoFlux!'
                      : esteLunar
                        ? 'Verificare lunară a înălțimii'
                        : 'Actualizează înălțimea'}
                  </AppText>
                  <AppText className="text-[13px] text-steel">
                    {estePrimaAutentificare
                      ? 'Obligatoriu pentru stabilirea scaunului auto'
                      : esteLunar
                        ? 'Actualizare lunară obligatorie de siguranță'
                        : 'Actualizare date elev'}
                  </AppText>
                </View>
              </View>

              {!isBlocking && onClose && (
                <PressableScale
                  onPress={onClose}
                  className="h-9 w-9 items-center justify-center rounded-full bg-mint"
                >
                  <X
                    size={18}
                    color={colors.ink}
                    strokeWidth={ICON_STROKE_WIDTH}
                  />
                </PressableScale>
              )}
            </View>

            <AppText className="mt-3 text-[14px] leading-5 text-ink/80">
              {estePrimaAutentificare
                ? 'Pentru a organiza cursele în deplină siguranță și a respecta Codul Rutier, te rugăm să confirmi înălțimea fiecărui elev pentru a ști ce tip de scaun auto este necesar.'
                : esteLunar
                  ? 'Copiii cresc repede! O dată pe lună este necesară declararea înălțimii pentru a ajusta din timp tipul de scaun auto necesar în mașinile rotației.'
                  : 'Modifică înălțimea pentru a recalcula automat categoria de scaun auto omologat.'}
            </AppText>
          </View>

          {/* Corpul cu lista de copii */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 18,
              gap: 16,
            }}
          >
            {copii.map((copil, index) => {
              const inaltimeCurenta = inaltimi[index] ?? copil.inaltimeCm;
              const infoScaun = determinaTipScaun(inaltimeCurenta);
              const inaltimeInitiala = copil.inaltimeCm;
              const initialScaun = determinaTipScaun(inaltimeInitiala);
              const aSchimbatCategoria =
                initialScaun.tip !== infoScaun.tip && inaltimeInitiala > 0;

              return (
                <View
                  key={copil.numarMatricol || copil.prenume + index}
                  className="gap-3 rounded-[24px] border border-mint bg-mint/30 p-4"
                >
                  {/* Nume copil si clasa */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <View className="h-7 w-7 items-center justify-center rounded-full bg-navy">
                        <AppText className="font-bold text-[13px] text-white">
                          {copil.prenume.charAt(0).toUpperCase()}
                        </AppText>
                      </View>
                      <AppText className="font-bold text-[18px] text-navy">
                        {copil.prenume}
                      </AppText>
                    </View>
                    <View className="rounded-full border border-mint bg-white px-3 py-1">
                      <AppText className="font-medium text-[12px] text-steel">
                        {copil.clasa}
                      </AppText>
                    </View>
                  </View>

                  {/* Selector inaltime */}
                  <View
                    className="flex-row items-center justify-between rounded-[20px] bg-white px-4 py-3"
                    style={shadows.soft}
                  >
                    <View className="gap-0.5">
                      <AppText className="text-[12px] text-steel">
                        Înălțime declarată
                      </AppText>
                      <View className="flex-row items-baseline gap-1">
                        <TextInput
                          id={`${inputId}-${index}`}
                          value={String(inaltimeCurenta)}
                          onChangeText={(txt) => {
                            const parsed = parseInt(txt.replace(/\D/g, ''), 10);
                            if (!Number.isNaN(parsed)) {
                              actualizeazaInaltime(index, parsed);
                            } else if (txt === '') {
                              actualizeazaInaltime(index, 0);
                            }
                          }}
                          keyboardType="number-pad"
                          maxLength={3}
                          className="font-bold text-[28px] text-navy"
                          style={{ padding: 0, margin: 0 }}
                        />
                        <AppText className="font-medium text-[18px] text-steel">
                          cm
                        </AppText>
                      </View>
                    </View>

                    {/* Steppers [-] [+] */}
                    <View className="flex-row items-center gap-2">
                      <PressableScale
                        onPress={() =>
                          actualizeazaInaltime(index, inaltimeCurenta - 1)
                        }
                        className="h-11 w-11 items-center justify-center rounded-full bg-mint active:bg-mint/80"
                      >
                        <Minus
                          size={20}
                          color={colors.navy}
                          strokeWidth={ICON_STROKE_WIDTH}
                        />
                      </PressableScale>

                      <PressableScale
                        onPress={() =>
                          actualizeazaInaltime(index, inaltimeCurenta + 1)
                        }
                        className="h-11 w-11 items-center justify-center rounded-full bg-navy active:bg-navy/90"
                      >
                        <Plus
                          size={20}
                          color={colors.white}
                          strokeWidth={ICON_STROKE_WIDTH}
                        />
                      </PressableScale>
                    </View>
                  </View>

                  {/* Ajustari rapide: +1 cm, +2 cm */}
                  <View className="flex-row gap-2">
                    {[1, 2, 5].map((val) => (
                      <Pressable
                        key={val}
                        onPress={() =>
                          actualizeazaInaltime(index, inaltimeCurenta + val)
                        }
                        className="rounded-full border border-mint bg-white px-3 py-1.5"
                      >
                        <AppText className="font-medium text-[12px] text-navy">
                          +{val} cm
                        </AppText>
                      </Pressable>
                    ))}
                  </View>

                  {/* Cardul categoriei de scaun rezultata */}
                  <View
                    className={`gap-1.5 rounded-[18px] p-3.5 ${
                      infoScaun.tip === 'scaun_integrat'
                        ? 'border border-peach/30 bg-peach/20'
                        : infoScaun.tip === 'inaltator'
                          ? 'border border-steel/20 bg-steel/15'
                          : 'border border-sage/40 bg-sage/35'
                    }`}
                  >
                    <View className="flex-row items-center gap-2">
                      {infoScaun.tip === 'scaun_integrat' ? (
                        <Baby
                          size={18}
                          color="#b24925"
                          strokeWidth={ICON_STROKE_WIDTH}
                        />
                      ) : infoScaun.tip === 'inaltator' ? (
                        <Shield
                          size={18}
                          color={colors.navy}
                          strokeWidth={ICON_STROKE_WIDTH}
                        />
                      ) : (
                        <CheckCircle2
                          size={18}
                          color="#2b6b3b"
                          strokeWidth={ICON_STROKE_WIDTH}
                        />
                      )}
                      <AppText className="font-bold text-[14px] text-navy">
                        {infoScaun.badgeLabel}
                      </AppText>
                    </View>

                    <AppText className="text-[12px] leading-4 text-ink/80">
                      {infoScaun.descriere}
                    </AppText>

                    {/* Daca s-a schimbat categoria fata de masuratoarea initiala */}
                    {aSchimbatCategoria && (
                      <View className="mt-1 flex-row items-center gap-1.5 rounded-lg bg-white/70 px-2.5 py-1">
                        <Sparkles size={14} color={colors.navy} />
                        <AppText className="font-bold text-[12px] text-navy">
                          {infoScaun.tip === 'centura_normala'
                            ? 'Copilul nu mai are nevoie de scaun auto!'
                            : 'Copilul a trecut la înălțător auto!'}
                        </AppText>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}

            {eroare && (
              <View className="rounded-xl bg-peach/20 p-3">
                <AppText className="font-medium text-[13px] text-ink">
                  {eroare}
                </AppText>
              </View>
            )}

            {/* Butoane de actiune */}
            <View className="gap-2.5 pb-4 pt-2">
              {/* Buton rapid pentru verificarea lunara daca inaltimea e aceeasi */}
              {esteLunar && onConfirmUnchanged && (
                <PressableScale
                  onPress={handleConfirmUnchanged}
                  disabled={seSalveaza}
                  className="h-12 items-center justify-center rounded-[20px] border border-steel/30 bg-mint"
                >
                  <AppText className="font-medium text-[15px] text-navy">
                    Confirmă: Înălțimea nu s-a schimbat
                  </AppText>
                </PressableScale>
              )}

              {/* Buton principal Salveaza */}
              <PressableScale
                onPress={handleSave}
                disabled={seSalveaza}
                className="h-14 flex-row items-center justify-center gap-2 rounded-[24px] bg-navy"
                style={shadows.strong}
              >
                {seSalveaza ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Check
                      size={20}
                      color={colors.white}
                      strokeWidth={ICON_STROKE_WIDTH}
                    />
                    <AppText className="font-bold text-[16px] text-white">
                      {estePrimaAutentificare
                        ? 'Salvează și continuă'
                        : 'Actualizează înălțimea'}
                    </AppText>
                  </>
                )}
              </PressableScale>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
