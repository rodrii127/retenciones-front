import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../Contexto/UserContext";
import "./proveedor.scss";
import { Loading } from "../OtrosComponentes/Loading";
import {
    procesoErroneo,
    procesoExitoso,
    errorAlert,
} from "../Alerts/SweetAlert";
import { providerUri } from "../../utils/UrlUtils";
import Ant_Table from "./ADProvider/Ant_Table";
import Ant_Form from "./ADProvider/Ant_Form_Provider";
import { useNavigate } from "react-router-dom";
import { types } from "../../types/types";
import { Button, Modal, Input } from "antd";

export const Proveedor = () => {
    const [lista, setLista] = useState([]);

    const [listaFiltrada, setListaFiltrada] = useState([]);

    const { user } = useContext(UserContext);

    const [flag, setFlag] = useState(true);

    const [flagSave, setFlagSave] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [inputValue, setInputValue] = useState("");

    const { dispatch } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        getProveedores();
    }, []);

    const fiscalConditionList = [
        {
            name: "RI",
            id: 1,
        },
        {
            name: "EX",
            id: 2,
        },
        {
            name: "MT",
            id: 3,
        },
    ];

    function getProveedores() {
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
                let newArray = res.map((proveedor) => {
                    return {
                        key: proveedor?.id,
                        razon_social: proveedor?.companyName,
                        cuit: proveedor?.cuit,
                        direccion: proveedor?.address,
                        telefono: proveedor?.phone,
                        condicion_fiscal: proveedor?.fiscalCondition,
                        convenio_multilateral: proveedor?.agreement,
                        exento_iibb: proveedor?.iibbExcept,
                        exento_municipalidad: proveedor?.municipalityExcept,
                    };
                });

                setLista(newArray);
                setListaFiltrada(newArray);
                console.log(newArray.length);
                setFlag(false);
            })
            .catch((err) => {
                console.log(err);
            });

        return () => {};
    }

    function postProveedor(body) {
        setFlagSave(true);
        setFlag(true);
        fetch(providerUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                companyName: body.user["Razón Social"],
                cuit: body.user["CUIT"],
                address: body.user["Dirección"],
                phone: body.user["Teléfono"],
                fiscalCondition: body.user["Condición Fiscal"],
                agreement: body.user["convenio_multilateral"],
                iibbExcept: body.user["exento_iibb"],
                municipalityExcept: body.user["exento_municipalidad"],
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status) {
                    procesoErroneo();
                    setFlagSave(false);
                    setFlag(false);
                    return;
                }

                procesoExitoso();

                setFlagSave(false);
                setFlag(false);

                getProveedores();
            })
            .catch((err) => {
                console.log("asdasd" + err);
            });
    }

    const filterList = (e) => {
        let value = e.target.value;

        setInputValue(value);

        let newDataList = lista;

        if (e !== null && e !== undefined) {
            newDataList = newDataList?.filter(
                (proveedor) =>
                    proveedor.razon_social
                        .toString()
                        .toLowerCase()
                        .indexOf(value.toLowerCase()) !== -1 ||
                    proveedor.cuit.toString().toLowerCase().indexOf(value) !==
                        -1
            );

            setListaFiltrada(newDataList);
        }
    };

    return (
        <div>
            <div className="provedores">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                    }}
                >
                    <Input
                        placeholder="Buscar proveedor"
                        style={{ width: "30%" }}
                        onChange={filterList}
                        value={inputValue}
                    />
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>
                        Nuevo Proveedor
                    </Button>
                </div>

                {flag ? (
                    <Loading
                        estilo={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        ancho={"150"}
                    />
                ) : (
                    <>
                        <Ant_Table lista={listaFiltrada}></Ant_Table>
                    </>
                )}

                <Modal
                    title="Agregar nueva factura"
                    visible={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                    width={800}
                >
                    <Ant_Form
                        list={fiscalConditionList}
                        postProveedor={postProveedor}
                        flagSave={flagSave}
                        setFlagSave={setFlagSave}
                        setIsModalOpen={setIsModalOpen}
                    />
                </Modal>
            </div>
        </div>
    );
};
