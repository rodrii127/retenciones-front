import {
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Table,
    Typography,
    Select,
    Checkbox,
} from "antd";
import React, { useContext, useEffect, useState } from "react";

import { providerUri } from "../../../utils/UrlUtils";
import { errorAlert, procesoExitoso } from "../../Alerts/SweetAlert";
import { UserContext } from "../../Contexto/UserContext";

const { Option } = Select;

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

const Ant_Table = (props) => {
    const { user } = useContext(UserContext);
    const [form] = Form.useForm();
    const [data, setData] = useState(props.lista);
    const [editingKey, setEditingKey] = useState("");
    const [flagCargando, setFlagCargando] = useState(false);

    useEffect(() => {
        setData(props.lista);
    }, [props.lista]);

    const isEditing = (record) => record.key === editingKey;

    const onAgreementCheck = (dataIndex) => {
        let valor = form.getFieldsValue();
        valor[dataIndex] = !valor[dataIndex];
        const user = form.getFieldValue(dataIndex);
        console.log(user);
        form.setFieldsValue({ ...valor });
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
        const inputNode =
            inputType === "number" ? (
                <InputNumber />
            ) : inputType === "text" ? (
                <Input />
            ) : inputType === "checkbox" ? (
                <Checkbox
                    defaultChecked={
                        dataIndex === "convenio_multilateral"
                            ? record.convenio_multilateral
                            : dataIndex === "exento_iibb"
                            ? record.exento_iibb
                            : record.exento_municipalidad
                    }
                    onChange={() => onAgreementCheck(dataIndex)}
                    style={{ marginLeft: "5px" }}
                ></Checkbox>
            ) : (
                <Select showSearch optionFilterProp="children">
                    {fiscalConditionList.map((element) => {
                        return (
                            <Option key={element.id} value={element.name}>
                                {" "}
                                {element.name}{" "}
                            </Option>
                        );
                    })}
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
                        rules={
                            title === "CUIT"
                                ? [
                                      {
                                          required: true,
                                      },
                                      {
                                          pattern: new RegExp(
                                              /^([0-9]{11}|[0-9]{2}-[0-9]{8}-[0-9]{1})$/g
                                          ),
                                          message: "Ingrese un CUIT válido...",
                                      },
                                  ]
                                : [
                                      {
                                          required: true,
                                          message: `Ingrese ${title}!`,
                                      },
                                  ]
                        }
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const edit = (record) => {
        form.setFieldsValue({
            name: "",
            age: "",
            address: "",
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey("");
    };

    const save = async (record) => {
        try {
            const row = await form.validateFields();
            editProvider(row, record.key);
            const newData = [...data];
            const index = newData.findIndex((item) => record.key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey("");
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey("");
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const editProvider = async (record, key) => {
        setFlagCargando(true);
        debugger;
        let body = {
            id: key,
            companyName: record.razon_social,
            cuit: record.cuit,
            address: record.direccion,
            phone: record.telefono,
            fiscalCondition: record.condicion_fiscal,
            agreement: record.convenio_multilateral,
            iibbExcept: record.exento_iibb,
            municipalityExcept: record.exento_municipalidad,
        };

        await fetch(providerUri + `/${key}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((res) => {
                setFlagCargando(false);

                if (res.error) {
                    errorAlert(
                        "Hubo un error en la actualizacion de los proveedores."
                    );
                }

                procesoExitoso();
                //form.resetFields()
            })
            .catch((err) => {
                console.log(err);
                errorAlert("Ups, ocurrió un error inesperado...");
                setFlagCargando(false);
            });
    };

    const getInputType = (dataIndex) => {
        switch (dataIndex) {
            case "condicion_fiscal":
                return "desplegable";
            case "exento_iibb":
                return "checkbox";
            case "convenio_multilateral":
                return "checkbox";
            case "exento_municipalidad":
                return "checkbox";
            default:
                return "text";
        }
    };

    const columns = [
        {
            title: "Razón Social",
            dataIndex: "razon_social",
            width: "25%",
            editable: true,
        },
        {
            title: "CUIT",
            dataIndex: "cuit",
            width: "15%",
            editable: true,
        },
        {
            title: "Dirección",
            dataIndex: "direccion",
            width: "20%",
            editable: true,
        },
        {
            title: "Teléfono",
            dataIndex: "telefono",
            width: "10%",
            editable: true,
        },
        {
            title: "Condición Fiscal",
            dataIndex: "condicion_fiscal",
            width: "10%",
            editable: true,
        },
        {
            title: "Convenio Multilateral",
            dataIndex: "convenio_multilateral",
            width: "10%",
            editable: true,
            render: (_, record) => {
                return (
                    <Checkbox
                        checked={record.convenio_multilateral}
                        style={{ marginLeft: "5px" }}
                    ></Checkbox>
                );
            },
        },
        {
            title: "Exento en IIBB",
            dataIndex: "exento_iibb",
            width: "10%",
            editable: true,
            render: (_, record) => {
                return (
                    <Checkbox
                        checked={record.exento_iibb}
                        style={{ marginLeft: "5px" }}
                    ></Checkbox>
                );
            },
        },
        {
            title: "Exento en Municipalidad",
            dataIndex: "exento_municipalidad",
            width: "10%",
            editable: true,
            render: (_, record) => {
                return (
                    <Checkbox
                        checked={record.exento_municipalidad}
                        style={{ marginLeft: "5px" }}
                    ></Checkbox>
                );
            },
        },
        {
            title: "Operación",
            dataIndex: "operation",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record)}
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
                        Editar
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: getInputType(col.dataIndex),
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                    pageSize: 8,
                }}
            />
        </Form>
    );
};

export default Ant_Table;
