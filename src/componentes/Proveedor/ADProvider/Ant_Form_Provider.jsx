import { Button, Checkbox, Form, Input, Select } from 'antd';
import React from 'react';

const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};


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


const Ant_Form = (props) => {

  const [form] = Form.useForm()

  const onFinish = (values) => {
    console.log(values)
    props.postProveedor(values)
    form.resetFields()
  };

  const onAgreementCheck = () => {
    const user = form.getFieldValue('user')
    user.convenio_multilateral = !user.convenio_multilateral
    form.setFieldsValue({ user: user })
  }

  const onIibbExemptCheck = () => {
    const user = form.getFieldValue('user')
    user.exento_iibb = !user.exento_iibb
    form.setFieldsValue({ user: user })
  }

  const onMunicipalityExemptCheck = () => {
    const user = form.getFieldValue('user')
    user.exento_municipalidad = !user.exento_municipalidad
    form.setFieldsValue({ user: user })
  }

  const initValues = {
    "user": {
      "convenio_multilateral": false,
      "exento_municipalidad": false,
      "exento_iibb": false
    }
  }

  return (
    <Form {...layout} name="nest-messages" onFinish={onFinish} form={form} validateMessages={validateMessages} initialValues={initValues}>
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
          {
            props.list.map(element => {
              return <Option key={element.id} value={element.name}> {element.name} </Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        name={['user', 'convenio_multilateral']}
        label="Convenio Multilateral"
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Checkbox style={{ marginLeft: "5px" }} onChange={() => onAgreementCheck()}></Checkbox>
      </Form.Item>
      <Form.Item
        name={['user', 'exento_iibb']}
        label="Exento en IIBB"
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Checkbox style={{ marginLeft: "5px" }} onChange={() => onIibbExemptCheck()}></Checkbox>
      </Form.Item>
      <Form.Item
        name={['user', 'exento_municipalidad']}
        label="Exento en Municipalidad"
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Checkbox style={{ marginLeft: "5px" }} onChange={() => onMunicipalityExemptCheck()}></Checkbox>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>

        {
          props.flagSave
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

export default Ant_Form;