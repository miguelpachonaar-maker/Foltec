import "../Estilos/Estilos.css"
import { Link } from "react-router-dom"



const Nav = () => {
  return(
    <nav className="NavPrincipal">
                <Link to="/Foltec" className="RutaPagina"><i className="bi bi-inicio"/>Inicio</Link>
        <Link to="/Foltec/Usuarios" className="RutaPagina"> <i className="bi bi-people"></i> Usuarios </Link>
        <Link to="/Foltec/Equipos" className="RutaPagina"><i className="bi bi-equipo"></i> Equipos </Link>
        <Link to="/Foltec/Localizacion" className="RutaPagina"> <i className="bi bi-mapa"/>Localización </Link>
        <Link to="/Foltec/Soporte" className="RutaPagina"><i className="bi bi-soporte"/> Soporte </Link>


    </nav>
  )
}
export default Nav;