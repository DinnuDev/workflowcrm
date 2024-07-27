import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Card, List, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const SavedFlows = () => {
  const [flows, setFlows] = useState([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedLinkedFlows, setSelectedLinkedFlows] = useState([]);
  const [availableFlows, setAvailableFlows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFlows = JSON.parse(localStorage.getItem("flows")) || [];
    setFlows(savedFlows);
  }, []);

  const deleteFlow = (index) => {
    const newFlows = flows.filter((_, i) => i !== index);
    localStorage.setItem("flows", JSON.stringify(newFlows));
    setFlows(newFlows);
  };

  const confirmEditFlow = (index) => {
    setSelectedFlow(flows[index]);
    setIsEditModalVisible(true);
  };

  const editFlow = () => {
    navigate("/createflow", { state: { flowData: selectedFlow } });
  };

  const viewFlow = (index) => {
    setSelectedFlow(flows[index]);
    setIsViewModalVisible(true);
  };

  const openLinkModal = (index) => {
    const currentFlow = flows[index];
    const otherFlows = flows.filter((_, i) => i !== index);
    setSelectedFlow(currentFlow);
    setAvailableFlows(otherFlows);
    setSelectedLinkedFlows(currentFlow.linkedFlows || []);
    setIsLinkModalVisible(true);
  };

  const copyToClipboard = (data) => {
    navigator.clipboard
      .writeText(JSON.stringify(data, null, 2))
      .then(() => message.success("Copied to clipboard!"))
      .catch(() => message.error("Failed to copy!"));
  };

  const exportToJson = (data) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name || "flow"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportToXml = (data) => {
    const jsonToXml = (json) => {
      let xml = "<flow>";
      for (let prop in json) {
        xml +=
          json[prop] instanceof Array
            ? json[prop]
                .map((item) => `<${prop}>${jsonToXml(item)}</${prop}>`)
                .join("")
            : `<${prop}>${
                typeof json[prop] === "object"
                  ? jsonToXml(json[prop])
                  : json[prop]
              }</${prop}>`;
      }
      xml += "</flow>";
      return xml;
    };

    const xmlStr = jsonToXml(data);
    const blob = new Blob([xmlStr], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name || "flow"}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const saveLinkedFlows = () => {
    const updatedFlow = { ...selectedFlow, linkedFlows: selectedLinkedFlows };
    const updatedFlows = flows.map((flow) =>
      flow === selectedFlow ? updatedFlow : flow
    );
    setFlows(updatedFlows);
    localStorage.setItem("flows", JSON.stringify(updatedFlows));
    setSelectedFlow(updatedFlow);
    setIsLinkModalVisible(false);
    message.success("Flows linked successfully!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Saved Flows</h2>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={flows}
        renderItem={(flow, index) => (
          <List.Item>
            <Card
              title={flow.name || `Flow ${index + 1}`}
              actions={[
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => viewFlow(index)}
                />,
                <Button
                  icon={<EditOutlined />}
                  onClick={() => confirmEditFlow(index)}
                />,
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => deleteFlow(index)}
                />,
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => openLinkModal(index)}
                />,
              ]}
            >
              {flow.name || `Flow ${index + 1}`}
              {flow.linkedFlows && flow.linkedFlows.length > 0 && (
                <div>
                  <h4>Linked Flows:</h4>
                  <ul>
                    {flow.linkedFlows.map((linkedFlowName) => (
                      <li key={linkedFlowName}>{linkedFlowName}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="View Flow"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button
            type="text"
            key="copy"
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(selectedFlow)}
          >
            Copy to Clipboard
          </Button>,
          <Button
            type="text"
            key="json"
            icon={<FileTextOutlined />}
            onClick={() => exportToJson(selectedFlow)}
          >
            Export to JSON
          </Button>,
          <Button
            type="text"
            key="xml"
            icon={<FileTextOutlined />}
            onClick={() => exportToXml(selectedFlow)}
          >
            Export to XML
          </Button>,
          <Button key="cancel" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <pre>{JSON.stringify(selectedFlow, null, 2)}</pre>
        </div>
      </Modal>

      <Modal
        title="Edit Flow"
        open={isEditModalVisible}
        onOk={editFlow}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Load Flow"
        cancelText="Cancel"
      >
        <p>Load this flow into the editor to make changes?</p>
      </Modal>

      <Modal
        title="Link Flows"
        open={isLinkModalVisible}
        onOk={saveLinkedFlows}
        onCancel={() => setIsLinkModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select flows"
          onChange={(value) => setSelectedLinkedFlows(value)}
          value={selectedLinkedFlows}
        >
          {availableFlows.map((flow) => (
            <Option key={flow.name} value={flow.name}>
              {flow.name || `Flow ${flows.indexOf(flow) + 1}`}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default SavedFlows;
