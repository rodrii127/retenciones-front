import { Form, Input, InputNumber, Popconfirm, Table, Typography, Select } from 'antd';
import React, { useState } from 'react';

import 'antd/dist/antd.css';

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
          rules={ title === "CUIT" ? 
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

const Ant_Table = ( props ) => {

  const [form] = Form.useForm();
  const [data, setData] = useState(props.list);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.id);
  }

  const cancel = () => {
    setEditingKey('');
  }

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
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
        
        editable: true,
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
        
        editable: true,
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
              onClick={() => save(record.id)}
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
    <Form form={form} component={false}>
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
    </Form>
  );
};

export default Ant_Table;