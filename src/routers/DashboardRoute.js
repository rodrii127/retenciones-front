import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Ant_Main_Menu from '../componentes/AntComponents/MenuPrincipal/Ant_Main_Menu'

export const DashboardRoute = () => {
    return (
        <>
            <Routes>
                <Route path="/*" element={<Ant_Main_Menu />} />
                <Route path="/proveedor" element={<Ant_Main_Menu selection={"3"} />} />
                <Route path="/orden-pago" element={<Ant_Main_Menu selection={"4"} subSelection={"sub2"} />} />
                <Route path="/nueva-factura" element={<Ant_Main_Menu selection={"1"} subSelection={"sub1"} />} />
                <Route path="/ver-facturas" element={<Ant_Main_Menu selection={"2"} subSelection={"sub1"} />} />
                <Route path="/retenciones" element={<Ant_Main_Menu selection={"5"} subSelection={"sub3"} />} />
            </Routes>
        </>)
}
