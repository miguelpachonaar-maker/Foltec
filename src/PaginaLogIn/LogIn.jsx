import React, { useState } from 'react';
import "../Estilos/Estilos.css";
// Se importa 'useNavigate' para redirigir al usuario tras un login exitoso
import { useNavigate } from 'react-router-dom'; 

const LogIn = () => {
    // Hook para manejar la navegación programáticamente
    const navigate = useNavigate(); 
    
    // 1. Estado para almacenar los valores de los inputs (Usuario y Contraseña)
    const [credenciales, setCredenciales] = useState({
        Usuario: '',
        Contraseña: ''
    });
    
    // 2. Estado para manejar y mostrar mensajes de error de la validación
    const [error, setError] = useState(''); 

    // Función para manejar los cambios en los inputs y actualizar el estado
    const handleChange = (e) => {
        setCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value
        });
        setError(''); // Limpiar el error cuando el usuario comienza a escribir
    };

    // Función principal para manejar el envío del formulario y la validación
    const handleSubmit = async (e) => {
        e.preventDefault(); // Detiene la recarga de la página por defecto del formulario

        const backendUrl = 'http://localhost:4000/api/login'; 

        try {
            // Realizar la solicitud POST al backend
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Enviar el nombre de usuario y la contraseña como JSON
                body: JSON.stringify(credenciales),
            });

            const data = await response.json();

            if (response.ok) {

                // Guardar sesión
                localStorage.setItem("auth", "true");
                // Validación exitosa: Redirigir al inventario
                console.log('Login exitoso:', data.mensaje);
                // Si el backend devuelve un token, lo guardarías aquí (ej: localStorage.setItem('token', data.token);)
                
                navigate('/PaginaInventario'); 

            } else {
                // Validación fallida (error 401, 400, etc., del servidor)
                // Mostrar el mensaje de error devuelto por el servidor
                setError(data.mensaje || 'Credenciales inválidas');
                console.error('Error de login:', data.mensaje);
            }

        } catch (err) {
            // Error de red (el servidor no está corriendo o hay un problema de conexión)
            setError('Credenciales inválidas. Intenta de nu.');
            console.error('Error de red/conexión:', err);
        }
    };

    return (
        <>
            <header className="HeaderLogIn">
                <div className="Logo">
                    <img src="/Foltec.png" alt="LogoFoltec" />
                </div>
                {/* 3. Asignar la función handleSubmit al evento onSubmit del formulario */}
                <form onSubmit={handleSubmit}> 
                    <br />
                    <div className="LogIn">
                        <div>
                            <h2>Log In</h2>
                        </div>

                        {/* Input para el Nombre de Usuario */}
                        <input
                            type="text"
                            name="Usuario"
                            id="Usuario"
                            className="BotonUsuario"
                            placeholder="Nombre Usuario"
                            // 4. Conectar el valor y el cambio con el estado de React
                            value={credenciales.Usuario}
                            onChange={handleChange}
                            required
                        />

                        {/* Input para la Contraseña */}
                        <input
                            type="password"
                            name="Contraseña"
                            id="Contraseña"
                            className="BotonUsuario"
                            placeholder="Contraseña"
                            // 4. Conectar el valor y el cambio con el estado de React
                            value={credenciales.Contraseña}
                            onChange={handleChange}
                            required
                        />
                        
                        {/* 5. Mostrar el mensaje de error si el estado 'error' no está vacío */}
                        {error && <p style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>{error}</p>}

                        <div className="DivIngresar">
                            {/* El botón debe ser de tipo 'submit' para activar handleSubmit */}
                            <button type="submit" className="Ingresar">
                                Ingresar
                            </button>
                        </div>

                        <div className="OlvideContrasena">
                            <br />
                            <br />
                            <a href="###"><h5>Olvidé mi contraseña</h5></a>
                            <br />
                        </div>
                    </div>
                </form>
            </header>
        </>
    )
}

export default LogIn;