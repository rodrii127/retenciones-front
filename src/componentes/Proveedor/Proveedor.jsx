import React, { useContext, useState } from 'react'
import { InputConLabelArriba } from '../OtrosComponentes/InputConLabelArriba'
import { UserContext } from '../Contexto/UserContext'
import "./proveedor.scss"
import { Loading } from '../OtrosComponentes/Loading'

export const Proveedor = ( props ) => {

    const { token } = useContext(UserContext)

    const [flag, setFlag] = useState(false)

    function postProveedor(  ){

        document.querySelector(".boton_guardar").style.pointerEvents = "none"
        document.querySelector(".boton_guardar").style.opacity = "0.7"

        let lista = []
        let vacios = false

        document.querySelectorAll("input").forEach( ( e, i) => { 
            if( e.value === ""  ){
                vacios = true
            }
            lista.push( e.value ) 
        })

        if( vacios ){
            alert("No pueden quedar campos vacios...")
            document.querySelector(".boton_guardar").style.pointerEvents = "all"
            document.querySelector(".boton_guardar").style.opacity = "1"
            return
        }

        if( lista[1].length !== 11 ){
            alert("El CUIT tiene que tener 11 caracteres...")
            document.querySelector(".boton_guardar").style.pointerEvents = "all"
            document.querySelector(".boton_guardar").style.opacity = "1"
            return
        }

        setFlag( true )

        fetch('https://retentencionesnmisiones.herokuapp.com/v1/retenciones/providers', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                companyName: lista[0],
                cuit: lista[1],
                address: lista[2],
                phone: lista[3],
                fiscalCondition: lista[4]
            })
        })
        .then(res => res.json())
        .then(res=> {

            document.querySelector(".boton_guardar").style.pointerEvents = "all"
            document.querySelector(".boton_guardar").style.opacity = "1"

            if( res.status ){
                alert("Nose se pudo guardar, algunos de los campos ya existen...")
                setFlag(false)
                return
            }

            alert("Proveedor guardado exitosamente!")
            document.querySelectorAll("input").forEach( ( e, i) => { 
                e.value = ""
            })
            setFlag(false)
        });
        
    }

  return (
    <div>
        <div className="provedores">
            
            <div className="titulo"> Ingrese un proveedor </div>
            
            <InputConLabelArriba nombre={"Razón Social:"} style={ {marginLeft: "5px"} } tipo={ "text" } />
            <InputConLabelArriba nombre={"CUIT:"} style={ {marginLeft: "5px"} } tipo={ "text" } />
            <InputConLabelArriba nombre={"Dirección:"} style={ {marginLeft: "5px"} } tipo={ "text" } />
            <InputConLabelArriba nombre={"Teléfono:"} style={ {marginLeft: "5px"} } tipo={ "number" } />
            <InputConLabelArriba nombre={"Condición Fiscal:"} style={ {marginLeft: "5px"} } tipo={ "text" } />
            
            <div className="caja_guardar">
                <div className="boton_guardar" onClick={ postProveedor }>
                    {
                        flag ?
                        <Loading estilo={ { display: "flex", justifyContent: "center", alignItems: "center" } } ancho={ "" } />
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c-35.2 0-64 28.8-64 64c0 35.2 28.8 64 64 64c35.2 0 64-28.8 64-64C288 284.8 259.2 256 224 256zM433.1 129.1l-83.9-83.9C341.1 37.06 328.8 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 151.2 442.9 138.9 433.1 129.1zM128 80h144V160H128V80zM400 416c0 8.836-7.164 16-16 16H64c-8.836 0-16-7.164-16-16V96c0-8.838 7.164-16 16-16h16v104c0 13.25 10.75 24 24 24h192C309.3 208 320 197.3 320 184V83.88l78.25 78.25C399.4 163.2 400 164.8 400 166.3V416z"/></svg>
                    }
                </div>
                <div className='titulo'> Guardar </div>
            </div>

            <div className="boton_volver" onClick={ () => props.setpagina("menu_seleccion") }> Volver <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 256c0 123.4-100.5 223.9-223.9 223.9c-48.86 0-95.19-15.58-134.2-44.86c-14.14-10.59-17-30.66-6.391-44.81c10.61-14.09 30.69-16.97 44.8-6.375c27.84 20.91 61 31.94 95.89 31.94C344.3 415.8 416 344.1 416 256s-71.67-159.8-159.8-159.8C205.9 96.22 158.6 120.3 128.6 160H192c17.67 0 32 14.31 32 32S209.7 224 192 224H48c-17.67 0-32-14.31-32-32V48c0-17.69 14.33-32 32-32s32 14.31 32 32v70.23C122.1 64.58 186.1 32.11 256.1 32.11C379.5 32.11 480 132.6 480 256z"/></svg> </div>

        </div>
    </div>
  )
}
