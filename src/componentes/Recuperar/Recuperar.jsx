import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Contexto/UserContext";
import { errorAlert, loginAlert, recuperarEnviado } from "../Alerts/SweetAlert";
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

export const Recuperar = (props) => {
    const { dispatch } = useContext(UserContext);

    const navigate = useNavigate();

    const onFinish = (values) => {
        recuperarEnviado(
            "Se te ha enviado un correo al email que ingresaste... Por verificalo...",
            navigate
        );

        /*  fetch(loginUri, {
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
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingrese su usuario...",
                            },
                        ]}
                    >
                        <Input placeholder="Ingrese su email" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                        Recuperar contraseña
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
                        onClick={() => navigate("/register")}
                    >
                        Registrarse!
                    </StyledButton>
                </StyledButtonBoxLogin>
            </StyledPreBox>
        </StyledBoxLogin>
    );
};
