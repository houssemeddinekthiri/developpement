// Sidebar.js
import React from 'react';
import { ChromePicker } from 'react-color';
import styles from './Sidebar.module.scss';

const Sidebar = ({ selectedField, setSelectedField, handleClearSelectedField }) => {
  // Function to handle color selection from the color picker
  const handleColorChange = (color) => {
    setSelectedField({ ...selectedField, color: color.hex });
  };

  return (
    <div className={styles.sidebar}>
      {selectedField && (
        <div className={styles.panel}>
          <button onClick={handleClearSelectedField}>Cacher le champ</button>
          {/* Add the color picker to the panel */}
          <ChromePicker color={selectedField.color} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
