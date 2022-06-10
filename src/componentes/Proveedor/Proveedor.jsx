import React, { useContext, useState } from 'react'
import { InputConLabelArriba } from '../OtrosComponentes/InputConLabelArriba'
import { UserContext } from '../Contexto/UserContext'
import "./proveedor.scss"
import { Loading } from '../OtrosComponentes/Loading'
import { BotonVolver } from '../OtrosComponentes/BotonVolver'
import { procesoErroneo, procesoExitoso } from '../Alerts/SweetAlert'
import { providerUri } from '../../utils/UrlUtils'
import { InputBuscador } from '../OtrosComponentes/InputBuscador'

export const Proveedor = (props) => {

    const { user } = useContext(UserContext)

    const [flag, setFlag] = useState(false)

    const fiscalConditionList = [
        {
            'nombre': "RI",
            'id': 1
        },
        {
            nombre: "EX",
            id: 2
        }]

    function postProveedor() {

        document.querySelector(".boton_guardar").style.pointerEvents = "none"
        document.querySelector(".boton_guardar").style.opacity = "0.7"

        let lista = []
        let vacios = false

        document.querySelectorAll("input").forEach((e, i) => {
            if (e.value === "") {
                vacios = true
            }
            lista.push(e.value)
        })

        if (vacios) {
            alert("No pueden quedar campos vacios...")
            document.querySelector(".boton_guardar").style.pointerEvents = "all"
            document.querySelector(".boton_guardar").style.opacity = "1"
            return
        }

        if (lista[1].length !== 11) {
            alert("El CUIT tiene que tener 11 caracteres...")
            document.querySelector(".boton_guardar").style.pointerEvents = "all"
            document.querySelector(".boton_guardar").style.opacity = "1"
            return
        }

        setFlag(true)

        fetch(providerUri, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
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
            .then(res => {

                document.querySelector(".boton_guardar").style.pointerEvents = "all"
                document.querySelector(".boton_guardar").style.opacity = "1"

                if (res.status) {
                    procesoErroneo()
                    setFlag(false)
                    return
                }

                procesoExitoso()
                document.querySelectorAll("input").forEach((e, i) => {
                    e.value = ""
                })
                setFlag(false)

            }).catch(err => {
                console.log("PAPSPASP")
                console.log("asdasd" + err)
            })


    }

    return (
        <div>
            <div className="provedores">

                <div className="titulo"> Ingrese un proveedor </div>

                <InputConLabelArriba nombre={"Razón Social:"} style={{ marginLeft: "5px" }} tipo={"text"} />
                <InputConLabelArriba nombre={"CUIT:"} style={{ marginLeft: "5px" }} tipo={"text"} />
                <InputConLabelArriba nombre={"Dirección:"} style={{ marginLeft: "5px" }} tipo={"text"} />
                <InputConLabelArriba nombre={"Teléfono:"} style={{ marginLeft: "5px" }} tipo={"number"} />
                <InputBuscador style={{ marginLeft: "5px" }} nombre={"Condición Fiscal:"} tipo={"text"} lista={fiscalConditionList} width={'30%'} />

                <div className="caja_guardar">
                    <div className="boton_guardar" onClick={postProveedor}>
                        {
                            flag ?
                                <Loading estilo={{ display: "flex", justifyContent: "center", alignItems: "center" }} ancho={""} />
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c-35.2 0-64 28.8-64 64c0 35.2 28.8 64 64 64c35.2 0 64-28.8 64-64C288 284.8 259.2 256 224 256zM433.1 129.1l-83.9-83.9C341.1 37.06 328.8 32 316.1 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V163.9C448 151.2 442.9 138.9 433.1 129.1zM128 80h144V160H128V80zM400 416c0 8.836-7.164 16-16 16H64c-8.836 0-16-7.164-16-16V96c0-8.838 7.164-16 16-16h16v104c0 13.25 10.75 24 24 24h192C309.3 208 320 197.3 320 184V83.88l78.25 78.25C399.4 163.2 400 164.8 400 166.3V416z" /></svg>
                        }
                    </div>
                    <div className='titulo'> Guardar </div>
                </div>
                <BotonVolver />
            </div>
        </div>
    )
}
