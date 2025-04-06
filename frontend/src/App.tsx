import { AuthProvider } from './components/AuthContext';
import RouterComponent from './components/Routes';


const App: React.FC = () => {

  return (
    <AuthProvider>
        <RouterComponent/>
    </AuthProvider>
  );
};

export default App;
