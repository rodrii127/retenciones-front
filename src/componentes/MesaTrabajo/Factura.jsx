import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import esLocale from 'date-fns/locale/es';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { types } from '../../types/types';
import { formatDate } from '../../utils/DateUtils';
import { getCompanyName } from '../../utils/TokenUtils';
import { invoiceUri, providerUri } from '../../utils/UrlUtils';
import { errorAlert, mensajeArriba, procesoExitoso } from '../Alerts/SweetAlert';
import { UserContext } from '../Contexto/UserContext';
import { BotonVolver } from '../OtrosComponentes/BotonVolver';
import { InputBuscador } from '../OtrosComponentes/InputBuscador';
import { InputConLabelArriba } from '../OtrosComponentes/InputConLabelArriba';
import { Loading } from '../OtrosComponentes/Loading';
import { Tabla } from '../OtrosComponentes/Tabla';
import Ant_Form_Factura from './ADFactura/Ant_Form_Factura';
import "./mainView.scss";

export const Factura = (props) => {

    const [selectedDateFactura, handleDateChangeFactura] = useState(new Date());

    const [selectedDateDesde, handleDateChangeDesde] = useState(new Date());

    const [selectedDateHasta, handleDateChangeHasta] = useState(new Date());

    const { user } = useContext(UserContext)

    const [lista, setLista] = useState([])

    const [listaBuscada, setListaBuscada] = useState([])

    const [flag, setFlag] = useState(true)

    const [flagFactura, setFlagFactura] = useState(false)

    const [flagBusqueda, setFlagBusqueda] = useState(false)

    const { dispatch } = useContext(UserContext)

    const navigate = useNavigate();

    let isEventListenerNotAdded = true;

    useEffect(() => {
        fetch(providerUri, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + user.token,
            }
        }).then(res => {
            if (res.status >= 400) {
                if (res.status === 401) {
                    dispatch({ type: types.logout })
                    errorAlert('Se venció la sesión actual.')
                    navigate('/login', { replace: true })
                }
                else if (res.status === 404) {
                    errorAlert('No existen proveedores creados.')
                    navigate('/proveedor')
                }
            }
            return res.json()
        }).then(res => {
            setLista(res.map(proveedor => {
                return { id: proveedor.id, nombre: proveedor.companyName }
            }))
            setFlag(false)
        }).catch(err => {
            console.log(err)
        })

        return () => {
            /* document.querySelector("input[valueName='Grabado(*):']").removeEventListener("input", onEngravedChange); */
        }
    }, [])

    const getParameters = () => {
        return {
            startDate: formatDate(selectedDateDesde),
            endDate: formatDate(selectedDateHasta),
            impacted: document.querySelector('.checkboxImpacted input').checked
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
            invoiceUriWithParams = invoiceUriWithParams.concat(providerParam).concat(providerId);
        }
        return invoiceUriWithParams;
    }

    const onEngravedChange = (e) => {
        if (isEventListenerNotAdded) {
            isEventListenerNotAdded = false;
            document.querySelector("input[valueName='Grabado(*):']").addEventListener("input", function (e) {
                onMunicipalityCheck()
                onIibbCheck()
            })
            document.querySelector("input[valueName='Punto de venta(*):']").addEventListener("input", function (e) {
                calculateTotal()
            })
            document.querySelector("input[valueName='Número(*):']").addEventListener("input", function (e) {
                calculateTotal()
            })
            document.querySelector("input[valueName='Exento:']").addEventListener("input", function (e) {
                calculateTotal()
            })
            document.querySelector("input[valueName='Iva 105:']").addEventListener("input", function (e) {
                calculateTotal()
            })
            document.querySelector("input[valueName='Iva 21:']").addEventListener("input", function (e) {
                calculateTotal()
            })
            document.querySelector("input[valueName='IIBB:']").addEventListener("input", function (e) {
                calculateTotal()
            })
            document.querySelector("input[valueName='Otros impuestos:']").addEventListener("input", function (e) {
                calculateTotal()
            })
            document.querySelector("input[valueName='Municipalidad:']").addEventListener("input", function (e) {
                calculateTotal()
            })
        }
    }

    const onMunicipalityCheck = () => {
        const engraved = document.querySelector("input[valueName='Grabado(*):']").value;
        // Get the checkbox
        var checkBox = document.getElementById("municipalityCheckbox");

        // If the checkbox is checked, display the output text
        if (checkBox.checked) {
            document.querySelector("input[valueName='Municipalidad:']").setAttribute('value', Number(0.008 * engraved).toFixed(2))
            document.querySelector("input[valueName='Municipalidad:']").value = Number(Number(0.008 * engraved).toFixed(2))
        } else {
            document.querySelector("input[valueName='Municipalidad:']").setAttribute('value', 0)
            document.querySelector("input[valueName='Municipalidad:']").value = Number(0)
        }
        calculateTotal()
    }

    const onIibbCheck = () => {
        const engraved = document.querySelector("input[valueName='Grabado(*):']").value;
        // Get the checkbox
        var checkBox = document.getElementById("iibbCheckbox");

        // If the checkbox is checked, display the output text
        if (checkBox.checked) {
            document.querySelector("input[valueName='IIBB:']").setAttribute('value', Number(0.0331 * engraved).toFixed(2))
            document.querySelector("input[valueName='IIBB:']").value = Number(Number(0.0331 * engraved).toFixed(2))
        } else {
            document.querySelector("input[valueName='IIBB:']").setAttribute('value', 0)
            document.querySelector("input[valueName='IIBB:']").value = Number(0)
        }
        calculateTotal()
    }

    const calculateTotal = () => {
        const total =
            Number(document.querySelector("input[valueName='Grabado(*):']").value) +
            Number(document.querySelector("input[valueName='Exento:']").value) +
            Number(document.querySelector("input[valueName='Iva 105:']").value) +
            Number(document.querySelector("input[valueName='Iva 21:']").value) +
            Number(document.querySelector("input[valueName='IIBB:']").value) +
            Number(document.querySelector("input[valueName='Otros impuestos:']").value) +
            Number(document.querySelector("input[valueName='Municipalidad:']").value)


        document.querySelector("input[valueName='Total:']").setAttribute('value', total)
        document.querySelector("input[valueName='Total:']").value = Number(total)
    }

    const guardarFactura = () => {
        let valor = {
            "pointSale": document.querySelector("input[valueName='Punto de venta(*):']").value,
            "number": document.querySelector("input[valueName='Número(*):']").value,
            "provider": document.querySelector('.nueva_factura .input_buscador .caja_contenedor input').getAttribute('valueId'),
            "engraved": document.querySelector("input[valueName='Grabado(*):']").value,
            "exempt": document.querySelector("input[valueName='Exento:']").value === "" ? 0 : document.querySelector("input[valueName='Exento:']").value,
            "iva105": document.querySelector("input[valueName='Iva 105:']").value === "" ? 0 : document.querySelector("input[valueName='Iva 105:']").value,
            "iva21": document.querySelector("input[valueName='Iva 21:']").value === "" ? 0 : document.querySelector("input[valueName='Iva 21:']").value,
            "iibb": document.querySelector("input[valueName='IIBB:']").value === "" ? 0 : document.querySelector("input[valueName='IIBB:']").value,
            "taxedOthers": document.querySelector("input[valueName='Otros impuestos:']").value === "" ? 0 : document.querySelector("input[valueName='Otros impuestos:']").value,
            "municipality": document.querySelector("input[valueName='Municipalidad:']").value === "" ? 0 : document.querySelector("input[valueName='Municipalidad:']").value,
            "impacted": false,
            "date": document.querySelector(".input_fecha input").value
        }

        if ((valor.pointSale == 0 || valor.pointSale == "") || (valor.number == 0 || valor.number == "") || (valor.provider == 0 || valor.provider == "") || (valor.date == "") || (valor.engraved == 0 || valor.engraved == "")) {
            errorAlert('Por favor, complete los campos obligatorios (*)')
            return
        }

        if (valor.pointSale.length > 5) {
            errorAlert('El punto de venta no puede contener mas de 5 dígitos...')
            return
        }

        if (valor.number.length > 8) {
            errorAlert('El número de factura no puede contener mas de 8 dígitos...')
            return
        }

        document.querySelector(".caja_guardar").style.pointerEvents = "none"
        document.querySelector(".caja_guardar").style.opacity = "0.7"

        setFlagFactura(true)

        fetch(invoiceUri, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(valor)
        })
            .then(res => res.json())
            .then(res => {
                setFlagFactura(false)
                document.querySelector(".caja_guardar").style.pointerEvents = "all"
                document.querySelector(".caja_guardar").style.opacity = "1"

                if (res.error) {
                    if (res.status === 400) {
                        errorAlert('FACTURA DUPLICADA.')
                        return
                    }
                }

                document.querySelectorAll(".nueva_factura input").forEach(e => {
                    if (!e.type.includes("text")) {
                        e.value = 0
                    }
                })

                procesoExitoso()
            }).catch(err => {
                errorAlert('Ups, ocurrió un error inesperado...')
                document.querySelector(".caja_guardar").style.pointerEvents = "all"
                document.querySelector(".caja_guardar").style.opacity = "1"
                setFlagFactura(false)
            })

    }

    const buscarFactura = () => {
        setFlagBusqueda(true)

        fetch(getInvoiceUri(getParameters()), {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
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

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
            {
                flag ?
                    <Loading estilo={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }} ancho={"150"} />
                    :
                    <div className='caja_principal' onClick={onEngravedChange}>
                        <div className='titulo' style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <div>Factura</div>
                            <div> {getCompanyName(user.token)} </div>
                            <div></div>
                        </div>

                        <div className="contenido">
                            <div className="nueva_factura">

                                <Ant_Form_Factura
                                    flagFactura={ flagFactura }
                                    setFlagFactura={ setFlagFactura }
                                ></Ant_Form_Factura>

                                {/* <InputBuscador style={{ marginLeft: "5px" }} nombre={"Proveedor(*):"} lista={lista} />
                                <div className="input_fecha">
                                    <div className="label_fecha" style={{ marginLeft: "5px", color: "gray" }} > Fecha(*): </div>
                                    <KeyboardDatePicker
                                        autoOk
                                        variant="inline"
                                        inputVariant="outlined"
                                        label=""
                                        format="yyyy-MM-dd"
                                        value={selectedDateFactura}
                                        InputAdornmentProps={{ position: "start", borderRadius: "10px" }}
                                        onChange={date => handleDateChangeFactura(date)}
                                        InputProps={{ style: { fontSize: "14px", borderRadius: "5px", height: "34px", marginLeft: "5px" } }}
                                        InputLabelProps={{ style: { fontSize: "14px" } }}
                                    />
                                </div>
                                <div className='divisoria'>
                                    <InputConLabelArriba nombre={"Punto de venta(*):"} tipo={"number"} style={{ marginLeft: "5px" }} />
                                    <InputConLabelArriba nombre={"Número(*):"} tipo={"number"} style={{ marginLeft: "5px" }} />
                                </div>
                                <InputConLabelArriba nombre={"Grabado(*):"} style={{ marginLeft: "5px" }} tipo={"number"} />
                                <InputConLabelArriba nombre={"Exento:"} style={{ marginLeft: "5px" }} tipo={"number"} />
                                <InputConLabelArriba nombre={"Iva 105:"} style={{ marginLeft: "5px" }} tipo={"number"} />
                                <InputConLabelArriba nombre={"Iva 21:"} style={{ marginLeft: "5px" }} tipo={"number"} />
                                <div style={{ display: 'flex', flexDirection: "row" }}>
                                    <InputConLabelArriba nombre={"IIBB:"} style={{ marginLeft: "5px" }} tipo={"number"} deshabilitado={"disabled"} />
                                    <input id='iibbCheckbox' style={{ margin: 'auto', transform: "scale(2)" }} type="checkbox" onClick={onIibbCheck} />
                                </div>
                                <InputConLabelArriba nombre={"Otros impuestos:"} style={{ marginLeft: "5px" }} tipo={"number"} />
                                <div style={{ display: 'flex', flexDirection: "row" }}>
                                    <InputConLabelArriba nombre={"Municipalidad:"} style={{ marginLeft: "5px" }} tipo={"number"} deshabilitado={"disabled"} />
                                    <input id='municipalityCheckbox' style={{ margin: 'auto', transform: "scale(2)" }} type="checkbox" onClick={onMunicipalityCheck} />
                                </div>
                                <div className="contenedor_ultimo">
                                    <div className='ultima_caja'>
                                        <InputConLabelArriba nombre={"Total:"} style={{ marginLeft: "5px" }} tipo={"number"} deshabilitado={"disabled"} />
                                    </div>
                                    <div className="caja_guardar">
                                        <div className="boton_guardar" onClick={guardarFactura} >
                                            {
                                                flagFactura ?
                                                    <Loading estilo={{ display: "flex", justifyContent: "center", alignItems: "center" }} ancho={"150"} />
                                                    :
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c-35.2 0-64 28.8-64 64c0 35.2 28.8 64 64 64c35.2 0 64-28.8 64-64C288 284.8 259.2 256 224 256zM433.1 129.1l-83.9-83.9C341.1 37.06 328.8 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 151.2 442.9 138.9 433.1 129.1zM128 80h144V160H128V80zM400 416c0 8.836-7.164 16-16 16H64c-8.836 0-16-7.164-16-16V96c0-8.838 7.164-16 16-16h16v104c0 13.25 10.75 24 24 24h192C309.3 208 320 197.3 320 184V83.88l78.25 78.25C399.4 163.2 400 164.8 400 166.3V416z" /></svg>
                                            }
                                        </div>
                                        <div className='titulo'> Guardar </div>
                                    </div>
                                </div> */}
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
                                    </div>
                                    <InputBuscador style={{ marginLeft: "5px" }} nombre={"Proveedor:"} lista={lista} />
                                    <div className='checkboxImpacted'>
                                        <p>Impactado:</p>
                                        <input type="checkbox" />
                                    </div>
                                    <div className="boton_buscador" onClick={buscarFactura} >
                                        <div className="titulo_buscador"> Buscar </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z" /></svg>
                                    </div>
                                </div>
                                <div className="caja_tabla">
                                    {
                                        flagBusqueda ?
                                            <Loading estilo={{ display: "flex", justifyContent: "center", alignItems: "center" }} ancho={"150"} />
                                            :
                                            <Tabla listaBuscada={listaBuscada} />
                                    }
                                </div>
                                
                            </div>
                        </div>
                        {/* <BotonVolver /> */}
                    </div>
            }


        </MuiPickersUtilsProvider>

    )
}
