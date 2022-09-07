import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Ant_Main_Menu from '../componentes/AntComponents/MenuPrincipal/Ant_Main_Menu'
import { UserContext } from '../componentes/Contexto/UserContext'

export const DashboardRoute = () => {
    const { user } = useContext(UserContext)
    return (
        <>
            <Routes>
                <Route path="/*" element={<Ant_Main_Menu user={user} />} />
                <Route path="/proveedor" element={<Ant_Main_Menu user={user} selection={"3"} />} />
                <Route path="/orden-pago" element={<Ant_Main_Menu user={user} selection={"4"} subSelection={"sub2"} />} />
                <Route path="/nueva-factura" element={<Ant_Main_Menu user={user} selection={"1"} subSelection={"sub1"} />} />
                <Route path="/ver-facturas" element={<Ant_Main_Menu user={user} selection={"2"} subSelection={"sub1"} />} />
                <Route path="/retenciones" element={<Ant_Main_Menu user={user} selection={"5"} subSelection={"sub3"} />} />
            </Routes>
        </>)
}
