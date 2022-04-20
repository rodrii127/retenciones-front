
import React from 'react';
import ReactDOM from 'react-dom';
import { UserProvider } from './componentes/Contexto/UserContext';
import { Controlador } from './componentes/Controlador/Controlador';

ReactDOM.render(

  <React.StrictMode>
    <UserProvider>
      <Controlador />
    </UserProvider>
  </React.StrictMode>,

  document.getElementById('root')
  
);

