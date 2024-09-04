import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import {QueryClient,QueryClientProvider} from 'react-query';
import store from './store/store';
import { useQuery } from 'react-query';

const queryClient = new QueryClient;

ReactDOM.render(
  <QueryClientProvider client={queryClient}> 
  <Provider store={store}>
    <App />
    </Provider>
    </QueryClientProvider>
  
 
    
 ,
  document.getElementById('root')
);