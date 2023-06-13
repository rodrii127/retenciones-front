import React, { useContext, useRef, useState } from "react";
import { Button, Table } from "antd";
import styled from "styled-components";
import readXlsxFile from "read-excel-file";
import moment from "moment";

import { UserContext } from "../Contexto/UserContext";
import { errorAlert, procesoExitoso } from "../Alerts/SweetAlert";
import { baseUrl } from "../../utils/UrlUtils";

const StyledButtonBox = styled.div`
    width: 100%;
    margin-top: 60px;
    display: flex;
    justify-content: center;
`;

const columns = [
    {
        title: "Fecha",
        dataIndex: "date",
        editable: true,
    },
    {
        title: "Tipo",
        dataIndex: "type",

        editable: false,
    },
    {
        title: "Número",
        dataIndex: "number",
        editable: true,
    },
    {
        title: "Razón Social",
        dataIndex: "companyName",
        editable: true,
    },
    {
        title: "CUIT",
        dataIndex: "cuit",
        editable: true,
    },
    {
        title: "Monto",
        dataIndex: "amount",
        editable: true,
    },
    {
        title: "Alícuota",
        dataIndex: "aliquot",
        editable: true,
    },
];

export const Convertidor = () => {
    const [data, setData] = useState([]);
    const inputRef = useRef();
    const { user } = useContext(UserContext);

    const handleFile = (event) => {
        let newData = [];
        if (event.target.files[0].name.split(".")[1] === "xlsx") {
            readXlsxFile(event.target.files[0]).then((rows) => {
                rows.forEach((item, index) => {
                    newData.push({
                        key: index,
                        date: moment(item[0])
                            .add(1, "day")
                            .format("DD-MM-YYYY"),
                        type: item[1],
                        number: item[2],
                        companyName: item[3],
                        cuit: item[4],
                        amount: item[5],
                        aliquot: item[6],
                    });
                });
                setData(newData);
            });
        } else {
            errorAlert(
                "No se pudo cargar el archivo. Verifique extención o formato."
            );
        }
    };

    const postFile = () => {
        fetch(baseUrl + "/convert/atm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user.token,
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                return res.blob();
            })
            .then((blob) => {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement("a");
                a.href = url;
                a.download = `Retenciones${moment().format("YYYY-MM-DD")}.txt`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setData([]);
                procesoExitoso();
            });
    };

    return (
        <div>
            <Table
                bordered
                dataSource={data}
                columns={columns}
                rowClassName="editable-row"
                scroll={{
                    x: 1000,
                    y: 500,
                }}
            />
            <StyledButtonBox>
                <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFile}
                    ref={inputRef}
                    accept=".xlsx"
                />
                <Button
                    type="primary"
                    style={{ marginRight: "150px" }}
                    onClick={() => inputRef.current.click()}
                >
                    Subir Archivo
                </Button>
                <Button
                    type="primary"
                    style={{ marginLeft: "150px" }}
                    onClick={postFile}
                >
                    Procesar
                </Button>
            </StyledButtonBox>
        </div>
    );
};
