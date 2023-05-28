import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../componentes/Contexto/UserContext";
import {
    errorAlert,
    loginAlert,
    registrarEnviado,
} from "../../componentes/Alerts/SweetAlert";
import { types } from "../../types/types";
import { loginUri } from "../../utils/UrlUtils";
import { Button, Form, Input } from "antd";
import { ReactComponent as SevenBIcon } from "../../images/sevenb2.svg";

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
    justify-content: space-between;
    padding: 8px 15px;
`;

const StyledButton = styled.div`
    cursor: pointer;
    color: #2a00e1;
    border-radius: 9px;
`;

const StyledForm = styled(Form)`
    padding: 8px 15px;
    .ant-row.ant-form-item {
        display: block;
        .ant-input {
            border-radius: 9px;
        }
        .ant-input-affix-wrapper.ant-input-password {
            border-radius: 9px;
        }
    }
    .ant-btn.ant-btn-primary {
        border-radius: 9px;
        width: 100%;
    }
`;

export const Registrar = (props) => {
    const { dispatch } = useContext(UserContext);

    const navigate = useNavigate();

    const onFinish = (values) => {
        registrarEnviado("Usuario regitrado satisfactoriamente", navigate);
        /* fetch(loginUri, {
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
            }); */
    };

    return (
        <StyledBoxLogin>
            <StyledPreBox>
                <SevenBIcon fill="#23649d" width={"300px"} height={"100px"} />

                <StyledForm name="basic" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                        name="razonSocial"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingrese su razón social",
                            },
                        ]}
                    >
                        <Input placeholder="Razon social" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingrese su correo",
                            },
                            () => ({
                                validator(_, value) {
                                    if (value) {
                                        if (
                                            value.match(
                                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                                            ) !== null
                                        ) {
                                            return Promise.resolve("perfecto");
                                        } else {
                                            return Promise.reject(
                                                new Error("Email no valido...")
                                            );
                                        }
                                    } else {
                                        return Promise.reject(new Error(""));
                                    }
                                },
                            }),
                        ]}
                    >
                        <Input placeholder="Correo" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingrese su contraseña...",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Contraseña" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor vuelva a ingresar su contraseña...",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("password") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Las contraseñas no coinciden..."
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Repetir contraseña" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                        Registrarse
                    </Button>
                </StyledForm>

                <StyledButtonBoxLogin>
                    <StyledButton
                        style={{ marginRight: "11px" }}
                        onClick={() => navigate("/login")}
                    >
                        Iniciar sesión...
                    </StyledButton>
                    <StyledButton
                        style={{ marginLeft: "12px" }}
                        onClick={() => navigate("/recovery")}
                    >
                        ¿Olvidaste tu contraseña?
                    </StyledButton>
                </StyledButtonBoxLogin>
            </StyledPreBox>
        </StyledBoxLogin>
    );
};
