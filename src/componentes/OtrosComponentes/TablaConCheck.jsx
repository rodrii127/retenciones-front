import React from 'react'

export const TablaConCheck = (props) => {

    const getTotal = (element) => {
        const total = (Number(element.engraved)
        + Number(element.exempt)
        + Number(element.iibb)
        + Number(element.iva21)
        + Number(element.iva105)
        + Number(element.municipality)
        + Number(element.taxedOthers)).toFixed(2)

        return total
    }

    const selectCheckboxItem = (event, elemento) => {
        let newSelectedCheckboxItems = [...props.selectedCheckboxItems];
        
        if(event.target.checked) {
            props.setSelectedCheckboxItems([...newSelectedCheckboxItems, elemento])
        } else {
            newSelectedCheckboxItems = props.selectedCheckboxItems.filter(element => element.id !== elemento.id)
            props.setSelectedCheckboxItems(newSelectedCheckboxItems)
        }
    }

    return (
        <div className='caja_tabla_resultado'>

            <div className="encabezado_tabla">
                <div className="columna" style={{ width: "10%" }} > Check </div>
                <div className="columna" style={{ width: "10%" }} > Fecha </div>
                <div className="columna" style={{ width: "40%" }} > Proveedor </div>
                <div className="columna" style={{ width: "20%" }} > N° Factura </div>
                <div className="columna" style={{ width: "20%" }} > Total </div>
            </div>
            <div className="filas_tabla">
                {
                    props.listaBuscada.map((elemento, index) => {
                        return <div key={index} className="fila_tabla">
                            <div className="columna check" style={{ width: "10%" }} >
                                <input type="checkbox" onClick={(event) => selectCheckboxItem(event, elemento)}/>
                            </div>
                            <div className="columna" style={{ width: "10%" }}>{elemento.date}</div>
                            <div className="columna" style={{ width: "40%" }}>{elemento.provider.companyName}</div>
                            <div className="columna" style={{ width: "20%" }}>{elemento.pointSale + '-' + elemento.number}</div>
                            <div className="columna" style={{ width: "20%" }}>{getTotal(elemento)}</div>
                        </div>
                    })
                }

            </div>

        </div>
    )
}
