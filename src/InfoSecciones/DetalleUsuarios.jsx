import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Estilos/Estilos.css';
import BotonIcono from '../Estilos/botonIcono';
import { usePermisos, refrescarPermisosSesion } from '../hooks/usePermisos';

const DetalleUsuarios = () => {
    const {id} = useParams();
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState ("");
    const [mensaje, setMensaje] = useState("");
    const [areas, setAreas] = useState([]);
    const [estados, setEstados] = useState([]);
    const [documento, setDocumeto] = useState([]);
    const [roles, setRoles] = useState([]);
    const { tiene, soloConsulta, cargando } = usePermisos();
    const soloLectura = cargando || soloConsulta;

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
            Promise.all([
                fetch ("http://localhost:4000/api/select").then ((res) => res.json()),
                fetch ("http://localhost:4000/api/roles").then ((res) => res.json()),
            ])
            .then (([data, rolesData]) => {
                setAreas(data.areas);
                setEstados(data.estados);
                setDocumeto(data.documento);
                setRoles(Array.isArray(rolesData) ? rolesData : []);
            })
            .catch ((error) => console.error("Error: ", error));
        }, []);

    const handleChange = (e) =>{
        if (soloLectura) return;
        const { name, value } = e.target;
        setUsuario({
            ...usuario,
            [name]: value,
        });
        setError('');
        setMensaje('');
    }

    const handleGuardar = async () => {
        if (soloLectura || !tiene("usuarios.registrar")) return;
        try{
            const response = await fetch (`http://localhost:4000/api/usuario/${id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...usuario,
                    IdUsuarioSesion: localStorage.getItem("usuarioID"),
                })
            });

            const data = await response.json();
            if (response.ok){
                setMensaje("Información del personal actualizada");
                setUsuario(data);
                if (String(id) === String(localStorage.getItem("usuarioID"))) {
                    refrescarPermisosSesion();
                }
            } else {
                setError(data.error || "Error al actualizar");
                setMensaje('');
            }
        } catch (err){
            console.error("Error", err);
            setError("Error al conectar con el servidor");
        }
    };

    if (error && !usuario) return <p style={{ color: 'red' }}>{error}</p>;
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
                    required
                    disabled={soloLectura}
                    >
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
                        readOnly={soloLectura}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Celular:</label>
                        <input 
                        type='text'
                        name='Contacto'
                        value={usuario.Contacto}
                        onChange={handleChange}
                        readOnly={soloLectura}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Estado:</label>
                        <select
                        name='Estado'
                        value={usuario.Estado}
                        onChange={handleChange}
                        disabled={soloLectura}
                        >

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
                        readOnly={soloLectura}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Rol:</label>
                        <select
                        name="IdRol"
                        value={usuario.IdRol != null && usuario.IdRol !== "" ? String(usuario.IdRol) : ""}
                        onChange={handleChange}
                        required
                        disabled={soloLectura || !tiene("usuarios.registrar")}
                        >
                            <option value="">Seleccione un rol</option>
                            {roles.map((rol) => (
                                <option key={rol.IdRol} value={String(rol.IdRol)}>
                                    {rol.Nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='campo-item'>
                        <label>Area:</label>
                        <select
                        name='Area'
                        value={usuario.Area}
                        onChange={handleChange}
                        disabled={soloLectura}
                        >

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
                        readOnly={soloLectura}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Usuario:</label>
                        <input 
                        type='text'
                        name='NombreUsuario'
                        value={usuario.NombreUsuario}
                        onChange={handleChange}
                        readOnly={soloLectura}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <BotonIcono
                    texto="Guardar Cambios"
                    icono="bi-floppy"
                    onClick={handleGuardar}
                    disabled={soloLectura || !tiene("usuarios.registrar")}
                />
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
