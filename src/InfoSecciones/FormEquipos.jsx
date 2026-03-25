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
    const [estados, setEstados] = useState([]);
        useEffect(() => {
        fetch ("http://localhost:4000/api/select")
        .then ((res) => res.json())
        .then ((data) => {
            setEstados(data.estados);
        })
                 
       .catch ((error) => console.error("Error: ", error));
    }, []);

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
    <div className='DivTodoForm'>
     <div className="FormCard"> 
    <form onSubmit={handleSubmit}> 

                    <h2>Formulario de equipos</h2>

                <div >
                    <label >ID PC</label>
                    <input 
                    type="text"
                    name='IDPc' 
                    placeholder='ING01'
                    value={formData.IDPc}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label>MAC</label>
                    <input 
                    type="text"
                    name='MAC' 
                    placeholder='f0:34:56:bd:32:t3'
                    value={formData.MAC}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Serial</label>
                    <input 
                    type="text"
                    name='Serial'
                    placeholder='SN'
                    value={formData.Serial}
                    onChange={handleChange}
                    />
                </div>
                <div >
                    <label>Marca</label>
                    <input 
                    type="text"
                    name='Marca' 
                    placeholder='Marca'
                    value={formData.Marca}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Usuario AnyDesk</label>
                    <input 
                    type="number"
                    name='UsuarioAnyDesk' 
                    placeholder='238 975 010'
                    value={formData.UsuarioAnyDesk}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Estado</label>
                    <select 
                        name='Estado'
                        value={formData.Estado}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione Estado</option>
                    {estados.map((estado)=>(
                        <option key={estado.TipoEstado} 
                        value={estado.TipoEstado}>{estado.TipoEstado}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label>Asignación</label>
                    <select 
                        name='Asignacion'
                        value={formData.Asignacion}
                        onChange={handleChange}
                    >
                        <option value="" disabled selected> Elige una opción</option>
                        <option value="Activo">Asignado</option>
                        <option value="Inactivo">Libre</option>
                    </select>
                </div>
                <div>
                    <label >Descripción</label>
                    <textarea 
                    type="text"
                    name='Descripcion' 
                    placeholder='...'
                    value={formData.Descripcion}
                    onChange={handleChange}
                    />
                </div>    
            <div>
                <button type="submit">
                    Guardar
                </button>
            </div>

            {/*Tabla registro EQUIPOS*/}
            <div className='CamposFull'>


                    <h2>Registro de equipos</h2>

                <br />
                <h4>En este espacio podrás visualizar todos los registros del formulario</h4>

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
            </div>
        </form>
        </div> 
        </div>
    </>
}
export default FormEquipos