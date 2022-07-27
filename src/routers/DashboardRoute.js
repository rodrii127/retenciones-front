import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Retenciones } from '../componentes/Retenciones/Retenciones'
import { MenuSeleccion } from '../componentes/MenuSeleccion/MenuSeleccion'
import { NuevaFactura } from '../componentes/Factura/NuevaFactura'
import { OrdenPago } from '../componentes/OrdenPago/OrdenPago'
import { Proveedor } from '../componentes/Proveedor/Proveedor'
import Ant_Main_Menu from '../componentes/AntComponents/MenuPrincipal/Ant_Main_Menu'
import { VerFacturas } from '../componentes/Factura/VerFacturas'

export const DashboardRoute = () => {
    return (
        <>
            <Routes>
                <Route path="/*" element={<Ant_Main_Menu />} />
                <Route path="/proveedor" element={<Ant_Main_Menu selection={"3"} />} />
                <Route path="/orden-pago" element={ <Ant_Main_Menu selection={"4"} subSelection={ "sub2" } /> } />
                <Route path="/nueva-factura" element={<Ant_Main_Menu selection={"1"} subSelection={ "sub1" } />} />
                <Route path="/ver-facturas" element={<Ant_Main_Menu selection={"2"} subSelection={ "sub1" }/>} />
                <Route path="/retenciones" element={ <Ant_Main_Menu selection={"5"} subSelection={ "sub3" } /> } />
            </Routes>
        </>)
}
