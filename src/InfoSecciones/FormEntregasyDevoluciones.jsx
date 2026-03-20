import '../Estilos/Estilos.css'
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:4000/api/registros';

const FormEntregasyDev = () => {
    const [formData, setFormData] = useState({
        Gestion: '',
        CODGestion: '',
        FechaINOUT: '',
        CedulaUsuario: '',
        IDPc: '',
        Documento: ''
    });

    const [EntregasyDev, setEntregasyDev] = useState([]);

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
                const nuevoEquipoSimulado = {
                ...formData,
                // Simulamos un ID de MongoDB (único y necesario para la 'key' de React)
                _id: Date.now().toString(), 
                };
    
                alert('Gestión guardada con éxito: ');
                setEntregasyDev(prevEntregasyDev => [...prevEntregasyDev, nuevoEquipoSimulado]);
    
                // Opcional: Limpiar el formulario y recargar la lista
                setFormData({
                    Gestion: '',CODGestion: '',FechaINOUT: '',CedulaUsuario: '',IDPc: '', Documento: ''
                });
        };

    // Función para cargar los datos (Buscar o Visualizar)
    const fetchEntregasyDev = async () => {
            console.warn("ADVERTENCIA: La carga inicial de usuarios está desactivada o fallando debido a un backend inactivo.");
            setEntregasyDev([]);
        };
        
        // 5. Cargar los usuarios al montar el componente para visualización
        useEffect(() => {
        fetchEntregasyDev();
    }, []);

    return <>
        <form onSubmit={handleSubmit}>
            {/*Entregas y devoluciones*/}
            <div className='TituloSecciones'>
                <div className='EstiloTitulos'>
                    <img src="https://cdn-icons-png.flaticon.com/512/13330/13330701.png" alt="" />
                    <h2>Entregas y devoluciones</h2>
                </div>
            </div>
            <div className='DivTodoForm'>
                <div className='DivCamposFormEquipos'>
                    <select
                        className="CamposFormEntregas"
                        name='Gestion'
                        value={formData.Gestion}
                        onChange={handleChange}
                    >
                        <option value="" disabled selected>Elige una opción</option>
                        <option value="Entrega">Entrega</option>
                        <option value="Devolucion">Devolución</option>
                    </select>
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputEntregas">Código Gestión</label>
                    <input 
                    type="text"
                    name='CODGestion'
                    className="CamposFormEntregas"
                    placeholder='EN001 / DEV001'
                    value={formData.CODGestion}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputEntregas">Fecha IN/OUT</label>
                    <input 
                    type="date"
                    name='FechaINOUT'
                    className="CamposFormEntregas"
                    placeholder='DD/MM/AAAA'
                    value={formData.FechaINOUT}
                    onChange={handleChange}
                    />
                </div>      
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputEntregas">Cedula Usuario</label>
                    <input
                    type="number" 
                    name="CedulaUsuario" 
                    id="Usuario" 
                    className="CamposFormEntregas"
                    placeholder='1234567890'
                    value={formData.CedulaUsuario}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputEntregas">ID PC</label>
                    <input 
                    type="text" 
                    name="IDPc" 
                    id="Usuario" 
                    className="CamposFormEntregas"
                    placeholder='ING001'
                    value={formData.IDPc}
                    onChange={handleChange}
                    />
                </div>     
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputEntregas">Documento</label>
                    <input 
                    type="file"
                    name='Documento'
                    className="input1"
                    accept=".pdf, .docx"
                    value={formData.Documento}
                    onChange={handleChange}                              
                    />
                </div>
            </div>
            <div className="BotonesFormEquipos">
                <button type="submit" className="BotonGuardar">
                    Guardar
                </button>
            </div>
            {/*Tabla registro ENTREGAS Y DEVOLUCIONES*/}
                <div className='TituloSecciones'>
                    <div className='EstiloTitulos'>
                        <h2>Registro entregas y devoluciones</h2>
                    </div>
                    <br />
                    <h4>En este espacio podrás visualizar todos los registros del formulario</h4>
                </div>
                {EntregasyDev.length > 0 ? (
                    <div className='DivTablaUsuarios'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Gestion</th>
                                    <th>Codigo gestión</th>
                                    <th>Fecha IN/OUT</th>
                                    <th>Cedula usuario</th>
                                    <th>ID PC</th>
                                    <th>Documento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {EntregasyDev.map((EntregasyDev) => (
                                    <tr key={EntregasyDev._id}>
                                        <td>{EntregasyDev.Gestion}</td>
                                        <td>{EntregasyDev.CODGestion}</td>
                                        <td>{EntregasyDev.FechaINOUT}</td>
                                        <td>{EntregasyDev.CedulaUsuario}</td>
                                        <td>{EntregasyDev.IDPc}</td>
                                        <td>{EntregasyDev.Documento}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                        <h2></h2>
                    
                )}
        </form>
    </>
}
export default FormEntregasyDev