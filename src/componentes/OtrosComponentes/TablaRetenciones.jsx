import React from 'react'
import "./tabla.scss"

export const TablaRetenciones = (props) => {

    const getRetentionsTotal = () => {
        let total = 0
        props.listaBuscada.map((elemento, index) => {
            return total = total + elemento.retentionAmount
        })
        return Number(total).toFixed(2)
    }

    return (
        <div className='caja_tabla_resultado'>
            <div className="encabezado_tabla">
                <div className="columna" style={{ width: "20%" }} > Fecha </div>
                <div className="columna" style={{ width: "40%" }} > Proveedor </div>
                <div className="columna" style={{ width: "20%" }} > N° Retención </div>
                <div className="columna" style={{ width: "20%" }} > Monto Retención </div>
            </div>
            <div className="filas_tabla">
                {
                    props.listaBuscada.map((elemento, index) => {
                        return <div key={index} className="fila_tabla">
                            <div className="columna" style={{ width: "20%" }} > {elemento.date ? elemento.date : ""} </div>
                            <div className="columna" style={{ width: "40%" }} > {elemento.provider ? elemento.provider.companyName : ""} </div>
                            <div className="columna" style={{ width: "20%" }} > {elemento.number ? elemento.number : ""} </div>
                            <div className="columna" style={{ width: "20%" }} > {elemento.retentionAmount} </div>
                        </div>
                    })
                }
                <div className="fila_tabla">
                    <div className="columna" style={{ width: "20%" }} > TOTAL </div>
                    <div className="columna" style={{ width: "40%" }} >  </div>
                    <div className="columna" style={{ width: "20%" }} >  </div>
                    <div className="columna" style={{ width: "20%" }} > {getRetentionsTotal()} </div>
                </div>
            </div>
        </div>
    )
}
