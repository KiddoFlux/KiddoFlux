import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/features/auth/AuthProvider';
import { colors } from '@/theme/colors';
import { isWeekScheduleFinal } from '@/utils/schedule';

import { PlanningLockedScreen } from './PlanningLockedScreen';
import { PlanRidesScreen } from './PlanRidesScreen';
import { getSaveErrorMessage, loadWeekPlan, saveWeekPlan } from './planStorage';
import { getDefaultSeats } from './rideRules';
import type { WeekPlan } from './types';
import { formatWeekRange, getNextSchoolWeek } from './week';

/** `undefined` while the published plan is still loading. */
type InitialPlan = WeekPlan | null | undefined;

/** Supplies the planning page's dates and actions. PlanRidesScreen only draws them. */
export function PlanRidesPage() {
  const { profil } = useAuth();
  const [today] = useState(() => new Date());
  const [days] = useState(() => getNextSchoolWeek(today));
  const [isLocked, setIsLocked] = useState(() => isWeekScheduleFinal(today));
  const [initialPlan, setInitialPlan] = useState<InitialPlan>(undefined);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const parentId = profil?.id;
  const weekStart = days[0].date;

  useEffect(() => {
    if (!parentId) return;

    let isCurrent = true;
    loadWeekPlan(parentId, weekStart)
      .catch(() => null) // Start from an empty form; publishing reports real errors.
      .then((plan) => {
        if (isCurrent) setInitialPlan(plan);
      });

    return () => {
      isCurrent = false;
    };
  }, [parentId, weekStart]);

  // Briefly null while signing out, until the app switches to the login screen.
  if (!profil) return null;

  if (isLocked) {
    return (
      <PlanningLockedScreen
        onBack={() => router.back()}
        onOpenCalendar={() => router.replace('/calendar')}
      />
    );
  }

  if (initialPlan === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-mint">
        <ActivityIndicator color={colors.navy} />
      </View>
    );
  }

  const handlePublish = async (plan: WeekPlan) => {
    // The deadline can pass while this page is open.
    if (isWeekScheduleFinal(new Date())) {
      setIsLocked(true);
      return;
    }

    setIsPublishing(true);
    setPublishError(null);
    try {
      await saveWeekPlan(profil.id, weekStart, plan);
      router.back();
    } catch (error) {
      setPublishError(getSaveErrorMessage(error));
      setIsPublishing(false);
    }
  };

  const seats = getDefaultSeats(profil.vehicul.numarLocuri);

  return (
    <PlanRidesScreen
      days={days}
      weekRange={formatWeekRange(today)}
      defaultHomeAddress={profil.adresaAcasa}
      defaultSeats={seats}
      maxSeats={seats}
      initialPlan={initialPlan}
      isPublishing={isPublishing}
      publishError={publishError}
      onBack={() => router.back()}
      onPublish={handlePublish}
    />
  );
}
