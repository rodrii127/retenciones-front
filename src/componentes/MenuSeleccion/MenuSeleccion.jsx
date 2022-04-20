import React from 'react'
import "./menuSeleccion.scss"

export const MenuSeleccion = ( props ) => {
  return (
    <div className='menu_seleccion'>

        <div className="menu_lateral">
            <div className='encabezado' > MENÚ </div>
            <div className='titulo' onClick={ () => props.setpagina("factura") } > Facturas </div>
            <div className='titulo'> Retenciones </div>
            <div className='titulo' onClick={ () => props.setpagina("proveedor") } > Proveedores </div>
            <div className='titulo'> Utiles </div>
            <div className='titulo'> Otros </div>
        </div>

        <div className="titulo"> Sistema de Retención </div>

    </div>
  )
}
