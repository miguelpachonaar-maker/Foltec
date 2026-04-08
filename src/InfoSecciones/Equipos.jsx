import '../Estilos/Estilos.css'
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import BotonIcono from '../Estilos/botonIcono';
import { useEffect } from 'react';

const Equipos =() =>{
    const [resultado, setResultado] = useState ([]);
        const [busqueda, setBusqueda] = useState ("");
        const [error, setError] = useState(''); 
        const [mensaje, setMensaje] = useState('');
    
        const handleChange = (e) => {
            setBusqueda(e.target.value);
            setError('');
        }
        const obtener = async () => {
        try{
            const response = await fetch ("http://localhost:4000/api/equipos");
            const data = await response.json();

            if(response.ok){
                setResultado(data);
            } else{
                setError("Error al obtener equipos")
            }
        } catch (err){
            console.error(err);
            setError("Error al conectar con el servidor")
        }
        } 
        useEffect(() => {
            obtener();
        }, []);
        
    
        const handleBuscar = async (e) => {
    
            e.preventDefault();
            if (!busqueda.trim()){
                setError("");
                obtener();
                return;
            }
    
            try{
                const backendUrl = `http://localhost:4000/api/equipos/buscar?q=${busqueda}`;
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
                        <h2>Buscar Equipos</h2>
    
                        <div className='BusquedaContainer'>
                            <input 
                            type='text'
                            name='busqueda'
                            id='busqueda'
                            placeholder='Ingrese Serial o ID'
                            value={busqueda}
                            onChange={handleChange}
                            required    
                            />
                            <BotonIcono texto="Buscar" icono="bi-search" type="submit" />
                        </div>
    
                    {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
    
                    </form>
                    <div className="TablaContainer">
                        <div className="TablaHeader">
                            <span>Nombre</span>
                            <span>Serial</span>
                            <span>Estado</span>
                            <span>Tipo</span>
                            <span>Marca</span>
                            <span>Asignación</span>
                        </div>
                     </div>
                        {resultado.map(result => (
                            <div key={result.IDPc} className="TablaFila">
                                    <Link to={`/Foltec/Equipos/${result.IDPc}`}style={{ textDecoration: 'none', color: 'black' }}>
                                    <span>{result.IDPc}</span>
                                    </Link>
                                    <span>{result.Serial}</span>
                                        <span className={result.Estado === "Activo" ? "estado-activo" : "estado-reparacion"}>
                                        {result.Estado}
                                        </span>
                                    <span>{result.TipoPc}</span>
                                    <span>{result.Marca}</span> 
                                    <span className={result.Asignacion === "Asignado" ? "asignado" : "disponible"}>
                                    {result.Asignacion}
                                    </span>  
                            </div>
                        ))}
        
                        <div className='acciones'> 
                            <Link to="/Foltec/RegistroEquipos"> 
                            <BotonIcono texto="Registrar" icono="bi-folder-plus" /> 
                            </Link>
                            <Link to="/Foltec/Equipos/asignacion"> 
                            <BotonIcono texto="Asignar Equipo" icono="bi-window-plus" /> 
                            </Link>
                        </div>
    
            </div>
        );

}

export default Equipos;
