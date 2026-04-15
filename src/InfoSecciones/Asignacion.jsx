import '../Estilos/Estilos.css'
import BotonIcono from '../Estilos/botonIcono';
import React, { useState, useEffect } from 'react';

const Asignacion =() => {
    const [IdUsuario, setIdUsuario] = useState(null);
    const [cedula, setCedula] = useState("");
    const [nombre, setNombre] = useState("");
    const [Pcs, setPcs] = useState([]);
    const [idpc, setIdpc] = useState("");
    const [Observaciones, setObservaciones] = useState("");
    const [fecha, setFecha] = useState ("");
    const [error, setError] = useState(''); 
    const [mensaje, setMensaje] = useState('');
    
    const buscarUsuario = async () => {
        if (!cedula) return;

        try{
            const backendUrl = `http://localhost:4000/api/asignacion/cedula/${cedula}`;
            const response = await fetch(backendUrl);
            const data = await response.json();

            if(response.ok){
                setNombre(data.NombresApellidos);
                setIdUsuario(data.IdUsuario);
            } else {
                setNombre("");
                setIdUsuario(null);
            }
        }catch(err){
            console.error(err);
        }
    }

    useEffect(() => {
        const buscarPc = async () => {
            const res = await fetch(`http://localhost:4000/api/computadoras/disponibles`);
            const data = await res.json();
            setPcs(data);
        };
        buscarPc();
    }, []);

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const backendUrl = 'http://localhost:4000/api/asignar';

        try{
            const response = await fetch(backendUrl,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    IDUsuario: IdUsuario,
                    IDPc: idpc,
                    Observaciones: Observaciones,
                    fecha: fecha,
            }),
            });
            const data = await response.json();
            if(response.ok){
                setMensaje("Asignación registrada exitosamente");

            } else{
                setError(data.error || "Error al Registrar");
            }
            
        } catch (err){
            console.error("Error", err)
    }
}
return <>
    <div className='DivTodoForm'>
    <div className="FormCard">
        <form onSubmit={handleSubmit}>
            <div>
                <label >Número documento</label>
                <input 
                type="text"
                name='cedula' 
                placeholder='Número de documento'
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                onBlur={buscarUsuario}
                />
            </div>
            <div>
                <label>Nombre Completo</label>
                <input 
                type="text"
                name='nombre' 
                placeholder='Nombre'
                value={nombre}
                readOnly
                />
            </div>
            <div>
                <label>PC Asignado</label>
                    <select 
                        value={idpc}
                        onChange={(e) => setIdpc(e.target.value)}
                    >
                        <option value="">Seleccione Un Equipo</option>
                    {Pcs.map(pc =>(
                        <option key={pc.IDPc} 
                        value={pc.IDPc}>{pc.IDPc} - {pc.Marca}</option>
                    ))}
                    </select>
            </div>
            <div>
                <label>Observaciones</label>
                <textarea 
                placeholder='Observaciones'
                value={Observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                />
            </div>
            <div>
                <label>Fecha de Asignación</label>
                <input 
                type='date'
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}/>
            </div>

            <BotonIcono texto="Asignar" icono="bi-arrow-90deg-down" type="submit" />
            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    </div>
    </div>
</>
}
export default Asignacion;