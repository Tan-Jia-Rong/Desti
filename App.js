import { LogBox } from 'react-native';
import Providers from './navigation';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
  return <Providers />;
}

export default App;