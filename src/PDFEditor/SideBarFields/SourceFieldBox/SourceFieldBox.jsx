import React, { useEffect , useState } from 'react';
import { useDrag } from 'react-dnd';
import FieldBox from '../../FieldBox';
import { ItemTypes } from '../../ItemTypes';
import { getEmptyImage } from 'react-dnd-html5-backend';
import './SourceFieldBox.css'; // Importez le fichier de styles CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen , faUser ,faBuilding , faSignature , faCalendarAlt , faStamp } from '@fortawesome/free-solid-svg-icons';
import '../../../input.css'
const SourceFieldBox = ({ field, className }) => {
  const [{ isDragging }, dragRef, preview] = useDrag(() => ({
    type: ItemTypes.SOURCE_FIELD,
    item: field,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),

    }),
  }));

  const opacity = isDragging ? 0.7 : 1; // Ajustez l'opacité lors du glisser-déposer
const [icone , setIcone]=useState(null)
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
    if(field.data==='Nom'){
        setIcone(faUser)

    }
    if(field.data==='Prenom'){
      setIcone(faUser)

  }
  if(field.data==='Entreprise'){
    setIcone(faBuilding)
  }
  if(field.data==='signature'){
    setIcone(faSignature)
  }

  if(field.data==='Date'){
    setIcone(faCalendarAlt)
  }
  if(field.data==="Tampon d'entreprise"){
    setIcone(faStamp)
  }

  }, []); // eslint-disable-line

  return (
    <div className="source-field-container">
      <div >
        <div className="user-input-container">
          {/* Utilisez la classe CSS personnalisée sur le bouton */}
<div> 
  <button
            id="editorInk"
          style={{backgroundColor:'transparent' , border:'transparent'}}
            aria-checked="false"
          // Appliquez l'opacité définie
          >

            <FieldBox
              ref={dragRef}

              label={field.data}
            />
          </button></div>
<div className='iconne'>
          <FontAwesomeIcon icon={icone} style={{ fontSize: '15px' ,width:'17px'}} /></div>
        </div>
      </div>
    </div>
  );
};

export default SourceFieldBox;
