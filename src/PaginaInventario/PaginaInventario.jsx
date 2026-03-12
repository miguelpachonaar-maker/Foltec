import '../Estilos/Estilos.css'
import {Link} from 'react-router-dom'
import React, { useState } from 'react';
import FormEquipos from '../InfoSecciones/FormEquipos';
import FormUsuarios from '../InfoSecciones/FormUsuarios.jsx';
import FormEntregasyDev from '../InfoSecciones/FormEntregasyDevoluciones.jsx';
import SeccionSoporte from '../InfoSecciones/SeccionSoporte.jsx';
import SeccionLocalizador from '../InfoSecciones/SeccionLocalizador.jsx';

const PaginaInventario = () => {   
    const [seccionActiva, setSeccionActiva] = useState('Inicio');

    // 2. Función Manejadora de Clic: Actualiza el estado con el ID de la sección.
    const handleMenuClick = (targetId) => {
        setSeccionActiva(targetId);
    };
    
    // Lista de botones del menú
    const menuOpciones = [
        { id: 'Usuarios', texto: 'Usuarios' },
        { id: 'Computadoras', texto: 'Computadoras' },
        { id: 'Localizacion', texto: 'Localización' },
        { id: 'Soporte', texto: 'Soporte' },
    ];
    
    // 3. Renderizado Condicional del Contenido de la Sección (Opcional, pero más limpio en React)
    const SeccionContenido = () => {
        // En React, el renderizado condicional con estado es más limpio que usar 'style="display:none"'
        switch (seccionActiva) {
            case 'Inicio':
            return (
                <section id="Inicio">
                    <div className='TituloInicio'>
                        <h2>¡Bienvenido a FOLTEC gestor de inventarios!</h2>
                    </div>
                    <div className='ImagenInicio'>
                        <img src="https://mecaluxes.cdnwm.com/img/blog/gestion-de-inventario-gestion-stock.1.13.jpg?imwidth=1024&imdensity=1" alt="Imagen de gestor" />
                    </div>
                </section>
            );
            
            case 'Usuarios':
                return (
                    <section id="Usuarios">
                        <div className='DivFormUsuarios'>
                            <FormUsuarios></FormUsuarios>
                        </div>
                    </section>
                );
            case 'Computadoras':
                return (
                    <section id="Computadoras">
                        <div className='DivFormUsuarios'>
                            <FormEquipos></FormEquipos>
                        </div>
                        <div className='DivFormUsuarios'>
                            <FormEntregasyDev></FormEntregasyDev>
                        </div>
                    </section>
                );
            case 'Localizacion':
                return (
                    // Asegúrate de que el ID aquí sea 'Localizacion', no 'Lozalizacion' como en tu original.
                    <section id="Localizacion">
                        <div className='TituloSecciones'>
                                <h2>Lozalización</h2>
                        </div>
                        <div className='DivCamposFormEquipos'>
                            <select 
                                className="CamposFormEntregas"
                                name='Area'
                            >
                                <option value="" disabled selected> Elige un equipo</option>
                                <option value="equipo1">ING01</option>
                                <option value="equipo2">ING02</option>
                                <option value="equipo3">ING03</option>
                                <option value="equipo4">ADM01</option>
                                <option value="equipo5">ADM02</option>
                                <option value="equipo6">ADM03</option>
                                <option value="equipo7">RRH01</option>
                            </select>
                        </div>
                        <br />
                        <div className='DivLocalizador'>
                            <SeccionLocalizador></SeccionLocalizador>
                        </div>
                    </section>
                );
            case 'Soporte':
                return (
                    // Asegúrate de que el ID aquí sea 'Localizacion', no 'Lozalizacion' como en tu original.
                    <section id="Soporte"> 
                        <div className='TituloSecciones2'>
                            <h2>Soporte</h2>
                        </div>
                        <SeccionSoporte></SeccionSoporte>
                    </section>
                );
            default:
                return null;
        }
    };
    
    return <>
        <div className='Cabecera'>
        
        <header className="HeaderInventario">
            <div className="DivHeader">
                <img src="/Foltec.png" alt="LogoFoltec" />
            </div>
            <div >
                <Link to="/">
                    <h3 className="CerrarSesion">Cerrar sesión</h3>
                </Link>  
            </div>
        </header>
        <nav className='NavPrincipal'>
            {menuOpciones.map((opcion) => (
                <button 
                    key={opcion.id}
                    onClick={() => handleMenuClick(opcion.id)} 
                    className={seccionActiva === opcion.id ? 'activo' : ''}
                >
                    {opcion.texto}
                </button>
            ))}
        </nav>
        </div>
        <div id="ContenidoInventario">
                {SeccionContenido()}
        </div>
        <footer>
                &copy; Derechos reservados
        </footer>
    </>
}
export default PaginaInventario