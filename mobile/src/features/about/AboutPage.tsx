import { router } from 'expo-router';

import { AboutScreen } from './AboutScreen';
import { ABOUT_TEXT, ABOUT_TITLE } from './content';

/** Supplies the About text and actions. AboutScreen only draws them. */
export function AboutPage() {
  return (
    <AboutScreen
      title={ABOUT_TITLE}
      text={ABOUT_TEXT}
      // Opened from a deep link there may be nothing to go back to.
      onBack={() =>
        router.canGoBack() ? router.back() : router.replace('/setari')
      }
    />
  );
}
