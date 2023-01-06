import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import esLocale from "date-fns/locale/es";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { types } from "../../types/types";
import { getCompanyName } from "../../utils/TokenUtils";
import { providerUri } from "../../utils/UrlUtils";
import {
    errorAlert,
    mensajeArriba,
    procesoExitoso,
} from "../Alerts/SweetAlert";
import { UserContext } from "../Contexto/UserContext";
import { Loading } from "../OtrosComponentes/Loading";
import Ant_Form_Factura from "./ADFactura/Ant_Form_Factura";
import "./mainView.scss";

export const NuevaFactura = (props) => {
    const { user } = useContext(UserContext);

    const [lista, setLista] = useState([]);

    const [flag, setFlag] = useState(true);

    const [flagFactura, setFlagFactura] = useState(false);

    const { dispatch } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(providerUri, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user.token,
            },
        })
            .then((res) => {
                if (res.status >= 400) {
                    if (res.status === 401) {
                        dispatch({ type: types.logout });
                        errorAlert("Se venció la sesión actual.");
                        navigate("/login", { replace: true });
                    } else if (res.status === 404) {
                        errorAlert("No existen proveedores creados.");
                        navigate("/proveedor");
                    }
                }
                return res.json();
            })
            .then((res) => {
                setLista(
                    res.map((proveedor) => {
                        return {
                            id: proveedor.id,
                            name: proveedor.companyName,
                        };
                    })
                );
                setFlag(false);
            })
            .catch((err) => {
                console.log(err);
            });

        return () => {};
    }, []);

    const onEngravedChange = (e) => {};

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
            {flag ? (
                <Loading
                    estilo={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}
                    ancho={"150"}
                />
            ) : (
                <div className="caja_principal" onClick={onEngravedChange}>
                    <div className="contenido">
                        <div className="nueva_factura">
                            <Ant_Form_Factura
                                flagFactura={flagFactura}
                                setFlagFactura={setFlagFactura}
                                list={lista}
                            ></Ant_Form_Factura>
                        </div>
                    </div>
                </div>
            )}
        </MuiPickersUtilsProvider>
    );
};
