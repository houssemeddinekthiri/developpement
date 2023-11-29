import SideBarFields from './SideBarFields';
import { useDocument } from '../PDFCore';
import DropPdfVisualizer from './DropPdfVisualizer';
import PlaygroundContainer from './PlaygroundContainer';
import { useState, useEffect } from 'react'; // Import useEffect from 'react'
import AuthorsideBar from './SideBarFields/AnotherSideBar'
import styles from '../PDFEditor/DropPdfVisualizer/InteractiveFieldBox/';
import InteractiveFieldBox from './DropPdfVisualizer/InteractiveFieldBox/InteractiveFieldBox';
import Modal from './DropPdfVisualizer/InteractiveFieldBox/Modal';
const DEFAULT_FIELDS = {
  hourly: [
    {
      id: '001',
      type: 'hourly',
      data: 'Nom',
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
    {
      id: '005',
      type: 'hourly',
      data: "Tampon d'entreprise",
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

function PDFEditor({ url  ,selectedFieldForCopy}) {
  const { pages, loading } = useDocument({ url });
  const [fieldsByPages, setFieldsByPages] = useState({});


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

  const [selectedField, setSelectedField] = useState(null);
  const [selectedFieldPanel, setSelectedFieldPanel] = useState(null);


  const handleApplyClick = (selectedOption) => {
    if (selectedOption === 'last') {
      const lastPageIndex = pages.length - 1;
      const updatedFieldsByPages = { ...fieldsByPages };

      // Mettez à jour les coordonnées du champ
      const fieldToUpdate = selectedFieldForCopy;
      fieldToUpdate.page = lastPageIndex;
      fieldToUpdate.top = 100; // Mettez à jour la valeur appropriée pour le top
      fieldToUpdate.left = 100; // Mettez à jour la valeur appropriée pour le left

      // Ajoutez le champ mis à jour à la dernière page
      updatedFieldsByPages[lastPageIndex] = {
        ...updatedFieldsByPages[lastPageIndex],
        [fieldToUpdate._id]: fieldToUpdate,
      };

      setFieldsByPages(updatedFieldsByPages);
    }

  };


  const handleCopyToAllPages = (content) => {
    const lastPageIndex = pages.length ;
    const updatedFieldsByPages = { ...fieldsByPages };

    for (let fieldId in updatedFieldsByPages[lastPageIndex]) {
      updatedFieldsByPages[lastPageIndex][fieldId].data = content;
    }

    setFieldsByPages(updatedFieldsByPages);
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
        applyToAllPages={handleCopyToAllPages}
        setFieldsByPages={setFieldsByPages}
      />
<Modal  applyToAllPages={handleCopyToAllPages}>


</Modal>
      <SideBarFields
        fieldGroups={DEFAULT_FIELDS}
        fieldsByPages={fieldsByPages}
        selectedField={selectedField}
        setSelectedField={setSelectedField}
      />

    </PlaygroundContainer>
  );

}

export default PDFEditor;
