import { HomeScreen } from './HomeScreen';
import { mockHasUnreadNotifications, mockNextRide, mockUser } from './mockData';

// TODO: connect these once the screens and the GraphQL backend exist.
const noop = () => {};

/** Supplies the Home page's data and actions. HomeScreen only draws them. */
export function HomePage() {
  return (
    <HomeScreen
      user={mockUser}
      nextRide={mockNextRide}
      hasUnreadNotifications={mockHasUnreadNotifications}
      onOpenProfile={noop}
      onOpenNotifications={noop}
      onOpenNextRide={noop}
      onOpenSchedule={noop}
      onOpenMap={noop}
      onScanCode={noop}
      onReportAlert={noop}
      onPublishRide={noop}
    />
  );
}
