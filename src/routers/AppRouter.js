import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Login } from "../componentes/Login/Login";
import { MenuSeleccion } from "../componentes/MenuSeleccion/MenuSeleccion";
import { Factura, MainView } from "../componentes/MesaTrabajo/Factura";
import { Proveedor } from "../componentes/Proveedor/Proveedor";
import { Retenciones } from "../componentes/Retenciones/Retenciones";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MenuSeleccion />} />
                <Route path="/login" element={<Login />} />
                <Route path="/proveedor" element={<Proveedor />} />
                <Route path="/retenciones" element={<Retenciones />} />
                <Route path="/factura" element={<Factura />} />
            </Routes>
        </BrowserRouter>
    )
}
