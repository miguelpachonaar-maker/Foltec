import "../Estilos/Estilos.css"
import { Link } from "react-router-dom"




const Nav = () => {
  return(
    <nav className="NavPrincipal">
         <Link to="/Foltec" className="RutaPagina"><i class="bi bi-house"></i> Inicio</Link>
        <Link to="/Foltec/Usuarios" className="RutaPagina"> <i class="bi bi-person-vcard-fill"></i> Usuarios </Link>
        <Link to="/Foltec/Equipos" className="RutaPagina"><i class="bi bi-pc-display"></i> Equipos </Link>
        <Link to="/Foltec/Localizacion" className="RutaPagina"> <i class="bi bi-geo-alt"></i> Localización </Link>
        <Link to="/Foltec/Soporte" className="RutaPagina"><i class="bi bi-wrench-adjustable"></i> Soporte </Link>


    </nav>
  )
}
export default Nav;