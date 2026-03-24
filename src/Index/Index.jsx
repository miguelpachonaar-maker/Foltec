import { Routes, Route } from 'react-router-dom';
import RootLayout from '../Layout/RootLayout';
import PaginaInventario from '../PaginaInventario/PaginaInventario';
import LogIn from '../PaginaLogIn/LogIn';
import FormUsuarios from '../InfoSecciones/FormUsuarios';
import FormEquipos from '../InfoSecciones/FormEquipos';
import Localizador from '../InfoSecciones/SeccionLocalizador';
import SeccionSoporte from '../InfoSecciones/SeccionSoporte';
import Usuarios from '../InfoSecciones/Usuarios';
import DetalleUsuairos from '../InfoSecciones/DetalleUsuarios';


const Index = () => {
    return <>
     <Routes>
        <Route path='/' element={<LogIn />}> </Route>
        <Route path='/Foltec' element={<RootLayout/>} > 
          <Route index element= {<PaginaInventario />}/>
          <Route path='RegistroUsuarios' element ={<FormUsuarios/>}/>
          <Route path='Equipos' element={<FormEquipos/>}/>
          <Route path='Usuarios' element ={<Usuarios/>}/>
          <Route path='Localizacion' element ={<Localizador/>}/>
          <Route path='Soporte' element ={<SeccionSoporte/>}/>
          <Route path='Usuarios/:id' element ={<DetalleUsuairos/>}/>
        </Route>
     </Routes>
    </>
}

export default Index;