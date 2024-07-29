import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Handle, Position } from "@xyflow/react";
import {
  Button,
  Drawer,
  Form,
  Input,
  Popover,
  Segmented,
  Select,
  Space,
} from "antd";
import React, { useState } from "react";

const { Option } = Select;

const nodeStyle = {
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  backgroundColor: "#e6f7ff",
  border: "1px solid #ddd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "150px",
  height: "150px",
  transform: "rotate(45deg)",
};

const contentStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: "rotate(-45deg)",
  width: "100%",
  height: "100%",
  flexDirection: "column",
};

const CheckNode = ({ id, data }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [conditions, setConditions] = useState(data.conditions || []);
  const [validation, setValidation] = useState(
    data.validation || { field: "" }
  );
  const [selectedSegment, setSelectedSegment] = useState("Statement");
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

  const handleValidationChange = (value) => {
    setValidation({ field: value });
  };

  const handleSave = () => {
    if (typeof data.onEdit === "function") {
      if (selectedSegment === "Conditions") {
        data.onEdit(id, { conditions });
      } else {
        data.onEdit(id, { validation });
      }
    } else {
      console.error("data.onEdit is not a function");
    }
    setIsSaved(true);
    closeDrawer();
  };

  const getAvailableValidationOptions = () => {
    return ["is valid state", "is valid license", "is valid SSN number"];
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
          ? "0 5px 15px rgba(0, 255, 0, 0.25)"
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
        <Space align="baseline" direction="vertical">
          <Segmented
            options={["Statement", "Code"]}
            value={selectedSegment}
            onChange={(value) => setSelectedSegment(value)}
          />
          {selectedSegment === "Statement" ? (
            <>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={addCondition}
                  icon={<PlusOutlined />}
                >
                  Add Statement
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
            </>
          ) : (
            <Form layout="vertical">
              <Form.Item style={{ width: "150px" }}>
                <Select
                  placeholder="Code"
                  value={validation.field}
                  onChange={handleValidationChange}
                >
                  {getAvailableValidationOptions().map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          )}
        </Space>
      </Drawer>
    </div>
  );
};

export default CheckNode;
