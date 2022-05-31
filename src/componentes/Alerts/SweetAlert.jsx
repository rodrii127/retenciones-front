import Swal from 'sweetalert2'

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

export const mensajeArriba = ( icono, mensaje ) => {
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

//TODO check if this is going to be reused on another component..
export const errorAlert = (errorText) => {
    Swal.fire({
        title: 'Error',
        text: errorText,
        icon: 'error',
        confirmButtonText: 'Aceptar'
    })
}