import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Login } from "../componentes/Login/Login";
import { DashboardRoute } from "./DashboardRoute";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />

                <Route path='/*' element={
                    <PrivateRoute>
                        <DashboardRoute></DashboardRoute>
                    </PrivateRoute>
                }
                />
            </Routes>
        </BrowserRouter>
    )
}
