import { 
  Button, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  DatePicker,
  ConfigProvider,
  Checkbox 
} from 'antd';

import locale from 'antd/es/locale/es_ES';

import React, { useState } from 'react';
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


/* const items = [

  getItem('Facturas', '1', <BarcodeOutlined />),
  getItem('Proveedores', '2', <UsergroupAddOutlined />),
  getItem('Orden de Pago', 'sub1', <FileDoneOutlined />, [
      getItem('Generar Orden de Pago', '3', <DownloadOutlined />)
  ]),
  getItem('Retenciones', 'sub2', <ReadOutlined />, [
      getItem('Exportar Retenciones', '4', <DownloadOutlined />)


  ]),
  getItem('Cerrar Sesión', '9', <ImportOutlined />),
] */
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

  const [flagMunicipalidad, setFlagMunicipalidad] = useState(false)
  const [flagIIBB, setFlagIIBB] = useState(false)

  return (
    <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>

      <Form.Item 
          name={['user', 'proveedor']} 
          label="Proveedor"
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
              props.list.map( element =>{
                  return <Option key={ element.id } value={ element.name }> { element.name } </Option>
              } )
          }
        </Select>
      </Form.Item>

      <Form.Item
        name={['user', 'Fecha']}
        label="Fecha"
        rules={[
          {
            required: true,
          },
        ]}
      >

        <ConfigProvider locale={locale}>
          <DatePicker locale={locale}/>
        </ConfigProvider>

      </Form.Item>

      <Form.Item
        name={['user', 'punto_venta']}
        label="Punto de Venta"
        rules={[
            {
              required: true,
            },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item 
        name={['user', 'numero']} 
        label="Número"
        rules={[
            {
              required: true,
            },
        ]}
        >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name={['user', 'grabado']}
        label="Grabado"
        rules={[
            {
              required: true
            }
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name={['user', 'exento']}
        label="Exento"
        rules={[
            {
              required: false
            }
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name={['user', 'iva105']}
        label="Iva 105"
        rules={[
            {
              required: false
            }
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name={['user', 'iva21']}
        label="Iva 21"
        rules={[
            {
              required: false
            }
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name={['user', 'otros_impuestos']}
        label="Otros Impuestos"
        rules={[
            {
              required: false
            }
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name={['user', 'municipalidad']}
        label="Municipalidad"
        rules={[
            {
              required: false
            }
        ]}
      >
        <InputNumber readOnly={true} disabled={ !flagMunicipalidad } />
        <Checkbox style={{ marginLeft: "5px" }} onChange={ () => setFlagMunicipalidad( !flagMunicipalidad ) } ></Checkbox>
      </Form.Item>

      <Form.Item
        name={['user', 'iibb']}
        label="IIBB"
        rules={[
            {
              required: false
            }
        ]}
      >
        <InputNumber readOnly={true} disabled={ !flagIIBB } />
        <Checkbox style={{ marginLeft: "5px" }} onChange={ () => setFlagIIBB( !flagIIBB ) } ></Checkbox>
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