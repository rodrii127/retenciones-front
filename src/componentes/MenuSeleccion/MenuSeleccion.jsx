import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./menuSeleccion.scss"

export const MenuSeleccion = ( props ) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("deslogueo")
    navigate("/login", {
      replace: true
    })
  }


  return (
    <div className='menu_seleccion'>

        <div className="menu_lateral">
            <div className='encabezado' > MENÚ </div>
            <div className='titulo' onClick={ () => navigate("/factura") } > Facturas </div>
            <div className='titulo' onClick={ () => navigate("/retenciones") } > Orden de Pago </div>
            <div className='titulo' onClick={ () => navigate("/proveedor") } > Proveedores </div>
            <div className='titulo' onClick={handleLogout} > Cerrar Sesión </div>
            <span className='titulo'>NombreCompañia</span>
        </div>

        <div className="titulo"> Sistema de Retención </div>

    </div>
  )
}
