import React, { useContext, useEffect, useState } from 'react'
import Ant_Table_Factura from './ADFactura/Ant_Table_Factura'
import { Col, Row, DatePicker, ConfigProvider, Select, Form, Button, Spin, Checkbox  } from 'antd';
import { useNavigate } from 'react-router-dom';
import Ant_Input_Search from '../AntComponents/Ant_Input_Search';
import { UserContext } from '../Contexto/UserContext';
import { invoiceUri, providerUri } from '../../utils/UrlUtils';
import { errorAlert, mensajeArriba, procesoExitoso } from '../Alerts/SweetAlert';
import { types } from '../../types/types';
import moment from 'moment';
import { formatDate } from '../../utils/DateUtils';

import 'moment/locale/es'
import locale from 'antd/es/date-picker/locale/es_ES'


const { RangePicker } = DatePicker

const { Option } = Select;

const rangeConfig = {
    rules: [
      {
        type: 'array',
        required: true,
        message: 'Seleccione un rango de fechas...',
      },
    ],
  }

export const VerFacturas = () => {

    const [lista, setLista] = useState([])

    const [flag, setFlag] = useState(true)

    const [listaBuscada, setListaBuscada] = useState([])

    const [flagBusqueda, setFlagBusqueda] = useState(false)

    
    const { dispatch } = useContext(UserContext)

    const { user } = useContext(UserContext)

    const navigate = useNavigate();

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
                    /* navigate('/proveedor') */
                }
            }
            return res.json()
        }).then(res => {
            setLista(res.map(proveedor => {
                return { id: proveedor.id, name: proveedor.companyName }
            }))
            setFlag(false)
        }).catch(err => {
            console.log(err)
        })

        return () => {
            /* document.querySelector("input[valueName='Grabado(*):']").removeEventListener("input", onEngravedChange); */
        }
    }, [])

    const formatter = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    })

    const calcularTotal = ( item ) =>{
        let suma = Number( item.engraved ) 
        + Number( item.exempt ) 
        + Number( item.iibb ) 
        + Number( item.iva21 ) 
        + Number( item.iva105 ) 
        + Number( item.municipality ) 
        + Number( item.taxedOthers )
        return formatter.format(suma) 
    }
    
    const onFinish = ( values ) =>{

        console.log({
            ...values,
            'rangos': [ values["range-picker"][0].format("YYYY-MM-DD") , formatDate(values["range-picker"][1].format("YYYY-MM-DD")) ]
        }) 

        setFlagBusqueda(true)

        let invoiceUriWithParams = invoiceUri.concat('?startDate=')
            .concat( values["range-picker"][0].format("YYYY-MM-DD") )
            .concat('&endDate=')
            .concat( values["range-picker"][1].format("YYYY-MM-DD") )
            .concat('&impacted=')
            .concat( values.Impactado ? true : false )
            .concat("&idProvider=" + ( values.proveedor ? lista.find( providerName => providerName.name === values.proveedor ).id : "" ) )
        
        console.log( invoiceUriWithParams )

        fetch( invoiceUriWithParams , {
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
            setListaBuscada(res.map( element => { return { ...element, provider: element.provider.companyName, total: calcularTotal(element) } } ))
            setFlagBusqueda(false)

        }).catch(err => {
            console.log(err)
            mensajeArriba("error", "Ocurrió un error en la busqueda...")
            setFlagBusqueda(false)
        })

    }

    return (
        <div>

            {
                flag
                ?
                <Spin tip="Cargando..." style={{display: "flex", justifyContent:"center", alignItems: "center"}} size="large" />
                :
                <div>
                        <Form  onFinish={onFinish}>

                            <Row gutter={[8,8]} justify={"center"}>

                                <Col sm={ 24 } md={ 8 } >
                                    <Form.Item name="range-picker" label="RangePicker" {...rangeConfig} >     
                                        <RangePicker locale={locale} style={{width: "100%"}} placement={"bottomRight"} />
                                    </Form.Item>
                                </Col>

                                <Col sm={ 24 } md={ 8 } /* style={{display: "flex", justifyContent: "flex-start"}} */ >
                                    <Form.Item 
                                        name="proveedor"
                                        label="Proveedor"
                                        rules={[
                                            {   
                                                
                                                required: false,
                                                message: 'Selecciona un proveedor...'
                                            },
                                        ]}
                                    >
                                        <Select showSearch optionFilterProp="children" allowClear>
                                            {
                                                lista.map( element =>{
                                                    return <Option key={ element.id } value={ element.name }> { element.name } </Option>
                                                } )
                                            }
                                        </Select>
                                        
                                    </Form.Item>
                                </Col>

                                <Col sm={ 24 } md={ 4 } style={{display: "flex", justifyContent: "center"}}>
                                    <Form.Item
                                        name="impactado"
                                        valuePropName="checked"
                                        rules={[
                                            {
                                                required: false
                                            }
                                        ]}
                                    >
                                        <Checkbox  style={{ marginLeft: "5px" }} > Impactado </Checkbox>
                                    </Form.Item>
                                </Col>

                                <Col sm={ 24 } md={ 4 } style={{display: "flex", justifyContent: "center"}} >
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">Buscar</Button>
                                    </Form.Item>
                                </Col>

                            </Row>        

                        </Form>


                        <Row>
                            <Col span={24}>
                                {
                                    flagBusqueda
                                    ?
                                    <Spin tip="Cargando..." style={{display: "flex", justifyContent:"center", alignItems: "center"}} size="large" />
                                    :
                                    <Ant_Table_Factura list={ listaBuscada } ></Ant_Table_Factura>
                                }
                                
                            </Col>
                        </Row>
                </div>
            }    
            
        </div>
    )
}
