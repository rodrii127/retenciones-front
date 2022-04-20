import React from 'react'
import "./tabla.scss"

export const Tabla = () => {

    const lista = [ "",  "", "", "", "", "",  "", "", "", "", "",  "", "", "", "", "",  "", "", "", "" ]

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
                    lista.map( ( elemento, index ) => {
                        return <div key={index} className="fila_tabla">
                            <div className="columna" style={{ width: "20%" }} >  </div>
                            <div className="columna" style={{ width: "40%" }} >  </div>
                            <div className="columna" style={{ width: "20%" }} >  </div>
                            <div className="columna" style={{ width: "20%" }} >  </div>
                        </div>
                    } )
                }
                
            </div>
        </div>
    )
}
