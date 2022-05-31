import React, { useContext, useEffect, useState } from 'react'
/* import { UserContext } from '../Contexto/UserContext' */
import { MenuSeleccion } from '../MenuSeleccion/MenuSeleccion'
import { Factura } from '../MesaTrabajo/Factura'
import { Loading } from '../OtrosComponentes/Loading'
import { Login } from '../Login/Login'
import { Proveedor } from '../Proveedor/Proveedor'
import { Retenciones } from '../Retenciones/Retenciones'
import { AppRouter } from '../../routers/AppRouter'


export const Controlador = () => {

    const [pagina, setpagina] = useState( "login" )
    const [loading, setloading] = useState( false )
    console.log("entro al Controlador")

    useEffect(() => {
    }, [])

    return (
        <AppRouter/>
        /*<div>
            
            {
                loading ? 
                <Loading estilo={ { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" } } ancho={ "200" } />
                :
                pagina === "login" ?
                <Login setpagina={ setpagina } />
                :
                pagina === "menu_seleccion" ?
                <MenuSeleccion setpagina={ setpagina } />
                :
                pagina === "factura" ?
                <MainView setpagina={ setpagina } />
                :
                pagina === "proveedor"  ?
                <Proveedor setpagina={ setpagina } />
                :
                pagina === "retencion"  ?
                <Retenciones setpagina={ setpagina } />
                :
                ""
            }
            
        </div>*/
    )
}
