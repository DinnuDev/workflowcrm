import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Handle, Position } from "@xyflow/react";
import { Button, Drawer, Form, Select, Space } from "antd";
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
};

const contentStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const ActionNode = ({ id, data }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [actions, setActions] = useState(data.actions || []);
  const [isSaved, setIsSaved] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const addAction = () => {
    setActions([...actions, { actionType: "" }]);
  };

  const handleActionChange = (index, value) => {
    const newActions = [...actions];
    newActions[index].actionType = value;
    setActions(newActions);
  };

  const handleSave = () => {
    data.onEdit(id, { actions, conditions: data.conditions || [] });
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
          <span>Actions</span>
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
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
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
          <Button type="dashed" onClick={addAction} icon={<PlusOutlined />}>
            Add Action
          </Button>
        </Form.Item>
        <Form layout="vertical">
          {actions.map((action, index) => (
            <Space
              key={index}
              style={{ display: "flex", marginBottom: 8 }}
              align="baseline"
            >
              <Form.Item>
                <Select
                  style={{ width: "200px" }}
                  placeholder="Select action"
                  value={action.actionType}
                  onChange={(value) => handleActionChange(index, value)}
                >
                  <Option value="Call Primary Phone">Call Primary Phone</Option>
                  <Option value="Call Secondary Phone">
                    Call Secondary Phone
                  </Option>
                  <Option value="Email">Email</Option>
                  <Option value="Text">Text</Option>
                </Select>
              </Form.Item>
            </Space>
          ))}
        </Form>
      </Drawer>
    </div>
  );
};

export default ActionNode;
