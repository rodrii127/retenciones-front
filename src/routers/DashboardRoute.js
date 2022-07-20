import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Retenciones } from '../componentes/Retenciones/Retenciones'
import { MenuSeleccion } from '../componentes/MenuSeleccion/MenuSeleccion'
import { Factura } from '../componentes/Factura/Factura'
import { OrdenPago } from '../componentes/OrdenPago/OrdenPago'
import { Proveedor } from '../componentes/Proveedor/Proveedor'
import Ant_Main_Menu from '../componentes/AntComponents/MenuPrincipal/Ant_Main_Menu'

export const DashboardRoute = () => {
    return (
        <>
            <Routes>
                <Route path="/*" element={<Ant_Main_Menu />} />
                <Route path="/proveedor" element={<Proveedor />} />
                <Route path="/orden-pago" element={<OrdenPago />} />
                <Route path="/factura" element={<Factura />} />
                <Route path="/retenciones" element={<Retenciones />} />
            </Routes>
        </>)
}
