import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/navigation/TabBar';
import { colors } from '@/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.mint },
      }}
    >
      {/* Same order as the tab bar. Hartă has no screen yet, so it stays inert. */}
      <Tabs.Screen name="index" options={{ title: 'Acasă' }} />
      <Tabs.Screen name="harta" options={{ title: 'Hartă' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
      <Tabs.Screen name="setari" options={{ title: 'Setări' }} />
    </Tabs>
  );
}
