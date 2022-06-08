import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmForm } from '../Alerts/SweetAlert'
import { UserContext } from '../Contexto/UserContext'
import "./menuSeleccion.scss"

export const MenuSeleccion = (props) => {

  const { dispatch } = useContext(UserContext)

  const navigate = useNavigate();

  const handleLogout = () => {
    confirmForm(dispatch, navigate);
  }


  return (
    <div className='menu_seleccion'>

      <div className="menu_lateral">
        <div className='encabezado' > MENÚ </div>
        <div className='titulo' onClick={() => navigate("/factura")} > Facturas </div>
        <div className='titulo' onClick={() => navigate("/orden-pago")} > Orden de Pago </div>
        <div className='titulo' onClick={() => navigate("/proveedor")} > Proveedores </div>
        <div className='titulo' onClick={() => navigate("/informes")} > Informes </div>
        <div className='titulo' onClick={handleLogout} > Cerrar Sesión </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width:'100%'}}>
        <div style={{ textAlign:'right', marginRight:'5%', fontSize:'20px'}} > NombreCompañia </div>

        <div className="titulo" style={{height:'100%'}}> Sistema de Retención </div>
      </div>
    </div>
  )
}
