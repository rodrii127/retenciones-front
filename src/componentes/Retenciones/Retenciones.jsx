import React, { useContext, useEffect, useState } from 'react'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

import { KeyboardDatePicker } from "@material-ui/pickers";

import esLocale from 'date-fns/locale/es'
import { InputBuscador } from '../OtrosComponentes/InputBuscador';
import { TablaRetenciones } from '../OtrosComponentes/TablaRetenciones';

import { Loading } from '../OtrosComponentes/Loading';
import { BotonVolver } from '../OtrosComponentes/BotonVolver';
import { retentionMunicipalityCsvUri, retentionTypeUri, retentionUri } from '../../utils/UrlUtils';
import { types } from '../../types/types';
import { errorAlert, mensajeArriba } from '../Alerts/SweetAlert';
import { UserContext } from '../Contexto/UserContext';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/DateUtils';
import { getCompanyName } from '../../utils/TokenUtils';
import { PageHeader } from 'antd';
import { SearchOutlined, DeliveredProcedureOutlined  } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

export const Retenciones = () => {

    const { user, dispatch } = useContext(UserContext)

    const navigate = useNavigate();

    const [flag, setFlag] = useState(true)

    const [flagBusqueda, setFlagBusqueda] = useState(false)

    const [retentionTypeList, setRetentionTypeList] = useState([])

    const [selectedDateDesde, handleDateChangeDesde] = useState(new Date());

    const [selectedDateHasta, handleDateChangeHasta] = useState(new Date());

    const [retentionList, setRetentionList] = useState([])

    useEffect(() => {
        fetch(retentionTypeUri, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + user.token,
            }
        }).then(res => {
            if (res.status >= 400) {
                if (res.status === 401) {
                    dispatch({ type: types.logout })
                    errorAlert('Se venci?? la sesi??n actual.')
                    navigate('/login', { replace: true })
                }
                else if (res.status === 404) {
                    errorAlert('No existen tipos de retenciones creados.')
                    navigate('/')
                }
            }
            return res.json()
        }).then(res => {
            setRetentionTypeList(res.map(retentionType => {
                return { id: retentionType.id, nombre: retentionType.description }
            }))
            setFlag(false)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const getParameters = () => {
        return {
            startDate: formatDate(selectedDateDesde),
            endDate: formatDate(selectedDateHasta),
            idRetentionType: document.querySelector('.input_buscador .caja_contenedor input').getAttribute('valueId')
        }
    }

    const getRetentionUri = (url) => {
        const parameters = getParameters();
        if (!parameters.idRetentionType) {
            return '';
        }
        return url.concat('?startDate=')
            .concat(parameters.startDate)
            .concat('&endDate=')
            .concat(parameters.endDate)
            .concat('&idRetentionType=')
            .concat(parameters.idRetentionType)
    }

    const findRetentions = () => {
        setFlagBusqueda(true)

        const retentionUriWithParams = getRetentionUri(retentionUri)
        if (!retentionUriWithParams) {
            errorAlert('Por favor, seleccione un tipo de retenci??n.')
            setFlagBusqueda(false)
            return
        }

        fetch(retentionUriWithParams, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + user.token,
            }
        }).then(res => {
            if (res.status >= 400) {
                if (res.status === 401) {
                    dispatch({ type: types.logout })
                    errorAlert('Se venci?? la sesi??n actual.')
                    navigate('/login', { replace: true })
                }
                else if (res.status === 404) {
                    errorAlert('No existen retenciones creadas.')
                }
            }
            return res.json()
        }).then(res => {
            setRetentionList(res.map(retention => {
                return {
                    date: retention.date,
                    provider: retention.provider,
                    number: retention.number,
                    retentionAmount: retention.retentionAmount
                }
            }))
            setFlag(false)
        }).catch(err => {
            console.log(err)
        })
        setFlagBusqueda(false)
    }

    const getRetentionCsv = () => {
        setFlag(true)

        if (!retentionList.length) {
            errorAlert('Por favor, busque las retenciones.')
            setFlag(false)
            return
        }

        fetch(getRetentionUri(retentionMunicipalityCsvUri), {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: 'Bearer ' + user.token,
            }
        }).then((response) => response.blob()
        ).then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "retenciones.txt";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();
            mensajeArriba("success", "Descargado con ??xito")
            setRetentionList([])
            setFlag(false)
        }).catch(err => {
            console.log(err)
            setRetentionList([])
            setFlag(false)
        })
    }

    return (
        <div className="retenciones">
           <div>
           <PageHeader
                className="site-page-header"
                onBack={() => null}
                title="Retenciones"
                subTitle="Generar informe"
            />
           
            

            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                {
                    flag ?
                        <Loading estilo={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }} ancho={"150"} />
                        :
                        <div className="busqueda_factura">
                            <div className='titulo' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                {/*<div>Generar Informe de Retenciones:</div>*/}
                                <div> {getCompanyName(user.token)} </div>
                                <div></div>
                            </div>
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

                                    </div>
                                    
                                    <InputBuscador style={{ marginLeft: "5px" }} nombre={"Tipo retenci??n:"} lista={retentionTypeList} />
                                    <Button type="primary" icon={<SearchOutlined />} size="large" onClick={findRetentions}>
                                                Buscar
                                            </Button>
                                    
                                </div>
                                <div className="caja_tabla">
                                    {
                                        flagBusqueda ?
                                            <Loading estilo={{ display: "flex", justifyContent: "center", alignItems: "center" }} ancho={"150"} />
                                            :
                                            <TablaRetenciones listaBuscada={retentionList} />
                                    }
                                </div>
                                <div className="botones_footer">
                                    <div className="boton descargar" onClick={getRetentionCsv}>
                                        <div className="contenedor">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M144 480C64.47 480 0 415.5 0 336C0 273.2 40.17 219.8 96.2 200.1C96.07 197.4 96 194.7 96 192C96 103.6 167.6 32 256 32C315.3 32 367 64.25 394.7 112.2C409.9 101.1 428.3 96 448 96C501 96 544 138.1 544 192C544 204.2 541.7 215.8 537.6 226.6C596 238.4 640 290.1 640 352C640 422.7 582.7 480 512 480H144zM303 392.1C312.4 402.3 327.6 402.3 336.1 392.1L416.1 312.1C426.3 303.6 426.3 288.4 416.1 279C407.6 269.7 392.4 269.7 383 279L344 318.1V184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184V318.1L256.1 279C247.6 269.7 232.4 269.7 223 279C213.7 288.4 213.7 303.6 223 312.1L303 392.1z" /></svg>
                                        </div>
                                        <div className="footer_titulo">Generar Informe</div>
                                    </div>
                                </div>
                            </div>
                            {/* <BotonVolver /> */}
                        </div>
                }

            </MuiPickersUtilsProvider>

        </div>
        </div>
    )
}
