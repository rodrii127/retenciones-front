import React, { useContext, useEffect, useState } from "react";
import { DatePicker, Select, Form, Button, Spin, Table } from "antd";
import "moment/locale/es";
import locale from "antd/es/date-picker/locale/es_ES";
import { errorAlert, mensajeArriba } from "../Alerts/SweetAlert";
import { useNavigate } from "react-router-dom";

import { invoiceUri, providerUri, payOrderUri } from "../../utils/UrlUtils";
import { UserContext } from "../Contexto/UserContext";
import { types } from "../../types/types";

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

const columns = [
    {
        title: "Fecha",
        dataIndex: "date",
        /* render: (text) => <a>{text}</a>, */
    },
    {
        title: "Proveedor",
        dataIndex: "provider",
    },
    {
        title: "N° Factura",
        dataIndex: "factura",
    },
    {
        title: "Total",
        dataIndex: "total",
    },
];

export const NewOrdenPago = () => {
    //ESTADOS

    const [lista, setLista] = useState([]);

    const [flag, setFlag] = useState(true);

    const { dispatch } = useContext(UserContext);

    const { user } = useContext(UserContext);

    const [flagBusqueda, setFlagBusqueda] = useState(false);

    const [listaBuscada, setListaBuscada] = useState([]);

    const [checkList, setCheckList] = useState([]);

    //HOOKS

    const navigate = useNavigate();

    //FUNCIONES

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

    const onFinish = (values) => {
        let url = `?startDate=${values["rangePicker"][0].format(
            "YYYY-MM-DD"
        )}&endDate=${values["rangePicker"][1].format(
            "YYYY-MM-DD"
        )}&impacted=false&idProvider=${values.proveedor}`;

        setFlagBusqueda(true);

        fetch(invoiceUri + url, {
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
                    res.map((item) => {
                        const total = (
                            Number(item.engraved) +
                            Number(item.exempt) +
                            Number(item.iibb) +
                            Number(item.iva21) +
                            Number(item.iva105) +
                            Number(item.municipality) +
                            Number(item.taxedOthers)
                        ).toFixed(2);

                        return {
                            ...item,
                            provider: item.provider.companyName,
                            factura: `${item.pointSale} - ${item.number}`,
                            total: total,
                            key: item.id,
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

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setCheckList(selectedRows);
        },
    };

    const onFinishPDF = (values) => {
        const selectedItems = checkList.map((elemento) => {
            return elemento.id;
        });

        if (selectedItems.length === 0) {
            errorAlert("Debe seleccionar al menos una factura...");
            return;
        }

        fetch(payOrderUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                idInvoices: selectedItems,
                startDate: values.fechaOrden,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                mensajeArriba("success", "Orden de Pago creada con éxito");
                createPayOrderPDF(
                    res.id,
                    res.company.companyName,
                    res.payOrderNumber
                );

                setFlagBusqueda(false);
            })
            .catch((err) => {
                console.log(err);
                mensajeArriba("error", "Ocurrió un error en la busqueda...");
                setFlagBusqueda(false);
            });
    };

    const createPayOrderPDF = (id, companyName, payOrderNumber) => {
        if (!id) {
            errorAlert("Hubo un error en la generación del PDF");
            return;
        }

        fetch(payOrderUri.concat("/payOrderPdf/").concat(id), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((response) => response.blob())
            .then((blob) => {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement("a");
                a.href = url;
                a.download =
                    "Orden de Pago-" +
                    payOrderNumber +
                    "-" +
                    companyName +
                    ".pdf";
                document.body.appendChild(a);
                a.click();
                a.remove();
                mensajeArriba("success", "Descargado con éxito");
                setFlagBusqueda(false);
                document.querySelector("#butonBuscarFacturas").click();
            })
            .catch((err) => {
                console.log(err);
                mensajeArriba("error", "Ocurrió un error en la busqueda...");
                setFlagBusqueda(false);
            });
    };

    return (
        <>
            <div>
                {flag ? (
                    <Spin />
                ) : (
                    <div style={{ display: "flex" }}>
                        <Form
                            onFinish={onFinish}
                            style={{ display: "flex", width: "60%" }}
                        >
                            <Form.Item
                                name="rangePicker"
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
                                        required: true,
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
                                                value={element.id}
                                            >
                                                {element.name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item style={{ marginRight: "20px" }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    id="butonBuscarFacturas"
                                >
                                    Buscar
                                </Button>
                            </Form.Item>
                        </Form>

                        <Form
                            onFinish={onFinishPDF}
                            style={{ display: "flex", width: "40%" }}
                        >
                            <Form.Item
                                name="fechaOrden"
                                label="Fecha de Orden"
                                rules={[
                                    {
                                        required: true,
                                        message: "Selecciona fecha de órden...",
                                    },
                                ]}
                                style={{ marginRight: "20px", width: "100%" }}
                            >
                                <DatePicker
                                    locale={locale}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>

                            <Form.Item style={{ marginRight: "20px" }}>
                                <Button type="primary" htmlType="submit">
                                    Generar Orden
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </div>
            <div>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={listaBuscada}
                />
            </div>
        </>
    );
};
