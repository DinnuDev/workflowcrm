import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Handle, Position } from "@xyflow/react";
import { Button, Drawer, Form, Input, Select, Space } from "antd";
import React, { useState } from "react";

const { Option } = Select;

const nodeStyle = {
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "150px",
  height: "150px", // Adjusted for square shape
  transform: "rotate(45deg)", // Rotate the square
  transformOrigin: "center", // Ensure the rotation is centered
};

const contentStyle = {
  transform: "rotate(-45deg)", // Rotate the content back to horizontal
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const CheckNode = ({ id, data }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [conditions, setConditions] = useState(data.conditions || []);
  const [isSaved, setIsSaved] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const addCondition = () => {
    setConditions([...conditions, { field: "", operator: "", value: "" }]);
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);
  };

  const handleSave = () => {
    data.onEdit(id, conditions);
    setIsSaved(true);
    closeDrawer();
  };

  return (
    <div
      style={{
        ...nodeStyle,
        boxShadow: isSaved
          ? "0 5px 15px rgba(0, 255, 0, 0.35)" // Change box shadow color to green
          : nodeStyle.boxShadow,
      }}
    >
      <div style={contentStyle}>
        <Space align="center" direction="horizontal">
          <span>Checks</span>
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={<EditOutlined />}
            onClick={showDrawer}
          />
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => data.onDelete(id)}
          />
        </Space>
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
      <Drawer
        onClose={closeDrawer}
        open={drawerVisible}
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={handleSave} type="primary">
              Save
            </Button>
          </div>
        }
      >
        <Form.Item>
          <Button type="dashed" onClick={addCondition} icon={<PlusOutlined />}>
            Add Check
          </Button>
        </Form.Item>
        <Form layout="vertical">
          {conditions.map((condition, index) => (
            <Space
              key={index}
              style={{ display: "flex", marginBottom: 8 }}
              align="baseline"
            >
              <Form.Item>
                <Select
                  style={{ width: "100px" }}
                  placeholder="Select field"
                  value={condition.field}
                  onChange={(value) =>
                    handleConditionChange(index, "field", value)
                  }
                >
                  <Option value="FICO">FICO</Option>
                  <Option value="State">State</Option>
                  <Option value="Creditscore">Credit Score</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Select
                  style={{ width: "75px" }}
                  placeholder="Select operator"
                  value={condition.operator}
                  onChange={(value) =>
                    handleConditionChange(index, "operator", value)
                  }
                >
                  <Option value="=">=</Option>
                  <Option value="&gt;">&gt;</Option>
                  <Option value="&lt;">&lt;</Option>
                  <Option value="&gt;=">&gt;=</Option>
                  <Option value="&lt;=">&lt;=</Option>
                  <Option value="and">and</Option>
                  <Option value="or">or</Option>
                  <Option value="is">is</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Input
                  style={{ width: "100px" }}
                  placeholder="Value"
                  value={condition.value}
                  onChange={(e) =>
                    handleConditionChange(index, "value", e.target.value)
                  }
                />
              </Form.Item>
            </Space>
          ))}
        </Form>
      </Drawer>
    </div>
  );
};

export default CheckNode;
