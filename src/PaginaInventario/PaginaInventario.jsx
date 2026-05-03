import Estilos from '../Estilos/Estilos.css'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const PaginaInventario = () => {   
    const [nombreUsuario, setNombreUsuario] = useState ('Invitado')

 // NECESARIO PARA PODER REDIRIGIR AL LOGIN 
      const navigate = useNavigate();

      /* VERIFICACIÓN DE SESIÓN AL CARGAR LA PÁGINA 
       Esto evita que alguien entre al inventario si no está logueado
       o si intenta volver con la flecha del navegador */
          useEffect(() => {

        const auth = localStorage.getItem("auth");
        const usuarioID = localStorage.getItem("usuarioID")
        const nombreGuardado = localStorage.getItem("nombreUsuario");

        if (!usuarioID || !auth) {
                navigate ("/", {replace:true});
            } else {
                setNombreUsuario(nombreGuardado || "Invitado");
            }
}, [navigate]);
     
            return (
                <section id="Inicio">
                    <div className='TituloInicio' >
                        <h2>¡Bienvenido a FOLTEC gestor de inventarios!</h2>
                    </div>
                    <div className='ImagenInicio'>
                        <img src="https://mecaluxes.cdnwm.com/img/blog/gestion-de-inventario-gestion-stock.1.13.jpg?imwidth=1024&imdensity=1" alt="Imagen de gestor"/>
                    </div>
                </section>
            );
            
}
export default PaginaInventario