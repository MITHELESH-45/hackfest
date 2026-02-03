import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HackathonProvider } from './context/HackathonContext';
import { EvaluationProvider } from './context/EvaluationContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HackathonProvider>
          <EvaluationProvider>
            <AppRoutes />
          </EvaluationProvider>
        </HackathonProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
