import { DeleteOutlined } from "@ant-design/icons";
import { Handle, Position } from "@xyflow/react";
import { Button, Space } from "antd";
import React from "react";

const nodeStyle = {
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const ActionNode = ({ id, data }) => {
  return (
    <div style={nodeStyle}>
      <Space align="baseline" direction="horizontal">
        <span>Action</span>
        <Button
          type="text"
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => data.onDelete(id)}
        />
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </Space>
    </div>
  );
};

export default ActionNode;
