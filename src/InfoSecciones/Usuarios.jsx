import '../Estilos/Estilos.css'
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import BotonIcono from '../Estilos/botonIcono';
import { useEffect } from 'react';
import { usePermisos } from '../hooks/usePermisos';

const Usuarios = () => {
    const [resultado, setResultado] = useState ([]);
    const [busqueda, setBusqueda] = useState ("");
    const [error, setError] = useState(''); 
    const [mensaje, setMensaje] = useState('');
    const { tiene } = usePermisos();

    const handleChange = (e) => {
        setBusqueda(e.target.value);
        setError('');
    }
    const obtener = async () => {
        try{
            const response = await fetch ("http://localhost:4000/api/usuarios");
            const data = await response.json();

            if(response.ok){
                setResultado(data);
            } else{
                setError("Error al obtener usuarios")
            }
        } catch (err){
            console.error(err);
            setError("Error al conectar con el servidor")
        }
    } 

    useEffect(() => {
    obtener();
}, []);
    const reporte = async () =>{
        const uid = localStorage.getItem("usuarioID");
        try{
            const response = await fetch (
                `http://localhost:4000/reporte?idSesion=${encodeURIComponent(uid)}`
            );
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                setError(err.error || "No se pudo generar el reporte");
                return;
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url
            a.download = 'Reporte.xlsx';
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (err){
            console.error(err);
            setError("Error descargando el reporte")
    }
}
    const handleBuscar = async (e) => {

        e.preventDefault();
        if (!busqueda.trim()){
            setError("");
            obtener();
            return;
        }

        try{
            const backendUrl = `http://localhost:4000/api/buscar?q=${busqueda}`;
            const response = await fetch(backendUrl);
            const data = await response.json();

            if (response.ok){
                if (data.length === 0) {
                    setMensaje("No se encontraron resultados");
                } else {
                    setMensaje ("");
                }
                setResultado(data);
            } else {
                setError(data.error || "Error al buscar");
                setResultado([]);
                setMensaje("");
            }
        }catch (err) {
        console.error("Error", err);
        setError("Error al conectar con el servidor");
    } 

    }

    return (
        <div className='Busqueda'>
 
                <form onSubmit={handleBuscar}>
                    <h2>Buscar Usuarios</h2>

                    <div className='BusquedaContainer'>
                        <input 
                        type='text'
                        name='busqueda'
                        id='busqueda'
                        placeholder='Ingrese nombre o usuario'
                        value={busqueda}
                        onChange={handleChange}
                        required
                        />
                        <BotonIcono texto="Buscar" icono="bi-search" type="submit" > Buscar </BotonIcono>
                    </div>

                {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                </form>
                <div className="TablaContainer">
                        <div className="TablaHeader">
                            <span>Nombre</span>
                            <span>Estado</span>
                            <span>Usuario</span>
                            <span>Rol</span>
                            <span>Area</span>
                            <span>Cargo</span>
                            <span>Equipo</span>
                        </div>
                </div>


                    {resultado.map(result => (
                        <div key={result.IdUsuario} className="TablaFila">
                            <Link to={`/Foltec/Usuarios/${result.IdUsuario}`} style={{ textDecoration: 'none', color: 'black' }}>
                            <span>{result.NombresApellidos}</span>
                            </Link>
                            <span className={result.Estado === "Activo" ? "estado-activo" : "estado-inactivo"}>
                            {result.Estado}
                            </span>
                            <span>{result.NombreUsuario}</span>
                            <span>{result.NombreRol ?? result.nombrerol ?? "—"}</span>
                            <span>{result.Area}</span>
                            <span>{result.Cargo}</span>
                            <span>{result.Equipo}</span>
                        </div>
                    ))}

                    <div className='acciones'> 
                            <BotonIcono
                                texto="Reporte"
                                icono="bi-download"
                                onClick={reporte}
                                disabled={!tiene("reportes.exportar")}
                            />
                            <Link
                                to="/Foltec/RegistroUsuarios"
                                style={{
                                    opacity: tiene("usuarios.registrar") ? 1 : 0.55,
                                    pointerEvents: tiene("usuarios.registrar") ? "auto" : "none",
                                }}
                            >
                            <BotonIcono
                                texto="Registrar"
                                icono="bi-folder-plus"
                                disabled={!tiene("usuarios.registrar")}
                            />
                            </Link>
                            <Link
                                to="/Foltec/Equipos/asignacion"
                                style={{
                                    opacity: tiene("equipos.asignar") ? 1 : 0.55,
                                    pointerEvents: tiene("equipos.asignar") ? "auto" : "none",
                                }}
                            >
                            <BotonIcono
                                texto="Asignar Equipo"
                                icono="bi-window-plus"
                                disabled={!tiene("equipos.asignar")}
                            />
                            </Link>
                        </div>

        </div>
    );
};

export default Usuarios;

