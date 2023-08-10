// DropPdfVisualizer.js
import React, { useState } from 'react';
import DropPage from './DropPage';
import styles from './DropPdfVisualizer.module.scss';
import { ChromePicker } from 'react-color'; // Import ChromePicker from react-color
function DropPdfVisualizer({ pages, fieldsByPages, loading, onDropField, setFieldsByPages, }) {
  const [editingField, setEditingField] = useState(null);
  const [selectedField, setSelectedField] = useState(null); // Ajout de l'état selectedField
  const [selectedColor, setSelectedColor] = useState('#000000'); // Set a default color
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const handleInputEdit = (field) => {
    setEditingField(field);
  };

  const handleClearSelectedField = () => {
    setSelectedField(null);
  };

  if (loading) {
    return 'LOADING...';
  }
  const handleInputDelete = (fieldId) => {
    // Create a copy of fieldsByPages to avoid directly mutating the state
    const updatedFieldsByPages = { ...fieldsByPages };

    // Find the page that contains the selected field
    for (const page in updatedFieldsByPages) {
      if (fieldId in updatedFieldsByPages[page]) {
        // Remove the field from the page
        delete updatedFieldsByPages[page][fieldId];

        // Update the state with the new fieldsByPages
        setFieldsByPages(updatedFieldsByPages);
        return; // Exit the function after removing the field
      }
    }
  };
  // Function to handle color selection from the color picker
  const handleColorChange = (color) => {
    setSelectedColor(color.hex); // Update the selected color
  };
 

  const handleInputHover = () => {
    setIsPanelVisible(true);
  };
  const handleShowPanel = (field) => {
    setSelectedField(field);
    setIsPanelVisible(true);
  };
  return (
    <div className={styles.documentWrapper}>
      {pages.map(({ dataUrl, width, height }, page) => (
        <DropPage
          key={page}
          page={page}
          src={dataUrl}
          width={width}
          height={height}
          fields={fieldsByPages[page] ?? {}}
          onDropField={onDropField}
          handleInputEdit={handleInputEdit}
          onDeleteField={handleInputDelete}
        />
        
      ))}
      
    </div>
  );
}
export default DropPdfVisualizer;
