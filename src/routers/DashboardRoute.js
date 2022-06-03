import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Informes } from '../componentes/Informes/Informes'
import { MenuSeleccion } from '../componentes/MenuSeleccion/MenuSeleccion'
import { Factura } from '../componentes/MesaTrabajo/Factura'
import { OrdenPago } from '../componentes/OrdenPago/OrdenPago'
import { Proveedor } from '../componentes/Proveedor/Proveedor'

export const DashboardRoute = () => {
    return (
        <>
            <Routes>
                <Route path="/*" element={<MenuSeleccion />} />
                <Route path="/proveedor" element={<Proveedor />} />
                <Route path="/orden-pago" element={<OrdenPago />} />
                <Route path="/factura" element={<Factura />} />
                <Route path="/informes" element={<Informes />} />
            </Routes>
        </>)
}
