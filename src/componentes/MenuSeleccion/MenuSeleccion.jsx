import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmForm } from '../Alerts/SweetAlert'
import { UserContext } from '../Contexto/UserContext'
import "./menuSeleccion.scss"

export const MenuSeleccion = (props) => {

  const { dispatch } = useContext(UserContext)

  const navigate = useNavigate();

  const [flagPayOrderSubMenu, setFlagPayOrderSubMenu] = useState(false)

  const [flagRetentionSubMenu, setFlagRetentionSubMenu] = useState(false)

  const handleLogout = () => {
    confirmForm(dispatch, navigate);
  }

  return (
    <div className='menu_seleccion'>

      <div className="menu_lateral">
        <div className='encabezado' > MENÚ </div>
        <div className='titulo' onClick={() => navigate("/factura")} > Facturas </div>
        <div className='titulo' onClick={() => setFlagPayOrderSubMenu(!flagPayOrderSubMenu)} > Orden de Pago </div>
        {flagPayOrderSubMenu
          ? <div className='titulo titulo_submenu' onClick={() => navigate("/orden-pago")}> Generar Orden de Pago </div>
          : undefined
        }
        <div className='titulo' onClick={() => navigate("/proveedor")} > Proveedores </div>
        <div className='titulo' onClick={() => setFlagRetentionSubMenu(!flagRetentionSubMenu)} > Retenciones </div>
        {flagRetentionSubMenu
          ? <div className='titulo titulo_submenu' onClick={() => navigate("/retenciones")}> Exportar Retenciones </div>
          : undefined
        }
        <div className='titulo' onClick={handleLogout} > Cerrar Sesión </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ textAlign: 'right', marginRight: '5%', fontSize: '20px' }} > NombreCompañia </div>

        <div className="titulo" style={{ height: '100%' }}> Sistema de Retención </div>
      </div>
    </div>
  )
}
