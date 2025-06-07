import { AuthProvider } from '../../components/Auth/AuthContext';
import RouterComponent from '../../components/Routes';


const App: React.FC = () => {

  return (
    <AuthProvider>
        <RouterComponent/>
    </AuthProvider>
  );
};

export default App;
