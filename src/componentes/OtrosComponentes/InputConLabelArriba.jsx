import React, {useState} from 'react'
import "./inputConLabelArriba.scss"

export const InputConLabelArriba = (props) => {

  const [valorInput, setValorInput] = useState("")

  return (
    <div className='input_con_label_arriba' style={ props.style ? props.style : {} } >
        <div className="label_buscador"> { props.nombre } </div>
        <div className="caja_contenedor" style={ { borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" } } >
            <input type={ props.tipo } valueName={ props.nombre }  onChange={ (e) => setValorInput(e.target.value) } value={ valorInput } />
        </div>
    </div>
  )
}
