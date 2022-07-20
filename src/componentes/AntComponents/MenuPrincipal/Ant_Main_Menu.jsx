import { Proveedor } from "../../Proveedor/Proveedor";
import { Factura } from "../../Factura/Factura";
import { OrdenPago } from "../../OrdenPago/OrdenPago";
import { Retenciones } from "../../Retenciones/Retenciones";
import { UserContext } from "../../Contexto/UserContext";


import "./Ant_Main_Menu.scss"
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu } from 'antd';
import React, { useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom'
import { confirmForm } from "../../Alerts/SweetAlert";


const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
  
const items = [
    getItem('Facturas', 'sub1', <PieChartOutlined />, [
        getItem('Nueva Factura', '1'),
        getItem('Ver Facturas', '2'),
    ]),
    getItem('Proveedores', '3', <DesktopOutlined />),
    getItem('Orden de Pago', 'sub2', <UserOutlined />, [
        getItem('Generar Orden de Pago', '4')
    ]),
    getItem('Retenciones', 'sub3', <TeamOutlined />, [
        getItem('Exportar Retenciones', '5')
    ]),
    getItem('Cerrar Sesión', '9', <FileOutlined />),
]
  
const Ant_Main_Menu = () => {

    const [collapsed, setCollapsed] = useState( false );

    const [selection, setSelection] = useState( 2 )

    const { dispatch } = useContext(UserContext)
    
    const navigate = useNavigate();

    const onClick = (e) => {

        console.log('click ', e)
        setSelection( Number( e.key ) )

    }

    const handleLogout = () => {
        confirmForm(dispatch, navigate);
    }

    const selectContainer = () =>{

        let component = <Proveedor/>

        switch (selection) {
            case 1:
                component = <Factura/>
                break;
            case 3:
                component = <Proveedor/>
                break;
            case 4:
                component = <OrdenPago/>
                break;
            case 5:
                component = <Retenciones/>
                break;
            case 9:
                handleLogout()
                break;
            default:
                break;
        }

        return component

    }

    const getBreadCrumb = () =>{

        let breadArray = []

        switch (selection) {
            case 1:
                breadArray.push( "Facturas", "Nueva Factura" )
                break;
            case 2:
                breadArray.push( "Facturas", "Ver Facturas" )
                break;
            case 3:
                breadArray.push( "Proveedores" )
                break;
            case 4:
                breadArray.push( "Orden de Pago", "Generar Orden de Pago" )
                break;
            case 5:
                breadArray.push( "Retenciones", "Exportar Retenciones" )
                break;
            case 9:
                handleLogout()
                break;
            default:
                break;
        }

        return breadArray
                    

    }

    return (
        <Layout
        style={{
            minHeight: '100vh',
        }}
        >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div className="logo" />
            <Menu 
            theme="dark" 
            defaultSelectedKeys={['1']} 
            mode="inline" 
            items={items} 
            onClick={ onClick }
        />
        </Sider>
        <Layout className="site-layout">
            <Header
            className="site-layout-background"
            style={{
                padding: 0,
            }}
            />
            <Content
                style={{
                    margin: '0 16px',
                }}
            >
                <Breadcrumb
                    style={{
                    margin: '16px 0',
                    }}
                >
                    {
                        getBreadCrumb().map( element => {
                            return <Breadcrumb.Item> { element } </Breadcrumb.Item>
                        })
                    }
                </Breadcrumb>
                <div
                    className="site-layout-background"
                    style={{
                        padding: "20px",
                        minHeight: 360,
                    }}
                >
                    { 
                        selectContainer()
                    }
                </div>
            </Content>
            <Footer
            style={{
                textAlign: 'center',
            }}
            >
            Sistemas de Retenciones - SevenB SRL
            </Footer>
        </Layout>
        </Layout>
    );
};

export default Ant_Main_Menu;