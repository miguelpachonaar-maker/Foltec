import '../Estilos/Estilos.css'
import React, {useState} from 'react';
import { Link } from 'react-router-dom';

const Equipos =() =>{
    const [resultado, setResultado] = useState ([]);
        const [busqueda, setBusqueda] = useState ("");
        const [error, setError] = useState(''); 
        const [mensaje, setMensaje] = useState('');
    
        const handleChange = (e) => {
            setBusqueda(e.target.value);
            setError('');
        }
    
        const handleBuscar = async (e) => {
    
            e.preventDefault();
            if (!busqueda.trim()){
                setError("Ingrese un Serial o ID para buscar");
                setResultado([]);
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
                <div className='BusquedaCard'>
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
                            <button type='submit'> Buscar </button>
                        </div>
    
                    {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
    
                    </form>
    
                    <div>
                        {resultado.map(result => (
                            <div key={result.id} className='Resultados'>
                                <Link to={`/Foltec/Equipos/${result.IDPc}`} style={{ textDecoration: 'none', color: 'black' }}>
                                <p><strong>Nombre:</strong> {result.IDPc}</p>
                                </Link>
                                <p><strong>Estado:</strong> {result.Estado}</p>
                                <p><strong>Usuario:</strong> {result.TipoPc}</p>
                            </div>
                        ))}
    
                        <div className='links'> 
                            <Link to="/Foltec/RegistroEquipos"> Registrar Equipo </Link>
                        </div>
                    </div>
    
                </div>
            </div>
        );

}

export default Equipos;
