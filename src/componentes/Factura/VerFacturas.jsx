import React, { useContext, useEffect, useState } from "react";
import Ant_Table_Factura from "./ADFactura/Ant_Table_Factura";
import {
    Col,
    Row,
    DatePicker,
    Select,
    Form,
    Button,
    Spin,
    Checkbox,
    Modal,
} from "antd";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../Contexto/UserContext";
import { invoiceUri, providerUri } from "../../utils/UrlUtils";
import { errorAlert, mensajeArriba } from "../Alerts/SweetAlert";
import { types } from "../../types/types";
import { formatDate } from "../../utils/DateUtils";

import "moment/locale/es";
import locale from "antd/es/date-picker/locale/es_ES";
import Ant_Form_Factura from "./ADFactura/Ant_Form_Factura";

const { RangePicker } = DatePicker;

const { Option } = Select;

const rangeConfig = {
    rules: [
        {
            type: "array",
            required: true,
            message: "Seleccione un rango de fechas...",
        },
    ],
};

export const VerFacturas = () => {
    const [lista, setLista] = useState([]);

    const [flag, setFlag] = useState(true);

    const [listaBuscada, setListaBuscada] = useState([]);

    const [flagBusqueda, setFlagBusqueda] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { dispatch } = useContext(UserContext);

    const { user } = useContext(UserContext);

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
                        /* navigate('/proveedor') */
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
    }, []);

    const formatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    });

    const calcularTotal = (item) => {
        let suma =
            Number(item.engraved) +
            Number(item.exempt) +
            Number(item.iibb) +
            Number(item.iva21) +
            Number(item.iva105) +
            Number(item.municipality) +
            Number(item.taxedOthers);
        return formatter.format(suma);
    };

    const onFinish = (values) => {
        console.log({
            ...values,
            rangos: [
                values["range-picker"][0].format("YYYY-MM-DD"),
                formatDate(values["range-picker"][1].format("YYYY-MM-DD")),
            ],
        });

        setFlagBusqueda(true);

        let invoiceUriWithParams = invoiceUri
            .concat("?startDate=")
            .concat(values["range-picker"][0].format("YYYY-MM-DD"))
            .concat("&endDate=")
            .concat(values["range-picker"][1].format("YYYY-MM-DD"))
            .concat("&impacted=")
            .concat(values.Impactado ? true : false)
            .concat(
                "&idProvider=" +
                    (values.proveedor
                        ? lista.find(
                              (providerName) =>
                                  providerName.name === values.proveedor
                          ).id
                        : "")
            );

        fetch(invoiceUriWithParams, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.length === 0) {
                    mensajeArriba("info", "No hay facturas en esas fechas...");
                } else {
                    mensajeArriba("success", "Facturas encontradas!");
                }
                setListaBuscada(
                    res.map((element) => {
                        return {
                            ...element,
                            provider: element.provider.companyName,
                            providerId: element.provider.id,
                            total: calcularTotal(element),
                        };
                    })
                );
                setFlagBusqueda(false);
            })
            .catch((err) => {
                console.log(err);
                mensajeArriba("error", "Ocurrió un error en la busqueda...");
                setFlagBusqueda(false);
            });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div>
            {flag ? (
                <Spin
                    tip="Cargando..."
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    size="large"
                />
            ) : (
                <div>
                    <div style={{ display: "flex" }}>
                        <Form
                            onFinish={onFinish}
                            style={{ display: "flex", width: "90%" }}
                        >
                            <Form.Item
                                name="range-picker"
                                label="Fecha"
                                {...rangeConfig}
                                style={{ width: "50%", marginRight: "20px" }}
                            >
                                <RangePicker
                                    locale={locale}
                                    style={{ width: "100%" }}
                                    placement={"bottomRight"}
                                />
                            </Form.Item>

                            <Form.Item
                                name="proveedor"
                                label="Proveedor"
                                style={{ width: "50%", marginRight: "20px" }}
                                rules={[
                                    {
                                        required: false,
                                        message: "Selecciona un proveedor...",
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    allowClear
                                >
                                    {lista.map((element) => {
                                        return (
                                            <Option
                                                key={element.id}
                                                value={element.name}
                                            >
                                                {" "}
                                                {element.name}{" "}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="impactado"
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                                style={{ marginRight: "20px" }}
                            >
                                <Checkbox style={{ marginLeft: "5px" }}>
                                    {" "}
                                    Impactado{" "}
                                </Checkbox>
                            </Form.Item>

                            <Form.Item style={{ marginRight: "20px" }}>
                                <Button type="primary" htmlType="submit">
                                    Buscar
                                </Button>
                            </Form.Item>
                        </Form>

                        <Form.Item style={{ marginLeft: "auto" }}>
                            <Button type="primary" onClick={openModal}>
                                Nueva Factura
                            </Button>
                        </Form.Item>
                    </div>

                    <Row>
                        <Col span={24}>
                            {flagBusqueda ? (
                                <Spin
                                    tip="Cargando..."
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    size="large"
                                />
                            ) : (
                                <Ant_Table_Factura
                                    list={listaBuscada}
                                ></Ant_Table_Factura>
                            )}
                        </Col>
                    </Row>

                    <Modal
                        title="Agregar nueva factura"
                        visible={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        footer={null}
                        width={800}
                    >
                        <Ant_Form_Factura
                            list={lista}
                            setIsModalOpen={setIsModalOpen}
                        />
                    </Modal>
                </div>
            )}
        </div>
    );
};
