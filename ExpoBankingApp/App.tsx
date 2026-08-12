
import { AppProviders } from './src/app/AppProviders';
import { RootNavigator } from './src/app/RootNavigator';
export const App = () => {
  // We removed the premature push notification initialization here.
  // It is now strictly handled by authService.ts AFTER a successful login!
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
};

export default App;