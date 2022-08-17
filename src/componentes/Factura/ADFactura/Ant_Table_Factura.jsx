import { Form, Input, InputNumber, Popconfirm, Table, Typography, Select } from 'antd';
import React, { useContext, useState } from 'react';
import { invoiceUri } from '../../../utils/UrlUtils';
import { errorAlert, procesoExitoso } from '../../Alerts/SweetAlert';
import { UserContext } from '../../Contexto/UserContext';


import { Loading } from '../../OtrosComponentes/Loading';

const { Option } = Select;

const fiscalConditionList = [
  {
    'name': "RI",
    'id': 1
  },
  {
    name: "EX",
    id: 2
  },
  {
    name: "MT",
    id: 3
  }]

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {

  const inputNode = inputType === 'number'
    ?
    <InputNumber />
    :
    inputType === 'text'
      ?
      <Input />
      :
      <Select
        showSearch
        optionFilterProp="children"
      >
        {/* {
                            fiscalConditionList.map( element =>{
                                return <Option key={ element.id } value={ element.name }> { element.name } </Option>
                            } )
                        } */}
      </Select>

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={title === "CUIT" ?
            [
              {
                required: true
              },
              {
                pattern: new RegExp(/^([0-9]{11}|[0-9]{2}-[0-9]{8}-[0-9]{1})$/g),
                message: 'Ingrese un CUIT válido...',
              }
            ]

            :

            [
              {
                required: true,
                message: `Ingrese ${title}!`,
              },
            ]

          }
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Ant_Table = (props) => {

  const { user } = useContext(UserContext)
  const [form] = Form.useForm();
  const [data, setData] = useState(props.list);
  const [editingKey, setEditingKey] = useState('');
  const [flagCargando, setFlagCargando] = useState(false);

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.id);
  }

  const editInvoice = async (record, providerId, impacted, recordId) => {
    setFlagCargando(true)

    let body = {
      "pointSale": Number(record.pointSale),
      "number": Number(record.number),
      "provider": providerId,
      "engraved": Number(record.engraved),
      "exempt": Number(record.exempt),
      "iva105": Number(record.iva105),
      "iva21": Number(record.iva21),
      "iibb": Number(record.iibb),
      "taxedOthers": Number(record.taxedOthers),
      "municipality": Number(record.municipality),
      "impacted": impacted,
      "date": record.date
    }

    await fetch(invoiceUri + `/${recordId}`, {
      method: 'PUT',
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
          errorAlert('Hubo un error en la actualizacion de la factura.')
        }

        procesoExitoso()
      }).catch(err => {
        console.log(err)
        errorAlert('Ups, ocurrió un error inesperado...')
        setFlagCargando(false)
      })
  };

  const cancel = () => {
    setEditingKey('');
  }

  const save = async (record) => {
    try {
      const row = await form.validateFields();
      editInvoice(row, record.providerId, record.impacted, record.id)
      const newData = [...data];
      const index = newData.findIndex((item) => record.id === item.id);

      if (index > -1) {
        const item = newData[index];
        item.total = Number(row.engraved) + Number(row.exempt) + Number(row.iibb) + Number(row.iva21) + Number(row.iva105) + Number(row.municipality) + Number(row.taxedOthers)
        item.total = '$ ' + item.total
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'date',

      editable: true,
    },
    {
      title: 'Proveedor',
      dataIndex: 'provider',

      editable: false,
    },
    {
      title: 'Punto de Venta',
      dataIndex: 'pointSale',

      editable: true,
    },
    {
      title: 'N° Factura',
      dataIndex: 'number',

      editable: true,
    },
    {
      title: 'Grabado',
      dataIndex: 'engraved',

      editable: true,
    },
    {
      title: 'Exento',
      dataIndex: 'exempt',

      editable: true,
    },
    {
      title: 'Iva 105',
      dataIndex: 'iva105',

      editable: true,
    },
    {
      title: 'Iva 21',
      dataIndex: 'iva21',

      editable: true,
    },
    {
      title: 'IIBB',
      dataIndex: 'iibb',

      editable: true,
    },
    {
      title: 'Otros Impuestos',
      dataIndex: 'taxedOthers',

      editable: true,
    },
    {
      title: 'Municipalidad',
      dataIndex: 'municipality',

      editable: true,
    },
    {
      title: 'Total',
      dataIndex: 'total',

      editable: false,
    },
    {
      title: 'Operación',
      dataIndex: 'operation',
      fixed: 'right',
      width: 150,

      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              Guardar
            </Typography.Link>
            <Popconfirm title="Seguro desea cancelar?" onConfirm={cancel}>
              <a>Cancelar</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Editar
          </Typography.Link>
        );
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'condicion_fiscal' ? 'desplegable' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  })

  return (
    <>
      {
        flagCargando
          ? <Loading estilo={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }} ancho={"150"} />
          : <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={data}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={
                {
                  onChange: cancel,
                  pageSize: 8,
                }
              }
              scroll={{
                x: 1500,

              }}
            />
          </Form>}
    </>
  );
};

export default Ant_Table;