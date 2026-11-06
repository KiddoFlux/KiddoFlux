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
      {/* Only Setări has a screen so far; add Acasă, Hartă and Calendar here as they land. */}
      <Tabs.Screen name="setari" options={{ title: 'Setări' }} />
      <Tabs.Screen name="index" options={{ title: 'Acasă' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
    </Tabs>
  );
}
