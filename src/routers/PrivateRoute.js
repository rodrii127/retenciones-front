import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../componentes/Contexto/UserContext'

export const PrivateRoute = ({ children }) => {

    const { user } = useContext(UserContext)

    return user.logged
        ? children
        : <Navigate to="login"/>
}
