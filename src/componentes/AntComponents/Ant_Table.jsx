import { Form, Input, InputNumber, Popconfirm, Table, Typography, Select } from 'antd';
import React, { useState } from 'react';

import 'antd/dist/antd.css';
import Ant_Input_Search from './Ant_Input_Search';

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
                        {
                            fiscalConditionList.map( element =>{
                                return <Option key={ element.id } value={ element.name }> { element.name } </Option>
                            } )
                        }
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
  const [data, setData] = useState(props.lista);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
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
      title: 'Razón Social',
      dataIndex: 'razon_social',
      width: '25%',
      editable: true,
    },
    {
      title: 'CUIT',
      dataIndex: 'cuit',
      width: '15%',
      editable: true,
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      width: '20%',
      editable: true,
    },
    {
        title: 'Teléfono',
        dataIndex: 'telefono',
        width: '10%',
        editable: true,
    },
    {
        title: 'Condición Fiscal',
        dataIndex: 'condicion_fiscal',
        width: '10%',
        editable: true,
    },
    
    {
      title: 'Operación',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
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
      />
    </Form>
  );
};

export default Ant_Table;