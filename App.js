import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';

import AppNavigator from './navigation/AppNavigator';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
  return (
    <AppNavigator />
  )
}

export default App;
