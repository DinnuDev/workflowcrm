import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Input, Modal, message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ActionNode from "../CustomNodes/ActionNode";
import CheckNode from "../CustomNodes/CheckNode";
import EndNode from "../CustomNodes/EndNode";
import StartNode from "../CustomNodes/StartNode";
import Sidebar from "./Sidebar";
import "./index.css";

let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  actionNode: ActionNode,
  checkNode: CheckNode,
};

const initialNodes = [
  {
    id: "startNode",
    type: "startNode",
    position: { x: 250, y: 5 },
    data: { label: "Start Node" },
  },
  {
    id: "endNode",
    type: "endNode",
    position: { x: 250, y: 400 },
    data: { label: "End Node" },
  },
];

const RootFlow = () => {
  const reactFlowWrapper = useRef(null);
  const location = useLocation();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [flowName, setFlowName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const onEditNode = useCallback(
    (nodeId, data) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...data,
                label: `Conditions: ${data.conditions
                  .map(
                    (cond) =>
                      `${cond.field} ${cond.operator
                        .replace(/&gt;/g, ">")
                        .replace(/&lt;/g, "<")} ${cond.value}`
                  )
                  .join(", ")}`,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  useEffect(() => {
    if (location.state && location.state.flowData) {
      const { nodes, edges } = location.state.flowData;
      setNodes(nodes);
      setEdges(edges);
    }
  }, [location.state, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "step",
            markerEnd: { color: "black" },
            style: {
              strokeWidth: 1,
              stroke: "black",
            },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) {
        return;
      }
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type: `${type}Node`,
        position,
        data: {
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} node`,
          onDelete: onDeleteNode,
          onEdit: onEditNode,
          conditions: [],
          actions: [],
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes, onDeleteNode, onEditNode]
  );

  const showModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleOk = useCallback(() => {
    if (flowName.trim() === "") {
      message.error("Please enter a flow name.");
      return;
    }

    const flowData = { nodes, edges, name: flowName };
    const savedFlows = JSON.parse(localStorage.getItem("flows")) || [];
    savedFlows.push(flowData);
    localStorage.setItem("flows", JSON.stringify(savedFlows));
    message.success("Flow saved successfully!");
    setIsModalVisible(false);
  }, [flowName, nodes, edges]);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const resetFlow = useCallback(() => {
    setNodes(initialNodes);
    setEdges([]);
  }, [setNodes, setEdges]);

  return (
    <div className="dndflow">
      <Sidebar showModal={showModal} resetFlow={resetFlow} />
      <Modal
        title="Save Flow"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Flow name"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
        />
      </Modal>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Lines} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default RootFlow;
