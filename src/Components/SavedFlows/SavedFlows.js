import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, List, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SavedFlows = () => {
  const [flows, setFlows] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const editFlow = (index) => {
    setSelectedFlow(flows[index]);
    setIsModalVisible(true);
  };

  const loadFlow = () => {
    navigate("/createflow", { state: { flowData: selectedFlow } });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Saved Flows</h2>
      <List
        bordered
        dataSource={flows}
        renderItem={(flow, index) => (
          <List.Item
            actions={[
              <Button
                icon={<EditOutlined />}
                onClick={() => editFlow(index)}
              />,
              <Button
                icon={<DeleteOutlined />}
                onClick={() => deleteFlow(index)}
              />,
            ]}
          >
            {`Flow ${index + 1}`}
          </List.Item>
        )}
      />

      <Modal
        title="Edit Flow"
        visible={isModalVisible}
        onOk={loadFlow}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Load this flow into the editor to make changes?</p>
      </Modal>
    </div>
  );
};

export default SavedFlows;
