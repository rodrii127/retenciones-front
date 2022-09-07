import { Proveedor } from "../../Proveedor/Proveedor";
import { NuevaFactura } from "../../Factura/NuevaFactura";
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
    UsergroupDeleteOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu } from 'antd';
import React, { useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom'
import { confirmForm } from "../../Alerts/SweetAlert";
import { VerFacturas } from "../../Factura/VerFacturas";
import { getCompanyName } from "../../../utils/TokenUtils";


const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const Ant_Main_Menu = (props) => {

    const items = [
        getItem(getCompanyName(props.user.token), '0', <UsergroupDeleteOutlined />),
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

    const [collapsed, setCollapsed] = useState(false);

    const [selection, setSelection] = useState(props.selection)

    const { dispatch } = useContext(UserContext)

    const navigate = useNavigate();

    const onClick = (e) => {

        setSelection(e.key)

    }

    const handleLogout = () => {
        confirmForm(dispatch, navigate);
    }

    const selectContainer = () => {

        let component = <Proveedor />

        switch (selection) {
            case "1":
                component = <NuevaFactura />
                break;
            case "2":
                component = <VerFacturas />
                break;
            case "3":
                component = <Proveedor />
                break;
            case "4":
                component = <OrdenPago />
                break;
            case "5":
                component = <Retenciones />
                break;
            case "9":
                handleLogout()
                break;
            default:
                break;
        }

        return component

    }

    const getBreadCrumb = () => {

        let breadArray = []

        switch (selection) {
            case "1":
                breadArray.push("Facturas", "Nueva Factura")
                break;
            case "2":
                breadArray.push("Facturas", "Ver Facturas")
                break;
            case "3":
                breadArray.push("Proveedores")
                break;
            case "4":
                breadArray.push("Orden de Pago", "Generar Orden de Pago")
                break;
            case "5":
                breadArray.push("Retenciones", "Exportar Retenciones")
                break;
            case "9":
                handleLogout()
                break;
            default:
                break;
        }

        return breadArray

    }

    return (
        <Layout style={{ minHeight: '100vh' }} >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logo"></div>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={[selection]}
                    defaultOpenKeys={[props.subSelection ? props.subSelection : ""]}
                    mode="inline"
                    items={items}
                    onClick={onClick}
                />
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0, color: 'aliceblue', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '200%' }}>{getCompanyName(props.user.token)}</div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }} >
                        {
                            getBreadCrumb().map(element => {
                                return <Breadcrumb.Item key={element}> {element} </Breadcrumb.Item>
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
                <Footer style={{ textAlign: 'center', }}>
                    Sistemas de Retenciones - SevenB SRL
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Ant_Main_Menu;