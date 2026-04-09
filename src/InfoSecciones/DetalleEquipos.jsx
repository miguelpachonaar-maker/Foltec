import React, { useEffect, useState } from 'react';
import { Link, ServerRouter, useParams } from 'react-router-dom';
import Estilos from '../Estilos/Estilos.css'
import BotonIcono from '../Estilos/botonIcono';


const DetalleEquipos = () => {
    const {id} = useParams();
    const [error, setError] = useState ("");
    const [mensaje, setMensaje] = useState("");
    const [estados, setEstados] = useState([]);
    const [marca, setMarca] = useState([]);
    const [equipo, setEquipo] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    const [formDevolucion, setFormDevolucion] = useState({
  fecha: "",
  EstadoEntrega: "",
  Observaciones: ""
});

    useEffect(() => {
        if (!id) {
        setError("ID no válido");
        return;
    }

    const fetchEquipo = async () =>{
            try {
                const response = await fetch (`http://localhost:4000/api/equipo/${id}`);
                const data = await response.json();
                if (response.ok){
                    setEquipo(data);
                } else {
                    setError(data.error || "No es posible cargar información del equipo");
                }
            } catch (err) {
                console.error(err);
                setError("Error al conectar al servidor");
            }

    };

        fetchEquipo();
    }, [id]);

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
            ...equipo,
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
        setEquipo(nuevosDatos);
     };

    const handleGuardar = async () => {
        try{
            const response = await fetch (`http://localhost:4000/api/equipo/${id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(equipo)
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
const handleDevolver = async () => {

    if (!formDevolucion.fecha) {
    alert("Debes ingresar la fecha");
    return;
  }

  if (!formDevolucion.EstadoEntrega) {
    alert("Debes seleccionar el estado");
    return;
  }
  
  try {
    const response = await fetch("http://localhost:4000/api/devolver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        IDPc: equipo.IDPc,
        fecha: formDevolucion.fecha,
        EstadoEntrega: formDevolucion.EstadoEntrega,
        Observaciones: formDevolucion.Observaciones
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.mensaje);
      setMostrarModal(false);
      window.location.reload();
    } else {
      alert(data.error);
    }

  } catch (error) {
    console.error(error);
    alert("Error al devolver equipo");
  }
};

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!equipo) return <p>Cargando...</p>;

    return (
        <div className='Detalles'>
            <div className='DetallesCard'>
                
                <h2>{equipo.IDPc}</h2>
               <div className='campos-linea'>
                <div className='campo-item'>
                    <label>Marca</label>
                    <select
                    name='Marca'
                    value={equipo.Marca}
                    onChange={handleChange}
                    required>
                    {marca.map((marca)=>(
                        <option key={marca.IdMarca} 
                        value={marca.IdMarca}>{marca.IdMarca}</option>
                    ))}
                </select>
                </div>

                {["dell", "lenovo"].includes(equipo.Marca?.trim().toLowerCase()) && (
                    <div>
                      <label>Tipo de PC</label>  
                    <select 
                        name='TipoPc'
                        value={equipo.TipoPc}
                        onChange={handleChange}
                    >
                        <option value="Escritorio">Escritorio</option>
                        <option value="Portatil">Portatil</option>
                    </select>
                    </div>)
                    }

                    <div className='campo-item'>
                        <label>MAC:</label>
                        <input 
                        type='text'
                        name='MAC'
                        value={equipo.MAC}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Numero de Serial:</label>
                        <input 
                        type='text'
                        name='Serial'
                        value={equipo.Serial}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='campo-item'>
                        <label>Estado:</label>
                        <select
                        name='Estado'
                        value={equipo.Estado}
                        onChange={handleChange}>

                            {estados.map((estado)=>(
                        <option key={estado.IdEstado} 
                        value={estado.IdEstado}>{estado.TipoEstado}</option>
                    ))}
                        </select>
                    </div>
                    
    
                    <div className='campo-item'>
                        <label>Descripcion:</label>
                        <input 
                        type='text'
                        name='Descripcion'
                        value={equipo.Descripcion}
                        onChange={handleChange}
                        />
                    </div>

                    <div className='campo-item'>
                        <label>Usuario Asignado:</label>
                        <input 
                        type='text'
                        value={equipo.ASIGNACION}
                        readOnly
                        />
                    </div>
                     </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>

                    {equipo.ASIGNACION === "Sin Usuario" ? (
                    <Link to="/Foltec/Equipos/asignacion"> 
                     <BotonIcono texto="Asignar Equipo" icono="bi-window-plus" /> 
                     </Link>) : (
                     <BotonIcono 
                        texto="Devolver Equipo" 
                        icono="bi-person-x-fill" 
                        onClick={() => setMostrarModal(true)}
/> 
)
                    }
                    {mostrarModal && (
                        <div className="modal">
                        <h3>Devolver equipo {equipo.IDPc}</h3>

                            <label>Fecha devolución</label>
                            <input
                            type="date"
                             value={formDevolucion.fecha}
                            onChange={(e) =>
                            setFormDevolucion({ ...formDevolucion, fecha: e.target.value })
                            }
                             />

                            <label>Estado entrega</label>
                            <select
                            value={formDevolucion.EstadoEntrega}
                            onChange={(e) =>
                            setFormDevolucion({ ...formDevolucion, EstadoEntrega: e.target.value })
                            }
                            >
                            <option value="">Seleccione estado</option>
                            {estados.map((estado)=>(
                            <option key={estado.IdEstado} 
                            value={estado.IdEstado}>{estado.TipoEstado}</option>
                            ))}
                             </select>

                            <label>Observaciones</label>
                            <input
                            type="text"
                            value={formDevolucion.Observaciones}
                            onChange={(e) =>
                            setFormDevolucion({ ...formDevolucion, Observaciones: e.target.value })
                             }
                                />

                            <button onClick={handleDevolver}>Confirmar</button>
                            <button onClick={() => setMostrarModal(false)}>Cancelar</button>
                            </div>
                        )}
                    

                
                <BotonIcono texto="Guardar Cambios" icono="bi-floppy" onClick={handleGuardar}/>
                <Link to='/Foltec/Equipos'>
                <BotonIcono texto="Atras" icono="bi-arrow-return-left" />
                </Link>
                </div>
                {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}


            </div>
        </div>
    );
}

export default DetalleEquipos;