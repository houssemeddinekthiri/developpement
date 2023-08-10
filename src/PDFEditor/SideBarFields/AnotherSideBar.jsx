import React, { useState } from 'react';
import styles from './SideBarFields.module.scss';
import { ChromePicker } from 'react-color'; // Import ChromePicker from react-color

const AuthorsideBar = ({ fieldGroups, fieldsByPages }) => {
  const [showPanel, setShowPanel] = useState(false); // État pour contrôler la visibilité du panneau
  const [selectedColor, setSelectedColor] = useState('#000000'); // Couleur sélectionnée par défaut

  // Fonction pour afficher le panneau lorsque vous cliquez sur l'input dropper
  const handleShowPanel = () => {
    setShowPanel(true);
  };

  // Fonction pour gérer la sélection de la couleur depuis le sélecteur de couleurs
  const handleColorChange = (color) => {
    setSelectedColor(color.hex); // Mettre à jour la couleur sélectionnée
  };

  return (
    <div className={styles.fieldsWrapper}>
      {/* Vos autres éléments dans la barre latérale ici */}
      {/* Ajoutez le code du champ d'entrée ici */}
      <div onClick={handleShowPanel}>
        {/* Ajoutez ici l'icône de l'input dropper */}
      </div>

      {/* Afficher le panneau s'il est visible */}
      {showPanel && (
        <div className={styles.panel}>
          {/* Ajoutez ici le sélecteur de couleurs */}
          <ChromePicker color={selectedColor} onChange={handleColorChange} />
        </div>
      )}

      {/* Le reste de votre JSX */}
    </div>
  );
};

export default AuthorsideBar;
