import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Table, DatePicker } from "antd";
import styled from "styled-components";
import readXlsxFile from "read-excel-file";
import moment from "moment";
import "moment/locale/es";
import locale from "antd/es/date-picker/locale/es_ES";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../Contexto/UserContext";
import { errorAlert, procesoExitoso } from "../Alerts/SweetAlert";
import { baseUrl, payOrderList } from "../../utils/UrlUtils";
import { types } from "../../types/types";
import { useColorScheme } from "@mui/material";
import { handleExcel } from "../../utils/downLoadFiles";

const { RangePicker } = DatePicker;

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
];

export const InformesPorFechas = () => {
    const { dispatch } = useContext(UserContext);
    const { user } = useContext(UserContext);
    const [dataList, setDataList] = useState([]);

    //HOOKS

    const navigate = useNavigate();

    const onFinish = (values) => {
        let datesParams = `?endDate=${values.rangePicker[1].format(
            "YYYY-MM-DD"
        )}&startDate=${values.rangePicker[0].format("YYYY-MM-DD")}`;

        console.log(datesParams);

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
                        errorAlert("No exiten datos en esas fechas");
                    }
                }
                return res.json();
            })
            .then((res) => {
                setDataList(res);
                console.log(res);
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
