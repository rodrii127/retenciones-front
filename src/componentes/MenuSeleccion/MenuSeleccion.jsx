import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmForm } from '../Alerts/SweetAlert'
import { UserContext } from '../Contexto/UserContext'
import "./menuSeleccion.scss"

export const MenuSeleccion = (props) => {

  const { dispatch } = useContext(UserContext)

  const { user } = useContext(UserContext)

  const navigate = useNavigate();

  const [flagPayOrderSubMenu, setFlagPayOrderSubMenu] = useState(false)

  const [flagRetentionSubMenu, setFlagRetentionSubMenu] = useState(false)

  const handleLogout = () => {
    confirmForm(dispatch, navigate);
  }

  const getCompanyName = () => {
    const jwtJson = parseJwt(user.token)
    return jwtJson.sub;
  }

  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

  return (
    <div className='menu_seleccion'>

      <div className="menu_lateral">
        <div className='encabezado' > MENÚ </div>
        <div className='titulo' onClick={() => navigate("/factura")} > Facturas </div>
        <div className='titulo' onClick={() => setFlagPayOrderSubMenu(!flagPayOrderSubMenu)} > Orden de Pago </div>
        {flagPayOrderSubMenu
          ? <div className='titulo_submenu' onClick={() => navigate("/orden-pago")}> Generar Orden de Pago </div>
          : undefined
        }
        <div className='titulo' onClick={() => navigate("/proveedor")} > Proveedores </div>
        <div className='titulo' onClick={() => setFlagRetentionSubMenu(!flagRetentionSubMenu)} > Retenciones </div>
        {flagRetentionSubMenu
          ? <div className='titulo_submenu' onClick={() => navigate("/retenciones")}> Exportar Retenciones </div>
          : undefined
        }
        <div className='titulo' onClick={handleLogout} > Cerrar Sesión </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ textAlign: 'right', marginRight: '5%', fontSize: '20px' }} > {getCompanyName()} </div>

        <div className="titulo" style={{ height: '100%' }}> Sistema de Retención </div>
      </div>
    </div>
  )
}
