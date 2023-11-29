// DropPdfVisualizer.js
import React, { useState } from 'react';
import DropPage from './DropPage';
import styles from './DropPdfVisualizer.module.scss';
import Modal from './InteractiveFieldBox/Modal';
import { ChromePicker } from 'react-color'; // Import ChromePicker from react-color

function DropPdfVisualizer({ pages, fieldsByPages, loading, onDropField, setFieldsByPages, applyToAllPages}) {
  const [editingField, setEditingField] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFieldForCopy, setSelectedFieldForCopy] = useState(null);

  const handleInputEdit = (field) => {
    setEditingField(field);
  };
  const [copiedContent, setCopiedContent] = useState(null);


  const [contentToCopy, setContentToCopy] = useState('');


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



  const handleCopyToAllPages = () => {
    if (copiedContent) {
      const updatedFieldsByPages = { ...fieldsByPages };

      for (const pageIndex in updatedFieldsByPages) {
        const newFieldId = `00${pageIndex}${Object.keys(updatedFieldsByPages[pageIndex]).length}`;
        const lastField = Object.values(updatedFieldsByPages[pageIndex]).pop();

        updatedFieldsByPages[pageIndex] = {
          ...updatedFieldsByPages[pageIndex],
          [newFieldId]: {
            ...lastField,
            _id: newFieldId,
            page: parseInt(pageIndex),
            top: lastField.top + 50, // Adjust as needed
            left: lastField.left + 50, // Adjust as needed
            data: copiedContent,
          },
        };
      }

      setFieldsByPages(updatedFieldsByPages);
    }
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
      content={contentToCopy}
      fields={fieldsByPages[page] ?? {}}
      onDropField={onDropField}
      handleInputEdit={handleInputEdit}
      fieldsByPages={fieldsByPages} // Pass fieldsByPages
      setFieldsByPages={setFieldsByPages}
      handleCopyToAllPages={handleCopyToAllPages}

      // Pass setFieldsByPages
    />

    ))}

    </div>
  );
}
export default DropPdfVisualizer;
