import './Estilos/Estilos.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './PaginaLogIn/LogIn.jsx'
import PaginaInventario from './PaginaInventario/PaginaInventario.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/PaginaInventario" element={<PaginaInventario />} /> 
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);