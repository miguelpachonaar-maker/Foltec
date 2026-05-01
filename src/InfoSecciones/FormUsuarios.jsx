import '../Estilos/Estilos.css'
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import BotonIcono from '../Estilos/botonIcono';


const FormUsuarios = () => {
    const [credenciales, setCredenciales] = useState({
        Nombre: '',
        TipoDocumento:'',
        Documento: '',
        Celular:'',
        Estado: '',
        Correo:'',
        IdRol: '',
        Area:'',
        Cargo: '',
        Usuario: '',
        Contraseña: ''
    });
     const [error, setError] = useState(''); 
     const [mensaje, setMensaje] = useState('');
     const navegar = useNavigate();
     const [areas, setAreas] = useState([]);
     const [estados, setEstados] = useState([]);
     const [documento, setDocumeto] = useState([]);
     const [roles, setRoles] = useState([]);

    
     const handleChange = (e) => {
        setCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value
        });
        setError('');
     };

     useEffect(() => {
        const raw = localStorage.getItem("permisosUsuario");
        let puedeRegistrar = false;
        try {
            const permisos = raw ? JSON.parse(raw) : [];
            puedeRegistrar =
                Array.isArray(permisos) && permisos.includes("usuarios.registrar");
        } catch {
            puedeRegistrar = false;
        }
        if (!puedeRegistrar) {
            navegar("/Foltec/Usuarios");
            return;
        }

        Promise.all([
            fetch("http://localhost:4000/api/select").then((res) => res.json()),
            fetch("http://localhost:4000/api/roles").then((res) => res.json()),
        ])
            .then(([data, rolesData]) => {
                setAreas(data.areas);
                setEstados(data.estados);
                setDocumeto(data.documento);
                setRoles(Array.isArray(rolesData) ? rolesData : []);
            })
            .catch((err) => console.error("Error: ", err));
    }, [navegar]);
     const handleSubmit = async (e) => {
        e.preventDefault();

        const backendUrl = 'http://localhost:4000/api/personal'; 
        try{
            const response = await fetch(backendUrl,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...credenciales,
                    IdUsuarioSesion: localStorage.getItem("usuarioID"),
                }),
            });
            const data = await response.json();
            if(response.ok){
                setMensaje("Usuario Registrado Correctamente");
                setError('');
                navegar('/Foltec/Usuarios')
                console.log(data);

                setCredenciales({
                    NombresApellidos: '',
                    TipoDocumento:'',
                    NumeroDocumento: '',
                    Contacto:'',
                    Estado: '',
                    Correo:'',
                    IdRol: '',
                    Area:'',
                    Cargo: '',
                    NombreUsuario: '',
                    Contraseña: ''
                });
            } else {
                setError(data.error || "Error al Registrar");
                setMensaje('');
            }
            
        } catch (err){
            console.error("Error", err);
        }

     };

     return (
        <><div className='DivTodoForm'>
          <div className="FormCard"> 
        <form onSubmit={handleSubmit}>
                    <h2>Registrar Personal</h2>
            
                <div className='CamposFull'>
                <label>Nombres y Apellidos</label>
                <input 
                    type="text"
                    name="NombresApellidos"
                    id="NombresApellidos"
                    placeholder="Nombre Completo"
                    value={credenciales.NombresApellidos}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                    <label>Tipo de Documento</label>
                <select
                    name='TipoDocumento'
                    id='TipoDocumento'
                    value={credenciales.TipoDocumento}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccione Tipo Documento</option>
                    {documento.map((documento)=>(
                        <option key={documento.IdTipoDocumento} 
                        value={documento.IdTipoDocumento}>{documento.IdTipoDocumento}</option>
                    ))}
                </select>
                </div>
                <div>
                    <label>Numero de documento</label>
                <input
                    type="text"
                    name="NumeroDocumento"
                    id="NumeroDocumento"
                    placeholder="Número de Documento"
                    value={credenciales.NumeroDocumento}
                    pattern="[0-9]{2,}"
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Contacto</label>
                <input 
                    type="text"
                    name="Contacto"
                    id="Contacto"
                    pattern='[0-9]{10}'
                    placeholder='Número de Contacto'
                    value={credenciales.Contacto}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                    <label>Estado Usuario</label>
                <select
                    name='Estado'
                    id='Estado'
                    value={credenciales.Estado}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccione Estado</option>
                    {estados.map((estado)=>(
                        <option key={estado.IdEstado} 
                        value={estado.IdEstado}>{estado.IdEstado}</option>
                    ))}
                </select>
                </div>
                <div className='CamposFull'>
                    <label>Correo</label>
                    <input 
                    type='text'
                    name='Correo'
                    id='Correo'
                    placeholder='Correo'
                    value={credenciales.Correo}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div className='CamposFull'>
                    <label>Rol del usuario</label>
                    <select
                        name="IdRol"
                        id="IdRol"
                        value={credenciales.IdRol}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un rol</option>
                        {roles.map((rol) => (
                            <option key={rol.IdRol} value={rol.IdRol}>
                                {rol.Nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Area</label>
                    <select 
                    name='Area'
                    id='Area'
                    value={credenciales.Area}
                    onChange={handleChange}
                    required
                    >
                        <option value="">Seleccione Área</option>
                        {areas.map((area)=>(
                            <option key={area.IdArea} 
                            value={area.IdArea} >{area.IdArea}</option>
                        ))}
                    
                    </select>
                </div>
                <div>
                    <label>Cargo</label>
                    <input
                    type='text'
                    name='Cargo'
                    id='Cargo'
                    value={credenciales.Cargo}
                    onChange={handleChange}
                    required
                    placeholder='Cargo'
                    />
                </div>
                <div>
                    <label>Usuario</label>
                    <input
                    type='text'
                    name='NombreUsuario'
                    id='NombreUsuario'
                    value={credenciales.NombreUsuario}
                    onChange={handleChange}
                    required
                    pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{4,20}"
                    title="El usuario debe de contener entre 5 a 20 caracteres, sin números ni caracteres especiales"
                    placeholder='Usuario'
                    />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input 
                    type='password'
                    name='Contraseña'
                    id='Contraseña'
                    pattern="[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9._*$#!@?\-]{8,}"
                    value={credenciales.Contraseña}
                    onChange={handleChange}
                    required
                    title='La contraseña no cumple con los parametros: Ingrese una contraseña con al menos 8 caracteres incluyendo números y caracteres especiales (._-/*$#!@?)'
                    placeholder='******'
                    />
                </div>
                {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
               
                    <BotonIcono texto="Guardar" icono="bi-floppy" type="submit" />
         </form>
         </div> 
        </div>
        </>
     )

}
 
export default FormUsuarios