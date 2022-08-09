import "antd/dist/antd.css";

import React, { useState } from 'react';
import { Select } from 'antd';
const { Option } = Select;


const onChange = (value) => {
  console.log(`selected ${value}`);
};

const onSearch = (value) => {
  console.log('search:', value);
};

const Ant_Input_Search = ( props ) => {
    
    return(
            <Select
                showSearch
                placeholder={ "props.placeholder" }
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                
            >
                {/* {
                    props.list.map( element =>{
                        return <Option key={ element.id } value={ element.name }> { element.name } </Option>
                    } )
                } */}
                <Option value={ "pepe" }> { "pepe" } </Option>
            </Select>
        )
};

export default Ant_Input_Search;