
import React from 'react';
import ReactDOM from 'react-dom';
import { UserProvider } from './componentes/Contexto/UserContext';
import { AppRouter } from './routers/AppRouter';
import 'antd/dist/antd.min.css'

ReactDOM.render(

  <React.StrictMode>
    <UserProvider>
      <AppRouter />
    </UserProvider>
  </React.StrictMode>,

  document.getElementById('root')
  
);

