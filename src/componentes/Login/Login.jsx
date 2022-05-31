import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.scss'
import { UserContext } from '../Contexto/UserContext'
import { Loading } from '../OtrosComponentes/Loading'
import { errorAlert, loginAlert } from '../Alerts/SweetAlert'
import { types } from '../../types/types'

export const Login = (props) => {

  const { dispatch } = useContext(UserContext)
  const [flag, setFlag] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    const preciosaEnter = (e) => {
      if (e.keyCode === 13 && !document.querySelector(".swal2-container")) {
        postLogin()
      }
    }
    document.addEventListener("keypress", (e) => preciosaEnter(e))
    return () => {
      document.removeEventListener("keypress", (e) => preciosaEnter(e))

    }
  }, [])


  const postLogin = () => {
    document.querySelector(".boton_iniciar_sesion").style.pointerEvents = "none"
    document.querySelector(".boton_iniciar_sesion").style.opacity = "0.7"

    let lista = []
    let vacios = false

    document.querySelectorAll("input").forEach((e, i) => {
      if (e.value === "") {
        vacios = true
      }
      lista.push(e.value)
    })

    if (vacios) {
      errorAlert("Los campos son obligatorios.")
      document.querySelector(".boton_iniciar_sesion").style.pointerEvents = "all"
      document.querySelector(".boton_iniciar_sesion").style.opacity = "1"
      return
    }

    setFlag(true)

    fetch('https://retentencionesnmisiones.herokuapp.com/v1/retenciones/users/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": lista[0],
        "password": lista[1]
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.errors) {
          errorAlert('Formato de email inválido')
          setFlag(false)
          document.querySelector(".boton_iniciar_sesion").style.pointerEvents = "all"
          document.querySelector(".boton_iniciar_sesion").style.opacity = "1"
          return
        }
        loginAlert()
        dispatch( {
          type: types.login,
          payload: {
            token: res.loginToken
          } 
        })
        
        navigate("/", {replace: true})
      }).catch(err => {
        errorAlert('Usuario o contraseña inválida.')
        document.querySelector(".boton_iniciar_sesion").style.pointerEvents = "all"
        document.querySelector(".boton_iniciar_sesion").style.opacity = "1"
        setFlag(false)
      })
  }

  return (
    <div className="caja_principal_login">
      <div className="caja_interior">
        <div className="caja1">
          <span className="glyphicon glyphicon-user"></span>
        </div>
        <div className="caja2">
          <input type="email" className="correo" placeholder="Correo electrónico" />
          <input type="password" className="contrasena" placeholder="Contraseña" />
          <div className="boton_iniciar_sesion" onClick={postLogin} >
            {
              flag
                ? <Loading estilo={{ display: "flex", justifyContent: "center", alignItems: "center" }} ancho={"20"} />
                : "Iniciar Sesión"
            }
          </div>
        </div>
        <div className="caja3">
          <div className="olvido_contrasena">
            <span className="glyphicon glyphicon-lock	"></span>
            <div className="nombre">¿Olvidó su contraseña?</div>
          </div>
          <div className="registrarse">
            <span className="glyphicon glyphicon-ok"></span>
            <div className="nombre">Registrarse</div>
          </div>
        </div>
      </div>
    </div>
  )
}
