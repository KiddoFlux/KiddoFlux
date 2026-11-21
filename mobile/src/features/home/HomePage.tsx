import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import {
  creeazaFallbackNextRide,
  cursaLaNextRide,
  subscribeCurse,
  type CursaGrup,
} from '@/types/cursa';
import { verificaNecesitateDeclarareInaltime } from '@/utils/scaunAuto';

import { AlertMessageSheet } from './components/AlertMessageSheet';
import { ScanCodeSheet } from './components/ScanCodeSheet';
import { HomeScreen } from './HomeScreen';
import type { CurrentUser, NextRide } from './types';

function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Bună dimineața,';
  if (hour >= 12 && hour < 18) return 'Bună ziua,';
  return 'Bună seara,';
}

/** Supplies the Home page's data and actions. HomeScreen only draws them. */
export function HomePage() {
  const { profil } = useAuth();
  const [curse, setCurse] = useState<CursaGrup[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeCurse((curseFirestore) => {
      setCurse(curseFirestore);
    });
    return () => unsubscribe();
  }, []);

  // Briefly null while signing out, until the app switches to the login screen.
  if (!profil) return null;

  const user: CurrentUser = {
    id: profil.id,
    name: profil.prenume,
    initial: profil.prenume.charAt(0).toUpperCase(),
    greeting: getGreeting(),
  };

  // Gasim urmatoarea cursa relevanta pentru acest parinte sau copilul sau
  const aziIso = new Date().toISOString().slice(0, 10);
  const cursaUrmatoare = curse.find((c) => {
    if (c.data < aziIso) return false;
    const esteSofer = c.soferId === profil.id;
    const copilulParticipa = c.copii.some(
      (copil) =>
        copil.parinteId === profil.id ||
        copil.prenume.toLowerCase() === profil.copil.prenume.toLowerCase(),
    );
    return esteSofer || copilulParticipa;
  });

  const nextRide: NextRide = cursaUrmatoare
    ? cursaLaNextRide(cursaUrmatoare, profil.id)
    : creeazaFallbackNextRide(profil);

  // Verificam daca parintele are notificari reale (ex: declarare lunara a inaltimii sau consimtamant lipsa)
  const statusInaltime = verificaNecesitateDeclarareInaltime(profil);
  const hasUnreadNotifications =
    statusInaltime.necesita || !profil.consimtamant.acordat;

  const handleOpenNotifications = () => {
    // Redirectioneaza catre profil unde se poate rezolva cerinta
    router.push('/profil');
  };

  return (
    <>
      <HomeScreen
        user={user}
        nextRide={nextRide}
        hasUnreadNotifications={hasUnreadNotifications}
        activeDays={profil.zileDisponibile}
        onOpenProfile={() => router.push('/profil')}
        onOpenNotifications={handleOpenNotifications}
        // The next ride lives in the Calendar tab, so the card opens it.
        onOpenNextRide={() => router.navigate('/calendar')}
        onOpenSchedule={() => router.navigate('/calendar')}
        onOpenMap={() => router.navigate('/harta')}
        onScanCode={() => setIsScanOpen(true)}
        onReportAlert={() => setIsAlertOpen(true)}
        onPlanRides={() => router.push('/planifica')}
      />
      {isScanOpen ? (
        <ScanCodeSheet onClose={() => setIsScanOpen(false)} />
      ) : null}
      {isAlertOpen ? (
        <AlertMessageSheet onClose={() => setIsAlertOpen(false)} />
      ) : null}
    </>
  );
}
