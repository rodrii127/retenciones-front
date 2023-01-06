import { Button, Checkbox, Form, Input, Select } from "antd";
import React from "react";
import styled from "styled-components";

const { Option } = Select;

const StyledFormItem = styled(Form.Item)`
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin-bottom: 5px;
    .ant-form-item-label {
        display: flex;
    }
`;

const validateMessages = {
    required: "El campo ${label} es obligatorio!",
    types: {
        email: "${label} is not a valid email!",
        number: "${label} is not a valid number!",
    },
    number: {
        range: "${label} must be between ${min} and ${max}",
    },
};

const Ant_Form = (props) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values);
        props.postProveedor(values);
        props.setIsModalOpen(false);
        form.resetFields();
    };

    const onAgreementCheck = () => {
        const user = form.getFieldValue("user");
        user.convenio_multilateral = !user.convenio_multilateral;
        form.setFieldsValue({ user: user });
    };

    const onIibbExemptCheck = () => {
        const user = form.getFieldValue("user");
        user.exento_iibb = !user.exento_iibb;
        form.setFieldsValue({ user: user });
    };

    const onMunicipalityExemptCheck = () => {
        const user = form.getFieldValue("user");
        user.exento_municipalidad = !user.exento_municipalidad;
        form.setFieldsValue({ user: user });
    };

    const initValues = {
        user: {
            convenio_multilateral: false,
            exento_municipalidad: false,
            exento_iibb: false,
        },
    };

    return (
        <Form
            onFinish={onFinish}
            form={form}
            validateMessages={validateMessages}
            initialValues={initValues}
        >
            <StyledFormItem
                name={["user", "Razón Social"]}
                label="Razón Social"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </StyledFormItem>
            <StyledFormItem
                name={["user", "CUIT"]}
                label="CUIT"
                rules={[
                    {
                        required: true,
                    },
                    {
                        pattern: new RegExp(
                            /^([0-9]{11}|[0-9]{2}-[0-9]{8}-[0-9]{1})$/g
                        ),
                        message: "Ingrese un CUIT válido...",
                    },
                ]}
            >
                <Input />
            </StyledFormItem>
            <StyledFormItem
                name={["user", "Dirección"]}
                label="Dirección"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </StyledFormItem>
            <StyledFormItem
                name={["user", "Teléfono"]}
                label="Teléfono"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </StyledFormItem>
            <StyledFormItem
                name={["user", "Condición Fiscal"]}
                label="Condición Fiscal"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select showSearch optionFilterProp="children">
                    {props.list.map((element) => {
                        return (
                            <Option key={element.id} value={element.name}>
                                {" "}
                                {element.name}{" "}
                            </Option>
                        );
                    })}
                </Select>
            </StyledFormItem>
            <Form.Item
                name={["user", "convenio_multilateral"]}
                label="Convenio Multilateral"
                rules={[
                    {
                        required: false,
                    },
                ]}
            >
                <Checkbox
                    style={{ marginLeft: "5px" }}
                    onChange={() => onAgreementCheck()}
                ></Checkbox>
            </Form.Item>
            <Form.Item
                name={["user", "exento_iibb"]}
                label="Exento en IIBB"
                rules={[
                    {
                        required: false,
                    },
                ]}
            >
                <Checkbox
                    style={{ marginLeft: "5px" }}
                    onChange={() => onIibbExemptCheck()}
                ></Checkbox>
            </Form.Item>
            <Form.Item
                name={["user", "exento_municipalidad"]}
                label="Exento en Municipalidad"
                rules={[
                    {
                        required: false,
                    },
                ]}
            >
                <Checkbox
                    style={{ marginLeft: "5px" }}
                    onChange={() => onMunicipalityExemptCheck()}
                ></Checkbox>
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "center" }}>
                {props.flagSave ? (
                    <Button type="primary" loading>
                        Guardando...
                    </Button>
                ) : (
                    <Button type="primary" htmlType="submit">
                        Guardar
                    </Button>
                )}
            </div>
        </Form>
    );
};

export default Ant_Form;
