import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { UserContext } from "../Contexto/UserContext";
import { Loading } from "../OtrosComponentes/Loading";
import { errorAlert, loginAlert } from "../Alerts/SweetAlert";
import { types } from "../../types/types";
import { loginUri } from "../../utils/UrlUtils";
import { Button, Checkbox, Form, Input } from "antd";
import { ReactComponent as SevenBIcon } from "./sevenb2.svg";

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
    //justify-content: space-between;
    margin-left: 20px;
`;

const StyledButton = styled.div`
    cursor: pointer;
    /* margin: 0 20px 0 0; */
    color: #2a00e1;
    border-radius: 9px;
    //margin-left: -3px;
    
   
    
    
    
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
        .ant-form-item-control-input-content{
            border-radius:9px;
            padding: 8px 15px;
        }
        .ant-input{
            border-radius:9px;
            padding: 9px 15px;
            
        }
        .ant-input-affix-wrapper{
            padding: 2px 11px;
        }
        .ant-input-affix-wrapper.ant-input-password{
            border-radius:9px;
            //padding: 0px
            padding-left: 0px;
            
        }

    }
    .ant-btn.ant-btn-primary{
        border-radius: 9px;
        width:90%;
        height: 45px;
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
                <SevenBIcon fill="#23649d" width={"300px"} height={"100px"} />

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
                        //label="Usuario"
                        
                        name="username"
                        
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingrese su usuario...",
                            },
                        ]}
                    >
                        <Input placeholder="Usuario"/>
                    </Form.Item>

                    <Form.Item
                        //label="Contraseña"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingrese su contraseña...",
                            },
                        ]}
                    >
                        <Input.Password  placeholder="Contraseña"/>
                    </Form.Item>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Button type="primary" htmlType="submit">
                            Iniciar sesión
                        </Button>
                    </div>
                </StyledForm>

                <StyledButtonBoxLogin>
                    <StyledButton style={{ marginRight: "11px" }}>
                    <a href="">¿Olvidaste tu contraseña?</a> 
                    </StyledButton>
                    <StyledButton style={{ marginLeft: "12px" }}>
                    <a href="">Registrarse</a> 
                        
                    </StyledButton>
                </StyledButtonBoxLogin>
            </StyledPreBox>
        </StyledBoxLogin>
    );
};
