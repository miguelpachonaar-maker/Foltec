import React, { useEffect, useState } from 'react';
import { Link, ServerRouter, useParams } from 'react-router-dom';
import Estilos from '../Estilos/Estilos.css'
import BotonIcono from '../Estilos/botonIcono';

const DetalleUsuarios = () => {
    const {id} = useParams();
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState ("");
    const [mensaje, setMensaje] = useState("");
    const [areas, setAreas] = useState([]);
    const [estados, setEstados] = useState([]);
    const [documento, setDocumeto] = useState([]);

    useEffect(() => {
        if (!id) {
        setError("ID no válido");
        return;
    }
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

    useEffect(() => {
            fetch ("http://localhost:4000/api/select")
            .then ((res) => res.json())
            .then ((data) => {
                setAreas(data.areas);
                setEstados(data.estados);
                setDocumeto(data.documento);
            })
            .catch ((error) => console.error("Error: ", error));
        }, []);

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
                
                <h2>{usuario.NombresApellidos}</h2>
                
                <div className='campo-item'>
                    <label>Tipo De Documento:</label>
                    <select
                    name='TipoDocumento'
                    value={usuario.TipoDocumento}
                    onChange={handleChange}
                    required>
                    {documento.map((documento)=>(
                        <option key={documento.IdTipoDocumento} 
                        value={documento.IdTipoDocumento}>{documento.IdTipoDocumento}</option>
                    ))}
                </select>
                </div>
                <div className='campos-linea'>
                    <div className='campo-item'>
                        <label>Documento:</label>
                        <input 
                        type='text'
                        name='NumeroDocumento'
                        value={usuario.NumeroDocumento}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Celular:</label>
                        <input 
                        type='text'
                        name='Contacto'
                        value={usuario.Contacto}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Estado:</label>
                        <select
                        name='Estado'
                        value={usuario.Estado}
                        onChange={handleChange}>

                            {estados.map((estado)=>(
                        <option key={estado.IdEstado} 
                        value={estado.IdEstado}>{estado.IdEstado}</option>
                    ))}
                        </select>
                    </div>
                    <div className='campo-item'>
                        <label>Correo:</label>
                        <input
                        type='text'
                        name='Correo'
                        value={usuario.Correo}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Area:</label>
                        <select
                        name='Area'
                        value={usuario.Area}
                        onChange={handleChange}>

                            {areas.map((area)=>(
                            <option key={area.IdArea} 
                            value={area.IdArea} >{area.IdArea}</option>
                        ))}
                        </select>
                    </div>
                    <div className='campo-item'>
                        <label>Cargo:</label>
                        <input 
                        type='text'
                        name='Cargo'
                        value={usuario.Cargo}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Usuario:</label>
                        <input 
                        type='text'
                        name='NombreUsuario'
                        value={usuario.NombreUsuario}
                        onChange={handleChange}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <BotonIcono texto="Guardar Cambios" icono="bi-floppy" onClick={handleGuardar}/>
                <Link to='/Foltec/Usuarios'>
                <BotonIcono texto="Atras" icono="bi-arrow-return-left" />
                </Link>
                </div>
                {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default DetalleUsuarios;