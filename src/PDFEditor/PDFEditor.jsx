import SideBarFields from './SideBarFields';
import { useDocument } from '../PDFCore';
import DropPdfVisualizer from './DropPdfVisualizer';
import PlaygroundContainer from './PlaygroundContainer';
import { useState, useEffect } from 'react'; // Import useEffect from 'react'
import AuthorsideBar from './SideBarFields/AnotherSideBar'
import styles from '../PDFEditor/DropPdfVisualizer/InteractiveFieldBox/';
import InteractiveFieldBox from './DropPdfVisualizer/InteractiveFieldBox/InteractiveFieldBox';
const DEFAULT_FIELDS = {
  hourly: [
    {
      id: '001',
      type: 'hourly',
      data: 'Nom',
    },
    {
      id: '002',
      type: 'hourly',
      data: 'Prenom',
    },
    {
      id: '003',
      type: 'hourly',
      data: 'Entreprise',
    },
    {
      id: '004',
      type: 'hourly',
      data: 'Date',
    },
    
  ],
  docusign: [
    {
      id: '101',
      type: 'docusign',
      data: 'signature',
    },
  ],
};
const DEFAULT_FIELDSS = {
  hourly: [
    {
      id: '001',
      type: 'hourly',
      data: 'Date',
    },
  
    
  ],
 
};

function PDFEditor({ url  , showPanel , setShowPanel}) {
  const { pages, loading } = useDocument({ url });
  const [fieldsByPages, setFieldsByPages] = useState({});
 
  const handleMouseEnter = () => {
    setSelectedField(null); // Hide the delete icon
  };

  const handleMouseLeave = () => {
    setSelectedField(null); // Hide the delete icon
  };
  const handleDropField = (field) => {
    setFieldsByPages((currentFields) => ({
      ...currentFields,
      [field.page]: {
        ...(currentFields[field.page] ?? {}),
        [field._id]: field,
      },
    }));
    setSelectedField(field);
  };
  const defaultFieldPayload = {
    "0": {
      "0000": {
        "id": "002",
        "type": "hourly",
        "data": "",
        "_id": "0000",
        "page": 0,
        "top": 95,
        "left": 222,
        "draggable": false  // Set 'draggable' property to false to disable dragging

      }
    },
    "1": {
      "0010": {
        "id": "002",
        "type": "hourly",
        "data": "",
        "_id": "0010",
        "page": 1,
        "top": 25.333343505859375,
        "left": 189.66668701171875
      }
    }
  };


  // Function to handle color selection from the color picker
  const sidebarStyles = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    background: '#f0f0f0',
  };
  const [selectedField, setSelectedField] = useState(null);
  const [selectedFieldPanel, setSelectedFieldPanel] = useState(null);

  const handleShowPanel = (field) => {
    setSelectedField(field);
    setSelectedFieldPanel(field); // Mettre à jour l'état pour afficher le panneau dans le volet latéral
  };
  const [selectedDropper, setSelectedDropper] = useState(null);

  const handleDropperClick = (dropper) => {
    setSelectedDropper(dropper);
  };

  return (
    <PlaygroundContainer>
 
 
      
     <DropPdfVisualizer
        pages={pages}
        fieldsByPages={fieldsByPages}
        loading={loading}
        onDropField={handleDropField}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        handleShowPanel={handleShowPanel} 
      />

      <SideBarFields
        fieldGroups={DEFAULT_FIELDS}
        fieldGroupss={DEFAULT_FIELDSS}
        fieldsByPages={fieldsByPages}
        handleShowPanel={handleShowPanel}
        selectedField={selectedFieldPanel}
        /* ... autres props ... */
      />
      
    </PlaygroundContainer>
  );
  
}

export default PDFEditor;
