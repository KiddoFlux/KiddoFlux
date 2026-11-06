import { Redirect } from 'expo-router';

// Until Acasă has a screen on this branch, the app opens on Setări.
export default function Index() {
  return <Redirect href="/setari" />;
}
