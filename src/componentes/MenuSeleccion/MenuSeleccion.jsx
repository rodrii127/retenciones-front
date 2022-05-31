import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmForm } from '../Alerts/SweetAlert'
import { UserContext } from '../Contexto/UserContext'
import "./menuSeleccion.scss"

export const MenuSeleccion = ( props ) => {

  const {dispatch} = useContext(UserContext)

  const navigate = useNavigate();

  const handleLogout = () => {
    //TODO agregar una confirmacion
    confirmForm(dispatch, navigate);
  }


  return (
    <div className='menu_seleccion'>

        <div className="menu_lateral">
            <div className='encabezado' > MENÚ </div>
            <div className='titulo' onClick={ () => navigate("/factura") } > Facturas </div>
            <div className='titulo' onClick={ () => navigate("/orden-pago") } > Orden de Pago </div>
            <div className='titulo' onClick={ () => navigate("/proveedor") } > Proveedores </div>
            <div className='titulo' onClick={handleLogout} > Cerrar Sesión </div>
        </div>

        <div className="titulo"> Sistema de Retención </div>

    </div>
  )
}
