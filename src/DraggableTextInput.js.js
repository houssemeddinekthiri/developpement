import React from "react";
import { useDrag } from "react-dnd";

function DraggableInput({ id }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "input",
    item: { id: id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <input
      ref={drag}
      type="text"
      placeholder="First name"
      style={{
        width: "150px",
        border: isDragging ? "1px solid pink" : "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        cursor: "grab",
      }}
    />
  );
}

export default DraggableInput;
