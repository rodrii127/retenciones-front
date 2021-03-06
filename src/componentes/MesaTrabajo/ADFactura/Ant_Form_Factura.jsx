import { Button, Form, Input, InputNumber, Select } from 'antd';
import React from 'react';
import 'antd/dist/antd.css';


const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
  required: 'El campo ${label} es obligatorio!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
/* eslint-enable no-template-curly-in-string */

const Ant_Form_Factura = ( props ) => {

  const onFinish = (values) => {

    console.log(values)
    
    

  };

  return (
    <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
      <Form.Item
        name={['user', 'Razón Social']}
        label="Razón Social"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={['user', 'CUIT']}
        label="CUIT"
        rules={[
            {
              required: true
            },
            {
              pattern: new RegExp(/^([0-9]{11}|[0-9]{2}-[0-9]{8}-[0-9]{1})$/g),
              message: 'Ingrese un CUIT válido...',
            }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={['user', 'Dirección']}
        label="Dirección"
        rules={[
            {
              required: true,
            },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item 
        name={['user', 'Teléfono']} 
        label="Teléfono"
        rules={[
            {
              required: true,
            },
        ]}
        >
        <Input />
      </Form.Item>
      <Form.Item 
        name={['user', 'Condición Fiscal']} 
        label="Condición Fiscal"
        rules={[
            {
              required: true,
            },
        ]}
      >
        <Select
            showSearch
            optionFilterProp="children"
        >
            
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>

        {
          props.flagFactura 
          ?
          <Button type="primary" loading>
            Guardando...
          </Button>
          :
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        }

      </Form.Item>
    </Form>
  );
};

export default Ant_Form_Factura;