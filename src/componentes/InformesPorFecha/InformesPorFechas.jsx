import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Button,
    Form,
    DatePicker,
    Popconfirm,
    Table,
    Typography,
    Select,
} from "antd";
import styled from "styled-components";
import readXlsxFile from "read-excel-file";
import moment from "moment";
import "moment/locale/es";
import { providerUri } from "../../utils/UrlUtils";
import locale from "antd/es/date-picker/locale/es_ES";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Contexto/UserContext";
import {
    errorAlert,
    procesoExitoso,
    mensajeArriba,
} from "../Alerts/SweetAlert";
import { baseUrl, payOrderList, payOrderUri } from "../../utils/UrlUtils";
import { types } from "../../types/types";
import { useColorScheme } from "@mui/material";
import { handleExcel } from "../../utils/downLoadFiles";

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

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = (
        <Select showSearch optionFilterProp="children">
            {/* {
                          fiscalConditionList.map( element =>{
                              return <Option key={ element.id } value={ element.name }> { element.name } </Option>
                          } )
                      } */}
        </Select>
    );

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export const InformesPorFechas = () => {
    const { dispatch } = useContext(UserContext);
    const { user } = useContext(UserContext);
    const [dataList, setDataList] = useState([]);
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState("");
    const isEditing = (record) => record.id === editingKey;
    const [lista, setLista] = useState([]);
    const [listaBuscada, setListaBuscada] = useState([]);
    const [flag, setFlag] = useState(true);

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

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey("");
    };

    const deleteOrder = async (record) => {
        const deleteUri = `${payOrderUri}/${record.id}?logicalDelete=true`;
        fetch(deleteUri, {
            method: "DELETE",
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
                        errorAlert("No existe orden de pago.");
                        navigate("/proveedor");
                    }
                }
                if (res.status >= 200) {
                    console.log("Eliminado exitosamente:");
                    procesoExitoso();
                }
                return res.json();
            })

            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        `Error al eliminar. Código de estado: ${res.status}`
                    );
                }
                return res.json();
            })
            .catch((error) => {
                console.error("Error al intentar eliminar:", error);
                // Manejar el error según tus necesidades
            });
    };

    const save = async (record, data) => {
        try {
            await deleteOrder(record);
            const beforeData = [...data];
            const index = beforeData.findIndex((item) => record.id === item.id);
            if (index > -1) {
                beforeData.splice(index, 1);
                const newData = [...beforeData];
                if (newData.length === 0) {
                    setDataList([]);
                } else {
                    setDataList(newData);
                    setEditingKey("");
                }
                setEditingKey("");
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const columns = [
        {
            title: "Fecha",
            dataIndex: "date",
            editable: true,
        },
        {
            title: "Número",
            dataIndex: "number",
            editable: true,
        },
        {
            title: "Proveedor",
            dataIndex: "cuitProvider",
            editable: true,
        },
        {
            title: "Base Imponible",
            dataIndex: "base",
            editable: true,
        },
        {
            title: "Importe Retenido",
            dataIndex: "retention",
            editable: true,
        },
        {
            title: "Monto a Cobrar",
            dataIndex: "amountPaid",
            editable: true,
        },
        {
            title: "Operación",
            dataIndex: "operation",
            fixed: "right",
            width: 150,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record, dataList)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Guardar
                        </Typography.Link>
                        <Popconfirm
                            title="Seguro desea cancelar?"
                            onConfirm={cancel}
                        >
                            <a>Cancelar</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link
                        disabled={editingKey !== ""}
                        onClick={() => edit(record)}
                    >
                        Elimnar
                    </Typography.Link>
                );
            },
        },
    ];

    //HOOKS

    const navigate = useNavigate();

    const onFinish = (values) => {
        let datesParams = `?endDate=${values.rangePicker[1].format(
            "YYYY-MM-DD"
        )}&startDate=${values.rangePicker[0].format("YYYY-MM-DD")}`;

        fetch(payOrderList + datesParams, {
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
                        mensajeArriba(
                            "info",
                            "No existen registros en las fechas buscadas."
                        );
                        setDataList([]);

                        throw "No exiten datos en esas fechas.";
                    }
                }
                return res.json();
            })

            .then((res) => {
                if (res.length === 0) {
                    mensajeArriba(
                        "info",
                        "No existe registros en las fechas buscadas."
                    );
                } else {
                    mensajeArriba("success", "Ordenes de pago encontradas!");
                }

                if (values.proveedor === undefined) {
                    setDataList(res);
                } else {
                    setDataList(
                        res.filter((item) => item.provider === values.proveedor)
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <div style={{ display: "flex" }}>
                <Form
                    onFinish={onFinish}
                    style={{
                        display: "flex",
                        width: "60%",
                    }}
                >
                    <Form.Item
                        name="rangePicker"
                        label="Fecha"
                        {...rangeConfig}
                        style={{
                            width: "50%",
                            marginRight: "20px",
                        }}
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

                <Button
                    type="primary"
                    htmlType="submit"
                    id="butonBuscarFacturas"
                    onClick={() => handleExcel(dataList)}
                >
                    Generar Informe
                </Button>
            </div>

            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={dataList}
                columns={columns}
                rowClassName="editable-row"
                scroll={{
                    x: 1000,
                    y: 500,
                }}
            />
        </div>
    );
};
