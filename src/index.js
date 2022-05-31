
import React from 'react';
import ReactDOM from 'react-dom';
import { UserProvider } from './componentes/Contexto/UserContext';
import { AppRouter } from './routers/AppRouter';

ReactDOM.render(

  <React.StrictMode>
    <UserProvider>
      <AppRouter />
    </UserProvider>
  </React.StrictMode>,

  document.getElementById('root')
  
);

