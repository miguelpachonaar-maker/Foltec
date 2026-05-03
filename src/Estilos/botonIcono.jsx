import React from 'react';

const BotonIcono = ({
  texto,
  icono,
  type = "button",
  className = "btn btn-primary",
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={className}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      style={
        disabled
          ? { opacity: 0.55, cursor: "not-allowed", pointerEvents: "auto" }
          : undefined
      }
    >
      <i className={`bi ${icono} me-2`}></i> {texto}
    </button>
  );
};

export default BotonIcono;