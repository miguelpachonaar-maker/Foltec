import { Outlet } from "react-router-dom";
import Nav from "../MenuNav/Nav";
import Footer from "../footer/footer";
import { useNavigate } from "react-router-dom";
import "../Estilos/Estilos.css";
import { useEffect } from "react";

function RootLayout(){
    const navigate = useNavigate ();
    const usuarioID = localStorage.getItem("usuarioID");
    const nombreUsuario = localStorage.getItem("nombreUsuario");

    useEffect(()=> {
        if (!usuarioID) {
            navigate("/")
        }
    }, [navigate, usuarioID]);

    const cerrarSesion = () => {
        localStorage.removeItem("usuarioID");
        localStorage.removeItem("nombreUsuario");

        alert("Sesión Cerrada");
        navigate("/");
    } ;  
    
  return (
    <div className="App"    >
        <header className="DivHeader">
            <div className="HeaderLeft">
            <img src="/Foltec.png"></img>
            </div>

            <div className="HeaderCenter">
                                <h3>{nombreUsuario}</h3>
            </div>
             <div className="HeaderRight">
            {usuarioID && (
                <>


                <button onClick={cerrarSesion} className="CerrarSesion">
                  Cerrar Sesion.
                </button>

                </>
            )}
            </div>
        </header>   
        <Nav />
        <main className="main-content">
            <Outlet />
        </main>
        <Footer/>
    </div>
  );
}
export default RootLayout;