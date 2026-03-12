    import '../Estilos/Estilos.css'
    import { useForm } from '@formspree/react';

    const ENDPOINT_URL = "xblpnryd";

    const SeccionSoporte = () => {
        const [state, handleSubmit] = useForm(ENDPOINT_URL);

        if (state.succeeded) {
            return <p>¡Tu reporte de soporte ha sido enviado con éxito! Te contactaremos pronto.</p>;
        }

    return <>
        <form onSubmit={handleSubmit} className='FormSoporte'>    
            <div className='SubFormSoporte'>
                <div className='DivCamposFormSoporte'>
                    <input 
                    type="text"
                    className="CamposFormSoporte"
                    placeholder='Nombres y apellidos'
                    name="NombreCompleto"
                    required
                    />
                </div>
                <div className='DivCamposFormSoporte'>
                    <input 
                    type="number"
                    className="CamposFormSoporte"
                    placeholder='Contacto'
                    name='Contacto'
                    required
                    />
                </div>
                <div className='DivCamposFormSoporte'>
                    <input 
                    type="number"
                    className="CamposFormSoporte"
                    placeholder='Usuario con falla'
                    name="UsuarioFalla"
                    required
                    />
                </div>
                <div className='DivCamposFormSoporte'>
                    <input 
                    type="text"
                    className="CamposFormSoporte"
                    placeholder='Cargo'
                    name="cargo"
                    required
                    />
                </div>
                <div className='DivCamposFormSoporte'>
                    <input 
                    type="text"
                    className="CamposFormSoporte"
                    placeholder='Ciudad'
                    name='Ciudad'
                    required
                    />
                </div>
                <div className='DivCamposFormSoporte'>
                    <textarea 
                    type="text"
                    className="TextArea"
                    placeholder='Falla que reporta'
                    name='ReporteFalla'
                    required
                    />
                </div>
                <br />
                <div className="BotonFormSoporte">
                    <button 
                        type="submit" 
                        className="BotonEnviar"
                        disabled={state.submitting}
                    >
                        Enviar
                    </button>
                </div>
            </div>
            <div className='ImagenSoporte'>
                <h4>¿Tienes problemas con tu software?</h4>
                <br />
                <h4>Por favor comentanos qué sucede diligenciando el formulario. A tu correo recibirás una respuesta de nuestro líder de mesa de ayuda, no olvides colocar todos tus datos y verificarlos antes de enviarlos</h4>
                <div  className='LogoSoporte'>
                    <img src="/Foltec.png" alt="" />
                </div>
                <img src="https://summit.com.pe/wp-content/uploads/2024/04/help-desk-ti-1.webp" alt="" />
            </div>
        </form>
    </>
}
export default SeccionSoporte