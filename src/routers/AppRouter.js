import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Login } from "../componentes/Login/Login";
import { DashboardRoute } from "./DashboardRoute";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { Recuperar } from "../componentes/Recuperar/Recuperar";
import { Registrar } from "../componentes/Registrar/Registrar";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/recovery"
                    element={
                        <PublicRoute>
                            <Recuperar />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Registrar />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/*"
                    element={
                        <PrivateRoute>
                            <DashboardRoute></DashboardRoute>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};
