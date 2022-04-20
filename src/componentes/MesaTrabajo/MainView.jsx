import React, { useContext, useEffect, useState } from 'react'
import "./mainView.scss"

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment'

import DateFnsUtils from '@date-io/date-fns';

import { KeyboardDatePicker } from "@material-ui/pickers";

import esLocale from 'date-fns/locale/es'
import { InputBuscador } from '../OtrosComponentes/InputBuscador';
import { InputConLabelArriba } from '../OtrosComponentes/InputConLabelArriba';
import { Tabla } from '../OtrosComponentes/Tabla';

import { UserContext } from '../Contexto/UserContext'
import { Loading } from '../OtrosComponentes/Loading';

export const MainView = (props) => {

    const [selectedDateFactura, handleDateChangeFactura] = useState(new Date());

    const [selectedDateDesde, handleDateChangeDesde] = useState(new Date());

    const [selectedDateHasta, handleDateChangeHasta] = useState(new Date());

    const { token } = useContext(UserContext)

    const [lista, setLista] = useState([])

    const [flag, setFlag] = useState(true)

    useEffect(() => {
      
        fetch('https://retentencionesnmisiones.herokuapp.com/v1/retenciones/providers', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        .then(res => res.json())
        .then(res=> {

            setLista( res.map( proveedor => {
                return { id: proveedor.id, nombre: proveedor.companyName }
            }) )
            setFlag(false)

        }).catch( err =>{
            alert( "Nose pudo cargar los proveedores..." )
        })
        
    }, [])
    
    const guardarFactura = () =>{

        let valor = {
            "pointSale": document.querySelector("input[valueName='Punto de venta:']").value ,
            "number": document.querySelector("input[valueName='Número:']").value,
            "provider":null,
            "engraved": document.querySelector("input[valueName='Grabado:']").value,
            "exempt": document.querySelector("input[valueName='Exento:']").value,
            "iva105": document.querySelector("input[valueName='Iva 105:']").value,
            "iva21": document.querySelector("input[valueName='Iva 21:']").value ,
            "iibb": document.querySelector("input[valueName='IIBB:']").value,
            "taxedOthers": document.querySelector("input[valueName='Otros impuestos:']").value ,
            "municipality": document.querySelector("input[valueName='Municipalidad:']").value,
            "impacted": false,
            "date": "2022-01-30"
        }

        fetch('https://retentencionesnmisiones.herokuapp.com/v1/retenciones/invoice', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(valor)
        })
        .then(res => res.json())
        .then(res=> {

            if( res.errors ){
                alert( "Formato de EMAIL no valido..." )
                setFlag( false )
                document.querySelector(".boton_iniciar_sesion").style.pointerEvents = "all"
                document.querySelector(".boton_iniciar_sesion").style.opacity = "1"
                return
            }

            
            props.setpagina("menu_seleccion")

        }).catch( err =>{
            alert( "Usuario o contraseña invalidos..." )
            document.querySelector(".boton_iniciar_sesion").style.pointerEvents = "all"
            document.querySelector(".boton_iniciar_sesion").style.opacity = "1"
            setFlag( false )
        })

    }

    return (
        
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>

            {
                flag ?
                <Loading estilo={ { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" } } ancho={ "150" } />
                :
                <div className='caja_principal'>
                    <div className='titulo'> Factura </div>
                    
                    <div className="contenido">
                        <div className="nueva_factura">
                            <InputBuscador style={ {marginLeft: "5px"} } nombre={ "Proveedor:" } lista={ lista } />
                            <div className="input_fecha">
                                <div className="label_fecha" style={{ marginLeft: "5px", color: "gray" }} > Fecha: </div>
                                <KeyboardDatePicker
                                    autoOk
                                    variant="inline"
                                    inputVariant="outlined"
                                    label=""
                                    format="dd/MM/yyyy"
                                    value={selectedDateFactura}
                                    InputAdornmentProps={{ position: "start",  borderRadius: "10px" }}
                                    onChange={date => handleDateChangeFactura(date)}
                                    InputProps={ {style: { fontSize: "14px", borderRadius: "5px", height: "34px", marginLeft: "5px" }} }
                                    InputLabelProps={{ style: { fontSize: "14px" } }}
                                />
                            </div>
                            <div className='divisoria'>
                                <InputConLabelArriba nombre={"Punto de venta:"} style={ {marginLeft: "5px"} } />
                                <InputConLabelArriba nombre={"Número:"} style={ {marginLeft: "5px"} } />
                            </div>
                            <InputConLabelArriba nombre={"Grabado:"} style={ {marginLeft: "5px"} } tipo={ "number" } />
                            <InputConLabelArriba nombre={"Exento:"} style={ {marginLeft: "5px"} } tipo={ "number" } />
                            <InputConLabelArriba nombre={"Iva 105:"} style={ {marginLeft: "5px"} } tipo={ "number" } />
                            <InputConLabelArriba nombre={"Iva 21:"} style={ {marginLeft: "5px"} } tipo={ "number" } />
                            <InputConLabelArriba nombre={"IIBB:"} style={ {marginLeft: "5px"} } tipo={ "number" } />
                            <InputConLabelArriba nombre={"Otros impuestos:"} style={ {marginLeft: "5px"} } tipo={ "number" } />
                            <InputConLabelArriba nombre={"Municipalidad:"} style={ {marginLeft: "5px"} } tipo={ "number" } />
                            <div className="contenedor_ultimo">
                                <div className='ultima_caja'>
                                    <InputConLabelArriba nombre={"Impacto:"} style={ {marginLeft: "5px"} } tipo={ "number" } />
                                    <InputConLabelArriba nombre={"Total:"} style={ {marginLeft: "5px"} } tipo={ "number" } />
                                </div>
                                <div className="caja_guardar">
                                    <div className="boton_guardar" onClick={ guardarFactura } >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c-35.2 0-64 28.8-64 64c0 35.2 28.8 64 64 64c35.2 0 64-28.8 64-64C288 284.8 259.2 256 224 256zM433.1 129.1l-83.9-83.9C341.1 37.06 328.8 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 151.2 442.9 138.9 433.1 129.1zM128 80h144V160H128V80zM400 416c0 8.836-7.164 16-16 16H64c-8.836 0-16-7.164-16-16V96c0-8.838 7.164-16 16-16h16v104c0 13.25 10.75 24 24 24h192C309.3 208 320 197.3 320 184V83.88l78.25 78.25C399.4 163.2 400 164.8 400 166.3V416z"/></svg>
                                    </div>
                                    <div className='titulo'> Guardar </div>
                                </div>
                            </div>
                        </div>
                        <div className="busqueda_factura">
                            <div className="titulo"> Búsqueda </div>
                            <div className="criterio_busqueda">
                                <div className='rango_fecha'>
                                    <div className="desde">
                                        <div className="titulo_desde"> Desde: </div>
                                        <KeyboardDatePicker
                                            autoOk
                                            variant="inline"
                                            inputVariant="outlined"
                                            label=""
                                            format="dd/MM/yyyy"
                                            value={selectedDateDesde}
                                            InputAdornmentProps={{ position: "start" }}
                                            onChange={date => handleDateChangeDesde(date)}
                                            InputProps={ {style: { height: "34px", padding: 0 }} }
                                        />
                                    </div>
                                    <div className="hasta">
                                        <div className="titulo_hasta"> Hasta: </div>
                                        <KeyboardDatePicker
                                            autoOk
                                            variant="inline"
                                            inputVariant="outlined"
                                            label=""
                                            format="dd/MM/yyyy"
                                            value={selectedDateHasta}
                                            InputAdornmentProps={{ position: "start" }}
                                            onChange={date => handleDateChangeHasta(date)}
                                            InputProps={ {style: { height: "34px", padding: 0 }} }
                                        />
                                    </div>

                                </div>
                                <InputBuscador style={ {marginLeft: "5px"} } nombre={ "Proveedor:" } lista={ lista } />
                                <InputConLabelArriba nombre={"CUIT:"} style={ {marginLeft: "5px"} } />
                                <InputConLabelArriba nombre={"Teléfono:"} style={ {marginLeft: "5px"} } />
                                <div className="boton_buscador">
                                    <div className="titulo_buscador"> Buscar </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"/></svg>
                                </div>
                            </div>
                            <div className="caja_tabla">
                                <Tabla/>
                            </div>
                            <div className="botones_footer">
                                <div className="boton guardar">
                                    <div className="contenedor">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c-35.2 0-64 28.8-64 64c0 35.2 28.8 64 64 64c35.2 0 64-28.8 64-64C288 284.8 259.2 256 224 256zM433.1 129.1l-83.9-83.9C341.1 37.06 328.8 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 151.2 442.9 138.9 433.1 129.1zM128 80h144V160H128V80zM400 416c0 8.836-7.164 16-16 16H64c-8.836 0-16-7.164-16-16V96c0-8.838 7.164-16 16-16h16v104c0 13.25 10.75 24 24 24h192C309.3 208 320 197.3 320 184V83.88l78.25 78.25C399.4 163.2 400 164.8 400 166.3V416z"/></svg>
                                    </div>
                                    <div className="footer_titulo"> Guardar </div>
                                </div>
                                <div className="boton borrar">
                                    <div className="contenedor">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z"/></svg>
                                    </div>
                                    <div className="footer_titulo"> Borrar </div>
                                </div>
                                <div className="boton editar">
                                    <div className="contenedor">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M373.1 24.97C401.2-3.147 446.8-3.147 474.9 24.97L487 37.09C515.1 65.21 515.1 110.8 487 138.9L289.8 336.2C281.1 344.8 270.4 351.1 258.6 354.5L158.6 383.1C150.2 385.5 141.2 383.1 135 376.1C128.9 370.8 126.5 361.8 128.9 353.4L157.5 253.4C160.9 241.6 167.2 230.9 175.8 222.2L373.1 24.97zM440.1 58.91C431.6 49.54 416.4 49.54 407 58.91L377.9 88L424 134.1L453.1 104.1C462.5 95.6 462.5 80.4 453.1 71.03L440.1 58.91zM203.7 266.6L186.9 325.1L245.4 308.3C249.4 307.2 252.9 305.1 255.8 302.2L390.1 168L344 121.9L209.8 256.2C206.9 259.1 204.8 262.6 203.7 266.6zM200 64C213.3 64 224 74.75 224 88C224 101.3 213.3 112 200 112H88C65.91 112 48 129.9 48 152V424C48 446.1 65.91 464 88 464H360C382.1 464 400 446.1 400 424V312C400 298.7 410.7 288 424 288C437.3 288 448 298.7 448 312V424C448 472.6 408.6 512 360 512H88C39.4 512 0 472.6 0 424V152C0 103.4 39.4 64 88 64H200z"/></svg>
                                    </div>
                                    <div className="footer_titulo"> Editar </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="boton_volver" onClick={ () => props.setpagina("menu_seleccion") }> Volver <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 256c0 123.4-100.5 223.9-223.9 223.9c-48.86 0-95.19-15.58-134.2-44.86c-14.14-10.59-17-30.66-6.391-44.81c10.61-14.09 30.69-16.97 44.8-6.375c27.84 20.91 61 31.94 95.89 31.94C344.3 415.8 416 344.1 416 256s-71.67-159.8-159.8-159.8C205.9 96.22 158.6 120.3 128.6 160H192c17.67 0 32 14.31 32 32S209.7 224 192 224H48c-17.67 0-32-14.31-32-32V48c0-17.69 14.33-32 32-32s32 14.31 32 32v70.23C122.1 64.58 186.1 32.11 256.1 32.11C379.5 32.11 480 132.6 480 256z"/></svg> </div>
                </div>
            }

             
        </MuiPickersUtilsProvider>
      
    )
}
