import { Redirect } from 'expo-router';

import { useAuth } from '@/features/auth/AuthProvider';

// Until Acasă has a screen on this branch, the app opens on Setări.
export default function Index() {
  const { stare } = useAuth();

  return <Redirect href={stare === 'conectat' ? '/setari' : '/login'} />;
}
