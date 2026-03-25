import React from 'react';

const BotonIcono = ({ texto, icono, type = "button", className = "btn btn-primary me-2", onClick }) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      <i className={`bi ${icono} me-2`}></i> {texto}
    </button>
  );
};

export default BotonIcono;