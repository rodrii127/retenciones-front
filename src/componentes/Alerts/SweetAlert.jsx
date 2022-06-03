import Swal from 'sweetalert2'
import { types } from '../../types/types'

export const loginAlert = () => {
    Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
}

export const confirmForm = (dispatch, navigate) => {
    Swal.fire({
        title: '¿Desea cerrar sesión?',
        text: 'Deberas iniciar sesión para seguir interactuando',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Salir',
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            procesoExitoso()

            dispatch({ type: types.logout })
            navigate("/login", { replace: true })
        } else {
            procesoErroneo()
        }
    })
}

export const procesoExitoso = () => {
    Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Proceso exitoso',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
}

export const procesoErroneo = () => {
    Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
}

export const mensajeArriba = (icono, mensaje) => {
    Swal.fire({
        toast: true,
        icon: icono,
        title: mensaje,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
}

export const errorAlert = (errorText) => {
    Swal.fire({
        title: 'Error',
        text: errorText,
        icon: 'error',
        confirmButtonText: 'Aceptar'
    })
}