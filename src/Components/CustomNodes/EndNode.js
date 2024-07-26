import { DeleteOutlined } from "@ant-design/icons";
import { Handle, Position } from "@xyflow/react";
import { Button, Space } from "antd";
import React from "react";

const ellipticalNodeStyle = {
  padding: "10px",
  borderRadius: "50%",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  width: "150px",
  height: "75px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
};

const EndNode = ({ id, data }) => {
  return (
    <div style={ellipticalNodeStyle}>
      <Space align="baseline" direction="horizontal">
        <span>End</span>
        <Button
          type="text"
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => data.onDelete(id)}
          style={{ position: "absolute", top: "5px", right: "5px" }}
        />
      </Space>
      <Handle type="target" position={Position.Top} style={{ top: "0px" }} />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ bottom: "0px" }}
      />
    </div>
  );
};

export default EndNode;
