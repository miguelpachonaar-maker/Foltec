import '../Estilos/Estilos.css'
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:4000/api/usuarios';

const FormUsuarios = () => {
    const [formData, setFormData] = useState({
        EstadoUsuario: '',
        NombresApellidos: '',
        TipoDocumento: '',
        NumeroDocumento: '',
        Contacto: '',
        Correo: '',
        Area: '',
        Cargo: '',
        Usuario: '',
        Contraseña: ''
    });

    const [usuarios, setUsuarios] = useState([]);

    // Función genérica para actualizar el estado cuando cualquier input cambia
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
            const nuevoUsuarioSimulado = {
            ...formData,
            // Simulamos un ID de MongoDB (único y necesario para la 'key' de React)
            _id: Date.now().toString(), 
            };

            alert('Usuario guardado con éxito: ');
            setUsuarios(prevUsuarios => [...prevUsuarios, nuevoUsuarioSimulado]);

            // Opcional: Limpiar el formulario y recargar la lista
            setFormData({
                EstadoUsuario: '', NombresApellidos: '', TipoDocumento: '', NumeroDocumento: '', Contacto: '', Correo: '',
                Area: '', Cargo: '', Usuario: '', Contraseña: ''
            });
    };

    // Función para cargar los datos (Buscar o Visualizar)
    const fetchUsuarios = async () => {
        console.warn("ADVERTENCIA: La carga inicial de usuarios está desactivada o fallando debido a un backend inactivo.");
        setUsuarios([]);
    };
    
    // 5. Cargar los usuarios al montar el componente para visualización
    useEffect(() => {
        fetchUsuarios();
    }, []);
 
        
    
    return <>
        <form onSubmit={handleSubmit}>    
            <div className='TituloSecciones'>
                <div className='EstiloTitulos'>
                    <img src="https://cdn-icons-png.flaticon.com/512/3200/3200751.png" alt="" />
                    <h2>Formulario de usuarios</h2>
                </div>
            </div>        
            <div className='DivTodoForm'>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputEntregas">Estado Usuario</label>
                    <select 
                        className="CamposFormEntregas"
                        name='EstadoUsuario'
                        value={formData.EstadoUsuario}
                        onChange={handleChange}
                    >
                        <option value="" disabled selected> - - -</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">Nombres y Apellidos</label>
                    <input 
                    type="text"
                    name='NombresApellidos' 
                    className="CamposFormEquipos"
                    placeholder='Nombres'
                    value={formData.NombresApellidos}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">Tipo de documento</label>
                    <input 
                    type="text"
                    name='TipoDocumento' 
                    className="CamposFormEquipos"
                    placeholder='CC / CE'
                    value={formData.TipoDocumento}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">Numero de documento</label>
                    <input 
                    type="number"
                    name='NumeroDocumento'  
                    className="CamposFormEquipos"
                    placeholder='1065738902'
                    value={formData.NumeroDocumento}
                    onChange={handleChange}
                    />
                </div>      
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">Contacto</label>
                    <input
                    type="number"
                    name='Contacto'  
                    className="CamposFormEquipos"
                    placeholder='3201013344'
                    value={formData.Contacto}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">Correo</label>
                    <input 
                    type="email"
                    name='Correo' 
                    className="CamposFormEquipos"
                    placeholder='ejemplo@foltec.co'
                    value={formData.Correo}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputEntregas">Elige un área</label>
                    <select 
                        className="CamposFormEntregas"
                        name='Area'
                        value={formData.Area}
                        onChange={handleChange}
                    >
                        <option value="" disabled selected> Elige un Área</option>
                        <option value="Ingenieria">Ingeniería</option>
                        <option value="Administracion">Administración</option>
                        <option value="Compras">Compras</option>
                        <option value="Comercial">Comercial</option>
                        <option value="Ventas">Ventas</option>
                        <option value="Logistica">Logística</option>
                        <option value="RRHH">RRHH</option>
                    </select>
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">Cargo</label>
                    <input 
                    type="text"
                    name='Cargo' 
                    className="CamposFormEquipos"
                    placeholder='Coordinador TI'
                    value={formData.Cargo}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">Usuario</label>
                    <input 
                    type="number"
                    name='Usuario'
                    className="CamposFormEquipos"
                    placeholder='101010'
                    value={formData.Usuario}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">Contraseña</label>
                    <input 
                    type="password"
                    name='Contraseña'
                    className="CamposFormEquipos"
                    placeholder='********'
                    value={formData.Contraseña}
                    onChange={handleChange}
                    />
                </div>
            </div>
            <div className="BotonesFormEquipos">
                <button type="submit" className="BotonGuardar">
                    Guardar
                </button>
            </div>
            <div className='TituloSecciones'>
                <div className='EstiloTitulos'>
                    <h2>Registro de usuarios</h2>
                </div>
                <br />
                <h4>En este espacio podrás visualizar todos los registros del formulario</h4>
            </div>
            {usuarios.length > 0 ? (
                <div className='DivTablaUsuarios'>
                    <table>
                        <thead>
                            <tr>
                                <th>Estado usuario</th>
                                <th>Nombres y Apellidos</th>
                                <th>Tipo de Documento</th>
                                <th>N° Documento</th>
                                <th>Contacto</th>
                                <th>Correo  </th>
                                <th>Área</th>
                                <th>Cargo</th>
                                <th>Usuario</th>
                                <th>Contraseña</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.EstadoUsuario}</td>
                                    <td>{user.NombresApellidos}</td>
                                    <td>{user.TipoDocumento}</td>
                                    <td>{user.NumeroDocumento}</td>
                                    <td>{user.Contacto}</td>
                                    <td>{user.Correo}</td>
                                    <td>{user.Area}</td>
                                    <td>{user.Cargo}</td>
                                    <td>{user.Usuario}</td>
                                    <td>{user.Contraseña} </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p></p>
            )}
        </form>
    </>
}
export default FormUsuarios