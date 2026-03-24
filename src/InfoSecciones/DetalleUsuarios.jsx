import React, { useEffect, useState } from 'react';
import { Link, ServerRouter, useParams } from 'react-router-dom';
import Estilos from '../Estilos/Estilos.css'
import { Draggable } from 'leaflet';

const DetalleUsuarios = () => {
    const {id} = useParams();
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState ("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const fetchUsuario = async () =>{
            try {
                const response = await fetch (`http://localhost:4000/api/usuario/${id}`);
                const data = await response.json();
                if (response.ok){
                    setUsuario(data);
                } else {
                    setError(data.error || "No es posible cargar información del usuario");
                }
            } catch (err) {
                console.error(err);
                setError("Error al conectar al servidor");
            }
        };

        fetchUsuario();
    }, [id]);

    const handleChange = (e) =>{
        setUsuario({
            ...usuario, 
            [e.target.name]: e.target.value
        });
        setError('');
        setMensaje('');
    }

    const handleGuardar = async () => {
        try{
            const response = await fetch (`http://localhost:4000/api/usuario/${id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            const data = await response.json();
            if (response.ok){
                setMensaje("Información del personal actualizada");
            } else {
                setError(data.error || "Error al actualizar");
                setMensaje('');
            }
        } catch (err){
            console.error("Error", err);
            setError("Error al conectar con el servidor");
        

    }
};

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!usuario) return <p>Cargando...</p>;

    return (
        <div className='Detalles'>
            <div className='DetallesCard'>
                
                <h2>{usuario.nombre}</h2>
                
              
                <div className='campos-linea'>
                    <div className='campo-item'>
                        <label>Documento:</label>
                        <input 
                        type='text'
                        name='documento'
                        value={usuario.documento}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Celular:</label>
                        <input 
                        type='text'
                        name='celular'
                        value={usuario.celular}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Estado:</label>
                        <select
                        name='estado'
                        value={usuario.estado}
                        onChange={handleChange}>

                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                    <div className='campo-item'>
                        <label>Correo:</label>
                        <input
                        type='text'
                        name='correo'
                        value={usuario.correo}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Area:</label>
                        <select
                        name='area'
                        value={usuario.area}
                        onChange={handleChange}>

                            <option value="Ingenieria">Ingeniería</option>
                            <option value="Administracion">Administración</option>
                            <option value="Compras">Compras</option>
                            <option value="Comercial">Comercial</option>
                            <option value="Ventas">Ventas</option>
                            <option value="Logistica">Logística</option>
                            <option value="RRHH">RRHH</option>
                        </select>
                    </div>
                    <div className='campo-item'>
                        <label>Cargo:</label>
                        <input 
                        type='text'
                        name='cargo'
                        value={usuario.cargo}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Usuario:</label>
                        <input 
                        type='text'
                        name='usuario'
                        value={usuario.usuario}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={handleGuardar}>Guardar Cambios</button>
                <Link to='/Foltec/Usuarios'>
                <button> Atras </button>
                </Link>
                </div>
                {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default DetalleUsuarios;