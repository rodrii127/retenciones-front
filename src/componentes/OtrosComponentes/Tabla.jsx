import React from 'react'
import "./tabla.scss"

export const Tabla = ( props ) => {

    const lista = [ "",  "", "", "", "", "",  "", "", "", "", "",  "", "", "", "", "",  "", "", "", "" ]

    const calcularTotal = ( item ) =>{

        let suma = Number( item.engraved ) + Number( item.exempt ) + Number( item.iibb ) + Number( item.iva21 ) + Number( item.iva105 ) + Number( item.municipality ) + Number( item.taxedOthers )

        return suma

    }

    return (
        <div className='caja_tabla_resultado'>
            <div className="encabezado_tabla">
                <div className="columna" style={{ width: "20%" }} > Fecha </div>
                <div className="columna" style={{ width: "40%" }} > Proveedor </div>
                <div className="columna" style={{ width: "20%" }} > N° Factura </div>
                <div className="columna" style={{ width: "20%" }} > Total </div>
            </div>
            <div className="filas_tabla">
                {
                    props.listaBuscada.map( ( elemento, index ) => {
                        return <div key={index} className="fila_tabla">
                            <div className="columna" style={{ width: "20%" }} > { elemento.date ? elemento.date : "" } </div>
                            <div className="columna" style={{ width: "40%" }} > { elemento.provider ? elemento.provider : "" } </div>
                            <div className="columna" style={{ width: "20%" }} > { elemento.number ? elemento.number : "" } </div>
                            <div className="columna" style={{ width: "20%" }} > { calcularTotal( elemento ) } </div>
                        </div>
                    } )
                }
                
            </div>
        </div>
    )
}
