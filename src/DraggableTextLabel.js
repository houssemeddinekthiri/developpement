import React from 'react';

const DraggableTextLabel = ({ label }) => {
    const handleDragStart = (event) => {
        event.dataTransfer.setData('text/plain', ''); // Necessary for dragging to work
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                cursor: 'move',
                backgroundColor: 'lightblue',
                padding: '5px',
            }}
        >
            {label}
        </div>
    );
};

export default DraggableTextLabel;
