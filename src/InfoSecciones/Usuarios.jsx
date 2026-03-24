import '../Estilos/Estilos.css'
import React, {useState} from 'react';
import { Link } from 'react-router-dom';

const Usuarios = () => {
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
            setError("Ingrese un nombre o usuario para buscar");
            setResultado([]);
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
            <div className='BusquedaCard'>
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
                        <button type='submit'> Buscar </button>
                    </div>

                {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                </form>

                <div>
                    {resultado.map(result => (
                        <div key={result.id} className='Resultados'>
                            <Link to={`/Foltec/Usuarios/${result.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                            <p><strong>Nombre:</strong> {result.nombre}</p>
                            </Link>
                            <p><strong>Estado:</strong> {result.estado}</p>
                            <p><strong>Usuario:</strong> {result.usuario}</p>
                            <p><strong>Area:</strong> {result.area}</p>
                            <p><strong>Cargo:</strong> {result.cargo}</p>
                        </div>
                    ))}

                    <div className='links'> 
                        <Link to="/Foltec/RegistroUsuarios"> Registrar Personal </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Usuarios;

