import '../Estilos/Estilos.css'
import React, { useState, useEffect } from 'react';
import BotonIcono from '../Estilos/botonIcono';

const API_URL = 'http://localhost:4000/api/registros';
    
{/*ACCION EQUIPOS*/}
const FormEquipos = () => {
    const [credenciales, setCredenciales] = useState({
        IDPc: '',
        MAC: '',
        Serial: '',
        Marca: '',        
        Descripcion: '',
        Estado: '',
        TipoPc:''
    });

    const [estados, setEstados] = useState([]);
    const [marca, setMarca] = useState([]);
    const [error, setError] = useState(''); 
    const [mensaje, setMensaje] = useState('');

        useEffect(() => {
        fetch ("http://localhost:4000/api/select")
        .then ((res) => res.json())
        .then ((data) => {
            setEstados(data.estados);
            setMarca(data.marca);
        })
                 
       .catch ((error) => console.error("Error: ", error));
    }, []);

    const handleChange = (e) => {
        const {name, value} =e.target;

        let nuevosDatos ={
            ...credenciales,
            [name]: value
        };


        if(name === "Marca"){
            const marcaNormalizada = value.trim().toLowerCase();
            if (["dell", "lenovo"].includes(marcaNormalizada)){
                nuevosDatos.TipoPc ="";
            } else if (["acer", "macbook"].includes(marcaNormalizada)){
                nuevosDatos.TipoPc = "Portatil";
            } else {
                nuevosDatos.TipoPc = "Escritorio";
            }
        }
        setCredenciales(nuevosDatos);
     };

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const backendUrl = 'http://localhost:4000/api/equipos';

        try{
            const response = await fetch(backendUrl,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credenciales),
            });
            const data = await response.json();
            if(response.ok){
                setMensaje("Equipo registrado exitosamente");
                setError('');
                console.log(data)

                setCredenciales({
                    IDPc: '',
                    MAC: '',
                    Serial: '',
                    Marca: '',        
                    Descripcion: '',
                    Estado: '',
                    TipoPc:''
                });
            } else{
                setError(data.error || "Error al Registrar");
                setMensaje('');
            }
            
        } catch (err){
            console.error("Error", err)
    }
}
    


    return <> 
    <div className='DivTodoForm'>
     <div className="FormCard"> 
    <form onSubmit={handleSubmit}> 

                    <h2>Registrar Equipos</h2>

                <div >
                    <label >ID PC</label>
                    <input 
                    type="text"
                    name='IDPc' 
                    placeholder='ING01'
                    value={credenciales.IDPc}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label>MAC</label>
                    <input 
                    type="text"
                    name='MAC' 
                    placeholder='f0:34:56:bd:32:t3'
                    value={credenciales.MAC}
                    onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Serial</label>
                    <input 
                    type="text"
                    name='Serial'
                    placeholder='SN'
                    value={credenciales.Serial}
                    onChange={handleChange}
                    />
                </div>
                <div >
                    <label>Marca</label>
                    <select 
                        name='Marca'
                        value={credenciales.Marca}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione la Marca</option>
                    {marca.map((marca)=>(
                        <option key={marca.IdMarca} 
                        value={marca.IdMarca}>{marca.IdMarca}</option>
                    ))}
                    </select>
                </div>

                  {["dell", "lenovo"].includes(credenciales.Marca?.trim().toLowerCase()) && (
                    <div>
                      <label>Tipo de PC</label>  
                    <select 
                        name='TipoPc'
                        value={credenciales.TipoPc}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione la Marca</option>
                        <option value="Escritorio">Escritorio</option>
                        <option value="Portatil">Portatil</option>
                    </select>
                    </div>)
                    }

                <div>
                    <label>Estado</label>
                    <select 
                        name='Estado'
                        value={credenciales.Estado}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione Estado</option>
                    {estados.map((estado)=>(
                        <option key={estado.IdEstado} 
                        value={estado.IdEstado}>{estado.TipoEstado}</option>
                    ))}
                    </select>
                </div>
                <div className='CamposFull'>
                    <label >Descripción</label>
                    <input
                    type="text"
                    name='Descripcion' 
                    placeholder='Observaciones'
                    value={credenciales.Descripcion}
                    onChange={handleChange}
                    />
                </div>  
                  

                <BotonIcono texto="Guardar" icono="bi-floppy" type="submit" />
                {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}



        </form>
        </div> 
        </div>
    </>
}
export default FormEquipos