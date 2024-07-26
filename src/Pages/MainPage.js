import {
  BgColorsOutlined,
  PoweroffOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  ColorPicker,
  Layout,
  Menu,
  Modal,
  Popover,
  Space,
  Tooltip,
} from "antd";
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import tinycolor from "tinycolor2";
import NewDayLogo from "../assets/images/newdayLogo.png"; // Adjust path as needed
import "./MainPage.css";

const { Header, Sider, Content, Footer } = Layout;

const MainPage = ({ primary, setPrimary }) => {
  const [openModal, setOpenModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const hideModal = () => {
    setOpenModal(false);
  };

  const getMenuKeyFromPath = (path) => {
    switch (path) {
      case "/createflow":
        return "createflow";
      case "/savedflows":
        return "savedflows";
      default:
        return "";
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="vertical"
          selectedKeys={[getMenuKeyFromPath(location.pathname)]}
          items={[
            {
              key: "createflow",
              icon: <UserOutlined />,
              label: <Link to="/createflow">Create Flow</Link>,
            },
            {
              key: "savedflows",
              icon: <SaveOutlined />,
              label: <Link to="/savedflows">Saved Flows</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              alt="nd_logo"
              src={NewDayLogo}
              style={{ width: "180px", height: "40px", marginRight: "16px" }}
            />
          </div>
          <Space>
            <Tooltip title="Theme" color={primary} placement="bottom">
              <Popover
                placement="left"
                trigger="click"
                content={
                  <ColorPicker
                    showText
                    value={primary}
                    onChangeComplete={(color) =>
                      setPrimary(color.toHexString())
                    }
                  />
                }
              >
                <Button
                  type="link"
                  icon={
                    <BgColorsOutlined
                      style={{
                        color: tinycolor(primary)
                          .lighten(10)
                          .desaturate()
                          .toHexString(),
                      }}
                    />
                  }
                />
              </Popover>
            </Tooltip>
            <Tooltip title="Logout" color={primary} placement="bottom">
              <Button
                type="link"
                icon={
                  <PoweroffOutlined
                    style={{
                      color: tinycolor(primary)
                        .lighten(10)
                        .desaturate()
                        .toHexString(),
                    }}
                  />
                }
                onClick={() => setOpenModal(true)}
              />
            </Tooltip>
          </Space>
        </Header>

        <Content
          className="custom-scrollbar"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Content>
        <Footer className="custom-footer" style={{ textAlign: "center" }}>
          {`Powered by NewDay USA ${new Date().getFullYear()}`}
        </Footer>
      </Layout>

      <Modal
        open={openModal}
        onCancel={hideModal}
        centered
        footer={
          <Space>
            <Button type="dashed" onClick={hideModal}>
              Cancel
            </Button>
            <Button type="primary">Logout</Button>
          </Space>
        }
      >
        <h3>You are about to logout</h3>
      </Modal>
    </Layout>
  );
};

export default MainPage;
