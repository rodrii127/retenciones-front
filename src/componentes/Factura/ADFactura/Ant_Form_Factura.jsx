import {
  Button,
  Form,
  InputNumber,
  Select,
  DatePicker,
  ConfigProvider,
  Checkbox,
  Row,
  Col
} from 'antd';

import locale from 'antd/es/locale/es_ES';

import React, { useContext, useState } from 'react';

import { UserContext } from '../../Contexto/UserContext';
import { errorAlert, procesoExitoso } from '../../Alerts/SweetAlert';
import { invoiceUri } from '../../../utils/UrlUtils';

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


const Ant_Form_Factura = (props) => {

  const { user } = useContext(UserContext)
  const [flagMunicipalidad, setFlagMunicipalidad] = useState(false)
  const [flagIIBB, setFlagIIBB] = useState(false)
  const [flagCargando, setFlagCargando] = useState(false)

  const [form] = Form.useForm()

  const onFinish = (values) => {
    setFlagCargando(true)

    let body = {
      "pointSale": values.user.punto_venta,
      "number": values.user.numero,
      "provider": values.user.proveedor,
      "engraved": values.user.grabado,
      "exempt": values.user.exento ? values.user.exento : 0,
      "iva105": values.user.iva105 ? values.user.iva105 : 0,
      "iva21": values.user.iva21 ? values.user.iva21 : 0,
      "iibb": values.user.iibb_value ? values.user.iibb_value : 0,
      "taxedOthers": values.user.otros_impuestos ? values.user.otros_impuestos : 0,
      "municipality": values.user.municipalidad_value ? values.user.municipalidad_value : 0,
      "impacted": false,
      "date": values.user.Fecha.format('YYYY-MM-DD')
    }

    console.log(body)

    fetch(invoiceUri, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(res => {
        setFlagCargando(false)

        if (res.error) {
          if (res.status === 400) {
            errorAlert('FACTURA DUPLICADA.')
            return
          }
        }

        procesoExitoso()
        form.resetFields()
        setFlagIIBB(false)
        setFlagMunicipalidad(false)
      }).catch(err => {
        console.log(err)
        errorAlert('Ups, ocurrió un error inesperado...')
        setFlagCargando(false)
      })
  };

  const handleTotal = (_, values) => {
    const userCopy = values.user
    const total = (userCopy.exento ? userCopy.exento : 0) +
      (userCopy.grabado ? userCopy.grabado : 0) +
      (userCopy.iibb_value ? Number(userCopy.iibb_value) : 0) +
      (userCopy.iva21 ? userCopy.iva21 : 0) +
      (userCopy.iva105 ? userCopy.iva105 : 0) +
      (userCopy.municipalidad_value ? Number(userCopy.municipalidad_value) : 0) +
      (userCopy.otros_impuestos ? userCopy.otros_impuestos : 0)
    userCopy.total = total
    form.setFieldsValue({ user: userCopy })
  }

  const onMunicipalityCheck = () => {
    setFlagMunicipalidad(!flagMunicipalidad)
    const user = form.getFieldValue('user')
    let municipalityValue = user.municipalidad_value
    if (!flagMunicipalidad) {
      municipalityValue = user.grabado ? Number(user.grabado * 0.008).toFixed(2) : 0
      user.municipalidad_value = municipalityValue
    } else {
      user.municipalidad_value = undefined
    }
    user.total = flagMunicipalidad ? (Number(user.total) - Number(municipalityValue)) : (Number(user.total) + Number(municipalityValue))
    form.setFieldsValue({ user: user })
  }

  const onIibbCheck = () => {
    setFlagIIBB(!flagIIBB)
    const user = form.getFieldValue('user')
    let iibbValue = user.iibb_value
    if (!flagIIBB) {
      iibbValue = user.grabado ? Number(user.grabado * 0.0331).toFixed(2) : 0
      user.iibb_value = iibbValue
    } else {
      user.iibb_value = undefined
    }
    user.total = Number(flagIIBB ? (Number(user.total) - Number(iibbValue)) : (Number(user.total) + Number(iibbValue))).toFixed(2)
    form.setFieldsValue({ user: user })
  }

  return (
    <Form {...layout} name="nest-messages" form={form} onFinish={onFinish} onValuesChange={handleTotal} validateMessages={validateMessages}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}>

      <Row>
        <Col span={12}>
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
              style={{ width: '60%' }}
            >
              {
                props.list.map(element => {
                  return <Option key={element.id} value={element.id}> {element.name} </Option>
                })
              }
            </Select>
          </Form.Item>

          <ConfigProvider locale={locale}>
            <Form.Item
              name={['user', 'Fecha']}
              label="Fecha"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker locale={locale} style={{ width: '60%' }} />
            </Form.Item>
          </ConfigProvider>

          <Form.Item
            name={['user', 'punto_venta']}
            label="Punto de Venta"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber style={{ width: '60%' }} />
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
            <InputNumber style={{ width: '60%' }} />
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
            <InputNumber style={{ width: '60%' }} />
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
            <InputNumber style={{ width: '60%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name={['user', 'iva105']}
            label="Iva 105"
            rules={[
              {
                required: false
              }
            ]}
          >
            <InputNumber style={{ width: '60%' }} />
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
            <InputNumber style={{ width: '60%' }} />
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
            <InputNumber style={{ width: '60%' }} />
          </Form.Item>

          <Form.Item label="Municipalidad" style={{ marginBottom: 0 }}>
            <Form.Item
              name={['user', 'municipalidad_value']}
              style={{ display: 'inline-block' }}
              rules={[
                {
                  required: false
                }
              ]}
            >
              <InputNumber disabled={!flagMunicipalidad} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name={['user', 'municipalidad_checkbox']}
              style={{ display: 'inline-block' }}
              rules={[
                {
                  required: false
                }
              ]}
            >
              <Checkbox style={{ marginLeft: "5px" }} onChange={() => onMunicipalityCheck()} ></Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item label="IIBB" style={{ marginBottom: 0 }}>
            <Form.Item
              name={['user', 'iibb_value']}
              style={{ display: 'inline-block' }}
              rules={[
                {
                  required: false
                }
              ]}
            >
              <InputNumber disabled={!flagIIBB} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name={['user', 'iibb_checkbox']}
              style={{ display: 'inline-block' }}
              rules={[
                {
                  required: false
                }
              ]}
            >
              <Checkbox style={{ marginLeft: "5px" }} onChange={() => onIibbCheck()} ></Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item
            name={['user', 'total']}
            label="Total"
            rules={[
              {
                required: false
              }
            ]}
          >
            <InputNumber readOnly={true} style={{ width: '60%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item wrapperCol={{ offset: 9 }}>

        {
          flagCargando
            ?
            <Button type="primary" loading size={'large'}>
              Guardando...
            </Button>
            :
            <Button type="primary" htmlType="submit" size={'large'} style={{ width: '20%' }}>
              Guardar
            </Button>
        }

      </Form.Item>

    </Form>
  );
};

export default Ant_Form_Factura;