/* eslint-disable react-hooks/exhaustive-deps */
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
import { Button } from "antd";
import React, { useCallback, useRef } from "react";
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "step",
            markerEnd: { color: "black" },
            style: {
              strokeWidth: 2,
              stroke: "black",
            },
          },
          eds
        )
      ),
    []
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
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  const saveFlow = () => {
    const flowData = { nodes, edges };
    localStorage.setItem("flowData", JSON.stringify(flowData));
    alert("Flow saved!");
  };

  return (
    <div className="dndflow">
      <Sidebar />
      <Button onClick={saveFlow} style={{ marginBottom: "10px" }}>
        Save Flow
      </Button>
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
