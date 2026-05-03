import { useState, useEffect } from "react";

const API_BASE = "http://localhost:4000";

export const EVT_PERMISOS_REFRESH = "foltec-permisos-refresh";

export function refrescarPermisosSesion() {
  window.dispatchEvent(new Event(EVT_PERMISOS_REFRESH));
}

export function usePermisos() {
  const [permisos, setPermisos] = useState(() => {
    try {
      const raw = localStorage.getItem("permisosUsuario");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("usuarioID");
    if (!uid) {
      setPermisos([]);
      setCargando(false);
      return;
    }

    const cargar = () => {
      const actual = localStorage.getItem("usuarioID");
      if (!actual) {
        setPermisos([]);
        setCargando(false);
        return;
      }
      fetch(
        `${API_BASE}/api/sesion/${encodeURIComponent(actual)}/permisos?t=${Date.now()}`
      )
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("permisos"))))
        .then((d) => {
          const p = Array.isArray(d.permisos) ? d.permisos : [];
          setPermisos(p);
          localStorage.setItem("permisosUsuario", JSON.stringify(p));
        })
        .catch(() => {})
        .finally(() => setCargando(false));
    };

    cargar();
    const alEnfocar = () => cargar();
    window.addEventListener("focus", alEnfocar);
    window.addEventListener(EVT_PERMISOS_REFRESH, alEnfocar);
    return () => {
      window.removeEventListener("focus", alEnfocar);
      window.removeEventListener(EVT_PERMISOS_REFRESH, alEnfocar);
    };
  }, []);

  const tiene = (codigo) => Array.isArray(permisos) && permisos.includes(codigo);

  const soloConsulta =
    !cargando && Array.isArray(permisos) && permisos.length === 0;

  return { permisos, tiene, cargando, soloConsulta };
}
