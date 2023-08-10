import React, { useState } from 'react';

const Panel = () => {
  const [showPanel, setShowPanel] = useState(false);

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  return (
    <div style={styles.panelWrapper}>
      <button onClick={togglePanel} style={styles.toggleButton}>
        {showPanel ? 'Masquer le panneau' : 'Afficher le panneau'}
      </button>

      {showPanel && (
        <div style={styles.panelContent}>
          <h3 style={styles.panelTitle}>Panneau</h3>
          <p style={styles.panelText}>Ceci est le contenu du panneau.</p>
          {/* Ajoutez ici d'autres éléments que vous souhaitez afficher dans le panneau */}
        </div>
      )}
    </div>
  );
};

export default Panel;

const styles = {
  panelWrapper: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    border: '1px solid #ccc',
    marginBottom: '20px',
    width:'400px',
    backgroundColor:"pink"
  },
  toggleButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '8px 12px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
   
  },
  panelContent: {
    marginTop: '10px',
  },
  panelTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  panelText: {
    fontSize: '14px',
  },
};
