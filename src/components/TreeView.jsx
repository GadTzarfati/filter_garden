 import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/global.css";

const ITEM_TYPE = "NODE";

const TreeNode = ({ node, moveNode, addNode, deleteNode, startEditing, editingNode, editText, setEditText, saveEdit }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (draggedItem) => moveNode(draggedItem.id, node.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <li ref={drop} className={`tree-node ${isOver ? "highlight" : ""}`} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div ref={drag} className="tree-node-content">
        {editingNode === node.id ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={() => saveEdit(node.id)}
            onKeyDown={(e) => e.key === "Enter" && saveEdit(node.id)}
            autoFocus
          />
        ) : (
          <span onDoubleClick={() => startEditing(node.id, node.name)}>{node.name}</span>
        )}
        <div className="tree-buttons">
          <button onClick={() => addNode(node.id)}>➕ Add Child</button>
          <button onClick={() => deleteNode(node.id)}>❌ Delete</button>
        </div>
      </div>
      {node.children.length > 0 && <ul>{node.children.map((child) => <TreeNode key={child.id} node={child} moveNode={moveNode} addNode={addNode} deleteNode={deleteNode} startEditing={startEditing} editingNode={editingNode} editText={editText} setEditText={setEditText} saveEdit={saveEdit} />)}</ul>}
    </li>
  );
};

const TreeView = () => {
  const getSavedNodes = () => {
    const savedNodes = localStorage.getItem("treeNodes");
    return savedNodes ? JSON.parse(savedNodes) : [{ id: 1, name: "Root Node", children: [] }];
  };

  const [nodes, setNodes] = useState(getSavedNodes);
  const [editingNode, setEditingNode] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("treeNodes", JSON.stringify(nodes));
  }, [nodes]);

  const addNode = (parentId = null) => {
    const newNode = { id: Date.now(), name: `Node ${nodes.length + 1}`, children: [] };

    if (parentId === null) {
      setNodes([...nodes, newNode]);
    } else {
      const updateNodes = (nodeList) =>
        nodeList.map((node) =>
          node.id === parentId ? { ...node, children: [...node.children, newNode] } : { ...node, children: updateNodes(node.children) }
        );

      setNodes(updateNodes(nodes));
    }
  };

  const deleteNode = (nodeId) => {
    const removeNode = (nodeList) =>
      nodeList.filter(node => node.id !== nodeId).map(node => ({ ...node, children: removeNode(node.children) }));

    setNodes(removeNode(nodes));
  };

  const startEditing = (nodeId, currentName) => {
    setEditingNode(nodeId);
    setEditText(currentName);
  };

  const saveEdit = (nodeId) => {
    const updateNodes = (nodeList) =>
      nodeList.map((node) =>
        node.id === nodeId ? { ...node, name: editText } : { ...node, children: updateNodes(node.children) }
      );

    setNodes(updateNodes(nodes));
    setEditingNode(null);
  };

  const moveNode = (draggedId, targetId) => {
    if (draggedId === targetId) return;

    let draggedNode = null;

    const removeNode = (nodeList) =>
      nodeList.filter(node => {
        if (node.id === draggedId) {
          draggedNode = node;
          return false;
        }
        return true;
      }).map(node => ({ ...node, children: removeNode(node.children) }));

    let updatedNodes = removeNode(nodes);

    const insertNode = (nodeList) =>
      nodeList.map(node =>
        node.id === targetId ? { ...node, children: [...node.children, draggedNode] } : { ...node, children: insertNode(node.children) }
      );

    setNodes(insertNode(updatedNodes));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="tree-container">
        <button onClick={() => addNode(null)} className="add-node-btn">➕ Add Node</button>
        <ul>
          {nodes.map((node) => (
            <TreeNode key={node.id} node={node} moveNode={moveNode} addNode={addNode} deleteNode={deleteNode} startEditing={startEditing} editingNode={editingNode} editText={editText} setEditText={setEditText} saveEdit={saveEdit} />
          ))}
        </ul>
      </div>
    </DndProvider>
  );
};

export default TreeView;