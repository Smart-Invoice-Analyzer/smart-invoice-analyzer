import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import {QueryClient,QueryClientProvider} from 'react-query';
import store from './store/store';
import { DarkModeProvider } from './DarkMode/DarkModeContext';


const queryClient = new QueryClient;

ReactDOM.render(
  <QueryClientProvider client={queryClient}> 
  <Provider store={store}>
    <DarkModeProvider>
    <App /></DarkModeProvider>
    </Provider>
    </QueryClientProvider>
  
 
    
 ,
  document.getElementById('root')
);