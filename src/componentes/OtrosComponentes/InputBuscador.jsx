import React, { useState, useEffect } from 'react'
import "./inputBuscador.scss"

export const InputBuscador = (props) => {

    const [valorInput, setValorInput] = useState("")

    const [valorId, setValorId] = useState("")

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
        setValorId(e.target.getAttribute("valueId")) 
        setflagDropdown(false)
    }

    const handleInput = (e) => {
        const existElement = listaDeElementos.find(elemento => elemento.nombre.toLowerCase() === e.target.value.toLowerCase());
        
        if (existElement) {
            setValorInput(existElement.nombre)
            setValorId(e.target.getAttribute('valueId'))
        } else {
            setValorInput('')
            setValorId('')
            setListaDeElementos(props.lista)
        }
    } 

    return (
        <div className='input_buscador' style={ props.style ? props.style : {} } >
            <div className="label_buscador"> { props.nombre } </div>
            <div className="caja_contenedor" style={ flagDropdown ? { width: props.width} : { borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px", width: props.width } } >
                <input type="text" onChange={filtrarLista} valueId={valorId} value={valorInput} onClick={ () => setflagDropdown(true) } onBlur={handleInput} />
            </div>
            <div className="dropdown_buscador" style={ flagDropdown ? { display: "flex", width: props.width } : { display: "none", width: props.width } } >
                {
                    listaDeElementos.map( ( elemento, index ) => {
                        return <div key={index} className='item_dropdown' value={elemento.nombre} valueId={elemento.id} onClick={clickItem}>{ elemento.nombre }</div>
                    } )
                }
            </div>
        </div>
    )
}
