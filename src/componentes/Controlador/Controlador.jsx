import React, { useContext, useEffect, useState } from 'react'
/* import { UserContext } from '../Contexto/UserContext' */
import { MenuSeleccion } from '../MenuSeleccion/MenuSeleccion'
import { MainView } from '../MesaTrabajo/MainView'
import { Loading } from '../OtrosComponentes/Loading'
import { Login } from '../Login/Login'
import { Proveedor } from '../Proveedor/Proveedor'
import { Retenciones } from '../Retenciones/Retenciones'


export const Controlador = () => {

    const [pagina, setpagina] = useState( "login" )
    const [loading, setloading] = useState( false )
    /* const { token, setToken } = useContext( UserContext ) */

    useEffect(() => {
      
        

    }, [])

    return (
        <div>
            
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

            
        </div>
    )
}
