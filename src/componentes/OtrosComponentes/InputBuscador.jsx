import React, { useState, useEffect } from 'react'
import "./inputBuscador.scss"

export const InputBuscador = (props) => {

    const [valorInput, setValorInput] = useState("")

    const [listaDeElementos, setListaDeElementos] = useState( props.lista ? props.lista : [] )

    const [flagDropdown, setflagDropdown] = useState(false)

    useEffect(() => {
      
        const eventoClick = (e) =>{
            if( !e.target.closest(".input_buscador") ){
                setflagDropdown(false)
            }else{
                
            }
        }

        document.addEventListener("click", eventoClick )
    
      return () => {
        
      }
    }, [])

    const filtrarLista = (e) =>{
        
        setListaDeElementos( props.lista.filter( s => s.nombre.toLowerCase().indexOf( e.target.value.toLocaleLowerCase() ) > -1 ) )
        setValorInput( e.target.value ) 
    }

    const clickItem = (e) =>{

        setValorInput(e.target.getAttribute("value"))
        setflagDropdown(false)

    }

    return (
        <div className='input_buscador' style={ props.style ? props.style : {} } >
            <div className="label_buscador"> { props.nombre } </div>
            <div className="caja_contenedor" style={ flagDropdown ? {} : { borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" } } >
                <input type="text" onChange={filtrarLista} value={valorInput} onClick={ () => setflagDropdown(true) } />
            </div>
            <div className="dropdown_buscador" style={ flagDropdown ? { display: "flex" } : { display: "none" } } >
                {
                    listaDeElementos.map( ( elemento, index ) => {
                        return <div key={ index } className='item_dropdown' value={elemento.nombre} valueId={elemento.id} onClick={clickItem} >{ elemento.nombre }</div>
                    } )
                }
            </div>
        </div>
    )
}
