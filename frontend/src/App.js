import './App.css';
import ErrorBoundary from './Components/error/errorBoundary';

import AppRoutes from './Routes/Routes';

function App() {
  return (
    <div className="App">
   
   <ErrorBoundary>
       <AppRoutes/>
       </ErrorBoundary>
    </div>
  );
}

export default App;
