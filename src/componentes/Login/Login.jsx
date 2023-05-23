import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { UserContext } from "../Contexto/UserContext";
import { Loading } from "../OtrosComponentes/Loading";
import { errorAlert, loginAlert } from "../Alerts/SweetAlert";
import { types } from "../../types/types";
import { loginUri } from "../../utils/UrlUtils";
import { Button, Checkbox, Form, Input } from "antd";

import styled from "styled-components";

const StyledBoxLogin = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    background: rgb(75, 120, 231);
    background: radial-gradient(
        circle,
        rgba(75, 120, 231, 1) 0%,
        rgba(11, 32, 250, 1) 95%
    );
`;

const StyledPreBox = styled.div`
    background: white;
    padding: 50px;
    border-radius: 20px;
`;

const StyledButtonBoxLogin = styled.div`
    display: flex;
    margin-top: 20px;
`;

const SyledButton = styled.div`
    cursor: pointer;
    /* margin: 0 20px 0 0; */
    color: #2a00e1;
    border-radius: 9px;
`;

const StyledForm = styled(Form)`
    .ant-row.ant-form-item {
        display: block;
        .ant-form-item-control {
            width: 100%;
            max-width: 100%;
        }
        .ant-form-item-label {
            text-align: start;
        }
    }
`;

export const Login = (props) => {
    const { dispatch } = useContext(UserContext);

    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log("Success:", values);
        fetch(loginUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: values.username,
                password: values.password,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.errors) {
                    errorAlert("Formato de email inválido");
                    /* setFlag(false);
                    document.querySelector(
                        ".boton_iniciar_sesion"
                    ).style.pointerEvents = "all";
                    document.querySelector(
                        ".boton_iniciar_sesion"
                    ).style.opacity = "1"; */
                    return;
                }
                loginAlert();
                dispatch({
                    type: types.login,
                    payload: {
                        token: res.loginToken,
                    },
                });

                navigate("/", { replace: true });
            })
            .catch((err) => {
                errorAlert("Usuario o contraseña inválida.");
                /* document.querySelector(
                    ".boton_iniciar_sesion"
                ).style.pointerEvents = "all";
                document.querySelector(".boton_iniciar_sesion").style.opacity =
                    "1";
                setFlag(false); */
            });
    };
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <StyledBoxLogin>
            <StyledPreBox>
                <StyledForm
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Usuario"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingrese su usuario...",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingrese su contraseña...",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    {/* <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    > */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Button type="primary" htmlType="submit">
                            Ingresar
                        </Button>
                    </div>
                    {/* </Form.Item> */}
                </StyledForm>

                <StyledButtonBoxLogin>
                    <SyledButton style={{ marginRight: "20px" }}>
                        Olvidaste tu contraseña?
                    </SyledButton>
                    <SyledButton style={{ marginLeft: "20px" }}>
                        <b>Registrarse!</b>
                    </SyledButton>
                </StyledButtonBoxLogin>
            </StyledPreBox>
        </StyledBoxLogin>
    );
};
