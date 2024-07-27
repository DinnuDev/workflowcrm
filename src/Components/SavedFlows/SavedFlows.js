import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Button, Card, List, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SavedFlows = () => {
  const [flows, setFlows] = useState([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState(null);
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
              ]}
            >
              {flow.name || `Flow ${index + 1}`}
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
            key="copy"
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(selectedFlow)}
          >
            Copy to Clipboard
          </Button>,
          <Button
            key="json"
            icon={<FileTextOutlined />}
            onClick={() => exportToJson(selectedFlow)}
          >
            Export to JSON
          </Button>,
          <Button
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
    </div>
  );
};

export default SavedFlows;
