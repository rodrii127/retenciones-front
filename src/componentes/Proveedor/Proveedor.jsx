import React, { useContext, useState, useEffect } from 'react'
import { InputConLabelArriba } from '../OtrosComponentes/InputConLabelArriba'
import { UserContext } from '../Contexto/UserContext'
import "./proveedor.scss"
import { Loading } from '../OtrosComponentes/Loading'
import { BotonVolver } from '../OtrosComponentes/BotonVolver'
import { procesoErroneo, procesoExitoso, errorAlert, mensajeArriba, } from '../Alerts/SweetAlert'
import { providerUri } from '../../utils/UrlUtils'
import { InputBuscador } from '../OtrosComponentes/InputBuscador'
import Ant_Table from '../AntComponents/Ant_Table'
import Ant_Form from '../AntComponents/Ant_Form'
import { useNavigate } from 'react-router-dom';
import { types } from '../../types/types';
import { Col, Row, PageHeader } from 'antd'


export const Proveedor = (props) => {

    const [lista, setLista] = useState([])

    const { user } = useContext(UserContext)

    const [flag, setFlag] = useState(true)

    const [flagSave, setFlagSave] = useState(false)

    const { dispatch } = useContext(UserContext)

    const navigate = useNavigate();

    useEffect(() => {

        getProveedores()

    }, [])

    const fiscalConditionList = [
        {
            'name': "RI",
            'id': 1
        },
        {
            name: "EX",
            id: 2
        },
        {
            name: "MT",
            id: 3
    }]

    function getProveedores() {

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
                return { key: proveedor.id, razon_social: proveedor.companyName, cuit: proveedor.cuit, direccion: proveedor.address, telefono: proveedor.phone, condicion_fiscal: proveedor.fiscalCondition }
            }))
            setFlag(false)
        }).catch(err => {
            console.log(err)
        })

        return () => {
            /* document.querySelector("input[valueName='Grabado(*):']").removeEventListener("input", onEngravedChange); */
        }

    }

    function postProveedor( body ) {

        setFlagSave(true)
        setFlag(true)

        fetch(providerUri, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                companyName: body.user["Razón Social"],
                cuit: body.user["CUIT"],
                address: body.user["Dirección"],
                phone: body.user["Teléfono"],
                fiscalCondition: body.user["Condición Fiscal"]
            })
        })
            .then(res => res.json())
            .then(res => {

                if (res.status) {
                    procesoErroneo()
                    setFlagSave(false)
                    setFlag(false)
                    return
                }

                procesoExitoso()
                /* document.querySelectorAll("input").forEach((e, i) => {
                    e.value = ""
                }) */
                getProveedores()
                setFlagSave(false)
                setFlag(false)

            }).catch(err => {
                console.log("PAPSPASP")
                console.log("asdasd" + err)
            })


    }

    return (
        <div>
            <div className="provedores">

                <PageHeader
                    className="site-page-header"
                    onBack={() => null}
                    title="Provedores"
                    subTitle="Carga y edición"
                />

                <Row gutter={[48, 8]} align={"middle"} >
                    <Col span={8}>
                        <Ant_Form 
                            list={ fiscalConditionList } 
                            postProveedor={ postProveedor } 
                            flagSave={ flagSave } 
                            setFlagSave={ setFlagSave } 
                        ></Ant_Form>
                    </Col>
                    <Col span={16}>
                        {
                            flag
                            ?
                            <Loading estilo={{ display: "flex", justifyContent: "center", alignItems: "center" }} ancho={"150"} />
                            :
                            <Ant_Table 
                                lista={ lista }
                                postProveedor={ postProveedor }
                            ></Ant_Table>
                        }
                        
                    </Col>
                </Row>

                <BotonVolver />
            </div>
        </div>
    )
}
