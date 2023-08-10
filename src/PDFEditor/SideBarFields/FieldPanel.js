// FieldPanel.js
import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { ChromePicker } from 'react-color'; // Import ChromePicker from react-color
import styles from './FieldPanel.module.scss';
import MaterialIcon from 'material-icons-react';

const FieldPanel = ({ field, handleInputEdit ,selectedField , setSelectedField , handleInputDelete  }) => {
  // Fonctions pour gérer les modifications du champ (comme dans le code d'origine)
  const [content, setContent] = useState(field.data); // State to hold the input text
  const [isEditable, setIsEditable] = useState(false); // State to manage editable property
  const [isDraggable, setIsDraggable] = useState(false); // State to manage draggable property
  const [showPanel, setShowPanel] = useState(false); // State to control the panel visibility
  const [showD, setShowD] = useState(false); // State to control the panel visibility
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 }); // State to store the panel position
  const [selectedColor, setSelectedColor] = useState('#000000'); // Set a default color
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const handleColorChange = (color) => {
    setSelectedColor(color.hex); // Update the selected color
  };
  const handleUnderlineToggle = () => {
    setIsUnderline(!isUnderline);
    field.isUnderline = !isUnderline;
    setSelectedField(field);
  };
  const handleToggleItalic = () => {
    setIsItalic(!isItalic);
    field.isItalic = !isItalic;
    setSelectedField(field);
  };
  const handleBoldToggle = () => {
    setIsBold(!isBold);
    field.isBold = !isBold;
    setSelectedField(field);
  };
  const [isItalic, setIsItalic] = useState(false); // State to manage italic style
  // Reste du code de l'affichage du panneau
  return (
    <div>
      {/* Afficher les options du panneau */}
      {/* Utilisez les fonctions de gestion d'événements pour mettre à jour le champ */}
      {/* Affichez les icônes de MaterialIcon pour les options */}
    </div>
  );
};

export default FieldPanel;
