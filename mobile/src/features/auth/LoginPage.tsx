import { LoginScreen } from './LoginScreen';
import { useAuth } from './AuthProvider';

/** Supplies the login action. LoginScreen only draws the form. */
export function LoginPage() {
  const { autentifica } = useAuth();

  return <LoginScreen onSubmit={autentifica} />;
}
