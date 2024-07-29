import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Handle, Position } from "@xyflow/react";
import { Button, Drawer, Form, Input, Popover, Select, Space } from "antd";
import React, { useState } from "react";

const { Option } = Select;

const nodeStyle = {
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  backgroundColor: "#e6f7ff", // Light blue background color
  border: "1px solid #ddd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "150px",
  height: "150px", // Adjusted for square shape
  transform: "rotate(45deg)", // Rotate for rhombus shape
};

const contentStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: "rotate(-45deg)", // Counter-rotate content to make it horizontal
  width: "100%", // Ensure full width usage
  height: "100%", // Ensure full height usage
  flexDirection: "column",
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
    data.onEdit(id, { conditions, actions: data.actions || [] });
    setIsSaved(true);
    closeDrawer();
  };

  const popoverContent = (
    <div>
      {conditions.length > 0 ? (
        conditions.map((condition, index) => (
          <div key={index}>
            <strong>Field:</strong> {condition.field},
            <strong> Operator:</strong> {condition.operator},
            <strong> Value:</strong> {condition.value}
          </div>
        ))
      ) : (
        <div>Empty</div>
      )}
    </div>
  );

  return (
    <div
      style={{
        ...nodeStyle,
        boxShadow: isSaved
          ? "0 5px 15px rgba(0, 255, 0, 0.25)" // Change box shadow color to green
          : nodeStyle.boxShadow,
      }}
    >
      <div style={contentStyle}>
        <div>
          <Space align="center" direction="horizontal">
            <span>Checks</span>
          </Space>
        </div>
        <div>
          <Space align="center" direction="horizontal">
            <Popover content={popoverContent} title="Node Data">
              <Button
                type="text"
                shape="circle"
                size="small"
                icon={<EyeOutlined />}
              />
            </Popover>
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
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: "30%" }}
      >
        <span style={{ transform: "rotate(-45deg)", display: "block" }}>
          True
        </span>
      </Handle>
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: "70%" }}
      >
        <span style={{ transform: "rotate(-45deg)", display: "block" }}>
          False
        </span>
      </Handle>
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
            Add Condition
          </Button>
        </Form.Item>
        <Form layout="vertical">
          {conditions.map((condition, index) => (
            <Space
              key={index}
              style={{ display: "flex", marginBottom: 8 }}
              align="baseline"
            >
              <Form.Item style={{ width: "100px" }}>
                <Select
                  placeholder="Field"
                  value={condition.field}
                  onChange={(value) =>
                    handleConditionChange(index, "field", value)
                  }
                >
                  <Option value="FICO">FICO</Option>
                  <Option value="LTV">LTV</Option>
                  <Option value="DTI">DTI</Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ width: "150px" }}>
                <Select
                  placeholder="Operator"
                  value={condition.operator}
                  onChange={(value) =>
                    handleConditionChange(index, "operator", value)
                  }
                >
                  <Option value=">">Greater than</Option>
                  <Option value="<">Less than</Option>
                  <Option value="=">Equal to</Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ width: "70px" }}>
                <Input
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
