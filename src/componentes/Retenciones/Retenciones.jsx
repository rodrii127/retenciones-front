import React, { useContext, useEffect, useState } from 'react'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment'
import "./retenciones.scss"

import DateFnsUtils from '@date-io/date-fns';

import { KeyboardDatePicker } from "@material-ui/pickers";

import esLocale from 'date-fns/locale/es'
import { InputBuscador } from '../OtrosComponentes/InputBuscador';
import { InputConLabelArriba } from '../OtrosComponentes/InputConLabelArriba';
import { Tabla } from '../OtrosComponentes/Tabla';

import { UserContext } from '../Contexto/UserContext'
import { Loading } from '../OtrosComponentes/Loading';
import { TablaConCheck } from '../OtrosComponentes/TablaConCheck';
import { errorAlert, mensajeArriba, procesoErroneo, procesoExitoso } from '../Alerts/SweetAlert';
import { payOrderUri, providerUri } from '../../utils/UrlUtils';

export const Retenciones = (props) => {

    const [selectedDateDesde, handleDateChangeDesde] = useState(new Date());

    const [selectedDateHasta, handleDateChangeHasta] = useState(new Date());

    const [selectedDateOrdenDePago, handleDateChangeOrdenPago] = useState(new Date());

    const { token } = useContext(UserContext)

    const [lista, setLista] = useState([])

    const [selectedCheckboxItems, setSelectedCheckboxItems] = useState([])

    const [flag, setFlag] = useState(true)

    const [listaBuscada, setListaBuscada] = useState([])

    const [flagBusqueda, setFlagBusqueda] = useState(false)

    useEffect(() => {
        fetch(providerUri, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(res => {

                setLista(res.map(proveedor => {
                    return { id: proveedor.id, nombre: proveedor.companyName }
                }))
                setFlag(false)

            }).catch(err => {
                alert("Nose pudo cargar los proveedores...")
            })
    }, [])

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    }

    const getParameters = () => {
        return {
            startDate: formatDate(selectedDateDesde),
            endDate: formatDate(selectedDateHasta),
            impacted: false
        }
    }

    const getInvoiceUri = (parameters) => {
        const providerParam = '&idProvider=';
        const providerName = document.querySelector('.busqueda_factura .criterio_busqueda .input_buscador .caja_contenedor input').value;
        const providerId = document.querySelector('.busqueda_factura .criterio_busqueda .input_buscador .caja_contenedor input').getAttribute('valueId');

        let invoiceUriWithParams = invoiceUri.concat('?startDate=')
            .concat(parameters.startDate)
            .concat('&endDate=')
            .concat(parameters.endDate)
            .concat('&impacted=')
            .concat(parameters.impacted)

        if (providerName) {
            console.log('no es null')
            invoiceUriWithParams = invoiceUriWithParams.concat(providerParam).concat(providerId);
        }
        return invoiceUriWithParams;
    }

    const findPayOrder = () => {
        setFlagBusqueda(true)

        fetch(getInvoiceUri(getParameters()), {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.length === 0) {
                    mensajeArriba("info", "No hay facturas en esas fechas...")
                } else {
                    mensajeArriba("success", "Facturas encontradas!")
                }
                setListaBuscada(res)
                setFlagBusqueda(false)

            }).catch(err => {
                console.log(err)
                mensajeArriba("error", "Ocurrió un error en la busqueda...")
                setFlagBusqueda(false)
            })
    }

    const createPayOrder = () => {
        fetch(payOrderUri, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                idInvoices: selectedCheckboxItems.map((elemento) => { return elemento.id }),
                startDate: formatDate(selectedDateOrdenDePago)
            })
        })
            .then(res => res.json())
            .then(res => {
                mensajeArriba("success", "Orden de Pago creada con éxito")

                createPayOrderPDF(res.id)

                setFlagBusqueda(false)

            }).catch(err => {
                console.log(err)
                mensajeArriba("error", "Ocurrió un error en la busqueda...")
                setFlagBusqueda(false)
            })
    }

    const createPayOrderPDF = (id) => {
        fetch(payOrderUri.concat('/payOrderPdf/').concat(id), {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => response.blob())
            .then(blob => {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = "orden-pago.pdf";
                document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                a.click();
                a.remove();
                mensajeArriba("success", "Descargado con éxito")
                setFlagBusqueda(false)

            }).catch(err => {
                console.log(err)
                mensajeArriba("error", "Ocurrió un error en la busqueda...")
                setFlagBusqueda(false)
            })
    }

    return (
        <div className="retenciones">
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                {
                    flag ?
                        <Loading estilo={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }} ancho={"150"} />
                        :
                        <div className="busqueda_factura">
                            <div className="titulo"> Generar Orden de Pago: </div>
                            <div className="contenido">
                                <div className="criterio_busqueda">
                                    <div className='rango_fecha'>
                                        <div className="desde">
                                            <div className="titulo_desde"> Desde: </div>
                                            <KeyboardDatePicker
                                                autoOk
                                                variant="inline"
                                                inputVariant="outlined"
                                                label=""
                                                format="yyyy-MM-dd"
                                                value={selectedDateDesde}
                                                InputAdornmentProps={{ position: "start" }}
                                                onChange={date => handleDateChangeDesde(date)}
                                                InputProps={{ style: { height: "34px", padding: 0 } }}
                                            />
                                        </div>
                                        <div className="hasta">
                                            <div className="titulo_hasta"> Hasta: </div>
                                            <KeyboardDatePicker
                                                autoOk
                                                variant="inline"
                                                inputVariant="outlined"
                                                label=""
                                                format="yyyy-MM-dd"
                                                value={selectedDateHasta}
                                                InputAdornmentProps={{ position: "start" }}
                                                onChange={date => handleDateChangeHasta(date)}
                                                InputProps={{ style: { height: "34px", padding: 0 } }}
                                            />
                                        </div>
                                        <div className="fecha_orden_pago">
                                            <div className="titulo_desde"> Fecha Orden: </div>
                                            <KeyboardDatePicker
                                                autoOk
                                                variant="inline"
                                                inputVariant="outlined"
                                                label=""
                                                format="yyyy-MM-dd"
                                                value={selectedDateOrdenDePago}
                                                InputAdornmentProps={{ position: "start" }}
                                                onChange={date => handleDateChangeOrdenPago(date)}
                                                InputProps={{ style: { height: "34px", padding: 0 } }}
                                            />
                                        </div>

                                    </div>
                                    <InputBuscador style={{ marginLeft: "5px" }} nombre={"Proveedor:"} lista={lista} />
                                    <div className="boton_buscador">
                                        <div className="titulo_buscador" onClick={findPayOrder}> Buscar </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z" /></svg>
                                    </div>
                                </div>
                                <div className="caja_tabla">
                                    {
                                        flagBusqueda ?
                                            <Loading estilo={{ display: "flex", justifyContent: "center", alignItems: "center" }} ancho={"150"} />
                                            :
                                            <TablaConCheck listaBuscada={listaBuscada} selectedCheckboxItems={selectedCheckboxItems} setSelectedCheckboxItems={setSelectedCheckboxItems} />
                                    }
                                </div>
                                <div className="botones_footer">
                                    <div className="boton descargar">
                                        <div className="contenedor">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M144 480C64.47 480 0 415.5 0 336C0 273.2 40.17 219.8 96.2 200.1C96.07 197.4 96 194.7 96 192C96 103.6 167.6 32 256 32C315.3 32 367 64.25 394.7 112.2C409.9 101.1 428.3 96 448 96C501 96 544 138.1 544 192C544 204.2 541.7 215.8 537.6 226.6C596 238.4 640 290.1 640 352C640 422.7 582.7 480 512 480H144zM303 392.1C312.4 402.3 327.6 402.3 336.1 392.1L416.1 312.1C426.3 303.6 426.3 288.4 416.1 279C407.6 269.7 392.4 269.7 383 279L344 318.1V184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184V318.1L256.1 279C247.6 269.7 232.4 269.7 223 279C213.7 288.4 213.7 303.6 223 312.1L303 392.1z" /></svg>
                                        </div>
                                        <div className="footer_titulo" onClick={createPayOrder}>Generar Orden de Pago</div>
                                    </div>
                                </div>
                            </div>
                            <div className="boton_volver" onClick={() => props.setpagina("menu_seleccion")}> Volver <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 256c0 123.4-100.5 223.9-223.9 223.9c-48.86 0-95.19-15.58-134.2-44.86c-14.14-10.59-17-30.66-6.391-44.81c10.61-14.09 30.69-16.97 44.8-6.375c27.84 20.91 61 31.94 95.89 31.94C344.3 415.8 416 344.1 416 256s-71.67-159.8-159.8-159.8C205.9 96.22 158.6 120.3 128.6 160H192c17.67 0 32 14.31 32 32S209.7 224 192 224H48c-17.67 0-32-14.31-32-32V48c0-17.69 14.33-32 32-32s32 14.31 32 32v70.23C122.1 64.58 186.1 32.11 256.1 32.11C379.5 32.11 480 132.6 480 256z" /></svg> </div>
                        </div>
                }

            </MuiPickersUtilsProvider>

        </div>
    )
}
