import { Button, Space } from "antd";
import React from "react";

const Sidebar = ({ showModal, resetFlow }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const listView = [
    {
      id: "0",
      className: "dndnode input",
      name: "Action",
      nodeType: "action",
    },
    {
      id: "1",
      className: "dndnode default",
      name: "Check",
      nodeType: "check",
    },
  ];

  const nodeStyle = {
    width: "calc(100% - 20px)",
    height: "40px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
    cursor: "pointer",
    backgroundColor: "#fff",
  };

  const sidebarStyle = {
    padding: "10px",
    width: "200px",
    backgroundColor: "#f0f0f0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "75vh",
  };

  const buttonContainerStyle = {
    marginTop: "auto",
  };

  return (
    <aside style={sidebarStyle}>
      <div>
        {listView.map((item) => (
          <div
            key={item.id}
            className={item.className}
            style={nodeStyle}
            onDragStart={(event) => onDragStart(event, item.nodeType)}
            draggable
          >
            {item.name}
          </div>
        ))}
      </div>
      <Space direction="horizontal" style={buttonContainerStyle} align="center">
        <Button onClick={showModal} style={{ marginBottom: "10px" }}>
          Save Flow
        </Button>
        <Button onClick={resetFlow} style={{ marginBottom: "10px" }}>
          Add New
        </Button>
      </Space>
    </aside>
  );
};

export default Sidebar;
