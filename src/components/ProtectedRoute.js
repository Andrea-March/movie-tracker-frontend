import React from 'react';
import { Navigate } from 'react-router-dom';  // Usa Navigate per il reindirizzamento

function ProtectedRoute({ element: Element, ...rest }) {
  // Verifica se il token JWT esiste in localStorage
  const token = localStorage.getItem("token");

  // Se non c'è il token, reindirizza alla login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se il token è presente, renderizza il componente
  return <Element {...rest} />;
}

export default ProtectedRoute;