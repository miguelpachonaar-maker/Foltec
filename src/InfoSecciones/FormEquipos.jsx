import '../Estilos/Estilos.css'
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:4000/api/registros';
    
{/*ACCION EQUIPOS*/}
const FormEquipos = () => {
    const [formData, setFormData] = useState({
        IDPc: '',
        MAC: '',
        Serial: '',
        Marca: '',        
        UsuarioAnyDesk: '',
        Estado: '',
        Asignacion: '',
        Descripcion: ''
    });

    const [equipo, setEquipos] = useState([]);

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
    
                alert('Equipo guardado con éxito: ');
                setEquipos(prevEquipos => [...prevEquipos, nuevoEquipoSimulado]);
    
                // Opcional: Limpiar el formulario y recargar la lista
                setFormData({
                    IDPc: '', MAC: '', Serial: '', Marca: '', UsuarioAnyDesk: '', Estado: '', Asignacion: '',
                    Descripcion: ''
                });
        };

    // Función para cargar los datos (Buscar o Visualizar)
    const fetchEquipos = async () => {
            console.warn("ADVERTENCIA: La carga inicial de usuarios está desactivada o fallando debido a un backend inactivo.");
            setEquipos([]);
        };
        
        // 5. Cargar los usuarios al montar el componente para visualización
        useEffect(() => {
        fetchEquipos();
    }, []);



    return <> 
        <form onSubmit={handleSubmit}> 
            <div className='TituloSecciones'>
                <div className='EstiloTitulos'>
                    <img src="https://static.vecteezy.com/system/resources/previews/010/882/188/non_2x/monitor-screen-computer-icon-display-electronic-flat-device-equipment-office-business-pc-front-view-vector.jpg" alt="" />
                    <h2>Formulario de equipos</h2>
                </div>
            </div>
            <div className='DivTodoForm'>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">ID PC</label>
                    <input 
                    type="text"
                    name='IDPc' 
                    className="CamposFormEquipos"
                    placeholder='ING01'
                    value={formData.IDPc}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">MAC</label>
                    <input 
                    type="text"
                    name='MAC' 
                    className="CamposFormEquipos"
                    placeholder='f0:34:56:bd:32:t3'
                    value={formData.MAC}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">Serial</label>
                    <input 
                    type="text"
                    name='Serial' 
                    className="CamposFormEquipos"
                    placeholder='SN'
                    value={formData.Serial}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">Marca</label>
                    <input 
                    type="text"
                    name='Marca' 
                    className="CamposFormEquipos"
                    placeholder='Marca'
                    value={formData.Marca}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">Usuario AnyDesk</label>
                    <input 
                    type="number"
                    name='UsuarioAnyDesk' 
                    className="CamposFormEquipos"
                    placeholder='238 975 010'
                    value={formData.UsuarioAnyDesk}
                    onChange={handleChange}
                    />
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputEntregas">Estado</label>
                    <select 
                        className="CamposFormEntregas"
                        name='Estado'
                        value={formData.Estado}
                        onChange={handleChange}
                    >
                        <option value="" disabled selected> Elige una opción</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                        <option value="Reparacion">Reparación</option>
                    </select>
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputEntregas">Asignación</label>
                    <select 
                        className="CamposFormEntregas"
                        name='Asignacion'
                        value={formData.Asignacion}
                        onChange={handleChange}
                    >
                        <option value="" disabled selected> Elige una opción</option>
                        <option value="Activo">Asignado</option>
                        <option value="Inactivo">Libre</option>
                    </select>
                </div>
                <div className='DivCamposFormEquipos'>
                    <label class="EtiquetaInputForm">Descripción</label>
                    <textarea 
                    type="text"
                    name='Descripcion' 
                    className="CamposFormEquipos"
                    placeholder='...'
                    value={formData.Descripcion}
                    onChange={handleChange}
                    />
                </div>
            </div>     
            <div className="BotonesFormEquipos">
                <button type="submit" className="BotonGuardar">
                    Guardar
                </button>
            </div>

            {/*Tabla registro EQUIPOS*/}
            <div className='TituloSecciones'>
                <div className='EstiloTitulos'>
                    <h2>Registro de equipos</h2>
                </div>
                <br />
                <h4>En este espacio podrás visualizar todos los registros del formulario</h4>
            </div>
            {equipo.length > 0 ? (
                <div className='DivTablaUsuarios'>
                    <table>
                        <thead>
                            <tr>
                                <th>ID Pc</th>
                                <th>MAC</th>
                                <th>Serial</th>
                                <th>Marca</th>
                                <th>Usuario AnyDesk</th>
                                <th>Estado</th>
                                <th>Asignación</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipo.map((equipo) => (
                                <tr key={equipo._id}>
                                    <td>{equipo.IDPc}</td>
                                    <td>{equipo.MAC}</td>
                                    <td>{equipo.Serial}</td>
                                    <td>{equipo.Marca}</td>
                                    <td>{equipo.UsuarioAnyDesk}</td>
                                    <td>{equipo.Estado}</td>
                                    <td>{equipo.Asignacion}</td>
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
export default FormEquipos