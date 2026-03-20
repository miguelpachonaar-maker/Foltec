import '../Estilos/Estilos.css'
import { useEffect, useState } from 'react';


const FormUsuarios = () => {
    const [credenciales, setCredenciales] = useState({
        Nombre: '',
        Documento: '',
        Celular:'',
        Estado: '',
        Correo:'',
        Area:'',
        Cargo: '',
        Usuario: '',
        Contraseña: ''
    });
     const [error, setError] = useState(''); 
     const [mensaje, setMensaje] = useState('');
    
     const handleChange = (e) => {
        setCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value
        });
        setError('');
     }
     const handleSubmit = async (e) => {
        e.preventDefault();

        const backendUrl = 'http://localhost:4000/api/Personal'; 
        try{
            const response = await fetch(backendUrl,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credenciales),
            });
            const data = await response.json();
            if(response.ok){
                setMensaje("Usuario Registrado Correctamente");
                setError('');
                console.log(data);

                setCredenciales({
                    Nombre: '',
                    Documento: '',
                    Celular:'',
                    Estado: '',
                    Correo:'',
                    Area:'',
                    Cargo: '',
                    Usuario: '',
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
            
                <div>
                <label>Nombres y Apellidos</label>
                <input
                    type="text"
                    name="Nombre"
                    id="Nombre"
                    placeholder="Nombre Completo"
                    value={credenciales.Nombre}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                    <label>Numero de documento</label>
                <input
                    type="text"
                    name="Documento"
                    id="Documento"
                    placeholder="Número de Documento"
                    value={credenciales.Documento}
                    pattern="[0-9]{2,}"
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label>Contacto</label>
                <input 
                    type="text"
                    name="Celular"
                    id="Celular"
                    pattern='[0-9]{10}'
                    placeholder='Número de celular'
                    value={credenciales.Celular}
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
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
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
                <div>
                    <label>Area</label>
                    <select 
                    name='Area'
                    id='Area'
                    value={credenciales.Area}
                    onChange={handleChange}
                    required
                    >
                        <option value="">Seleccione Area</option>
                        <option value="Ingenieria">Ingeniería</option>
                        <option value="Administracion">Administración</option>
                        <option value="Compras">Compras</option>
                        <option value="Comercial">Comercial</option>
                        <option value="Ventas">Ventas</option>
                        <option value="Logistica">Logística</option>
                        <option value="RRHH">RRHH</option>
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
                    name='Usuario'
                    id='Usuario'
                    value={credenciales.Usuario}
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
                    <button type='submit'>
                        Guardar
                    </button>
         </form>
         </div> 
        </div>
        </>
     )

}
 
export default FormUsuarios