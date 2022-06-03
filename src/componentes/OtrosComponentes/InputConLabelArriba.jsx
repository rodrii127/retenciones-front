import React, { useState } from 'react'
import "./inputConLabelArriba.scss"

export const InputConLabelArriba = (props) => {

  const [valorInput, setValorInput] = useState("")

  //This code prevents decrease and increase number field with mouse wheel.
  document.addEventListener("wheel", function (event) {
    if (document.activeElement.type === "number") {
      document.activeElement.blur();
    }
  });

  return (
    <div className='input_con_label_arriba' style={props.style ? props.style : {}} >
      <div className="label_buscador"> {props.nombre} </div>
      <div className="caja_contenedor" style={{ borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" }} >
        <input disabled={props.deshabilitado} type={props.tipo} valueName={props.nombre} onChange={(e) => setValorInput(e.target.value)} value={valorInput} />
      </div>
    </div>
  )
}
