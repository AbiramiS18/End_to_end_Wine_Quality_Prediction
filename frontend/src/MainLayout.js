import React, { useEffect, useState } from "react";
import { Layout, Menu, Typography } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChartOutlined,
  FormOutlined,
  MenuOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const validPaths = ["/", "/prediction", "/dashboard"];
    if (!validPaths.includes(location.pathname)) {
      navigate("/", { replace: true });
    }
  }, []);

  const getTitle = () => {
    switch (location.pathname) {
      case "/prediction":
        return "PredictForm";
      case "/dashboard":
        return "Exploratory Data Analysis";
      default:
        return "Wine Quality Prediction";
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={200}
        style={{
          background: "#001529",
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            height: 64,
            borderBottom: "1px solid #444",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {!collapsed ? (
            <>
              <span
                onClick={() => navigate("/")}
                style={{
                  flex: 1,
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "white",
                  textAlign: "left",
                }}
              >
                Menu
              </span>
              <MenuOutlined
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "18px",
                  color: "white",
                  cursor: "pointer",
                }}
              />
            </>
          ) : (
            <MenuOutlined
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "18px",
                color: "white",
                margin: "0 auto",
                cursor: "pointer",
              }}
            />
          )}
        </div>

        {/* Sidebar Menu */}
        <div style={{ flex: 1 }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
            items={[
              {
                key: "/prediction",
                icon: <FormOutlined />,
                label: "Prediction",
              },
              {
                key: "/dashboard",
                icon: <BarChartOutlined />,
                label: "Dashboard",
              },
            ]}
            style={{ borderRight: 0, height: "100%" }}
          />
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
          overflowX: "hidden",
        }}
      >
        <Header style={{ background: "#fff", padding: "0 24px", height: 64 }}>
          <Typography.Title
            level={2}
            style={{ margin: 0, textAlign: "center", lineHeight: "64px" }}
          >
            {getTitle()}
          </Typography.Title>
        </Header>

        <Content
          style={{
            padding: "24px",
            height: "100%",
            background: "#fff",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
