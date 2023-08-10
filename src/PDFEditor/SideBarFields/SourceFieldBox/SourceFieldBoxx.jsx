import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import FieldBoxx from './FieldBoxx';
import { ItemTypes } from '../../ItemTypes';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen , faUser ,faBuilding , faSignature , faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
const SourceFieldBoxx = ({ field, className, handleShowPanel }) => {
  const [{ isDragging }, dragRef, preview] = useDrag(() => ({
    type: ItemTypes.SOURCE_FIELD,
    item: field,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const opacity = isDragging ? 0.4 : 1;
  const [icone , setIcone]=useState(null)
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
    if(field.data==='Date'){
      setIcone(faCalendarAlt)
    }
  }, []); // eslint-disable-line

  const [isHovered, setIsHovered] = useState(false);

 

  return (
    
    <div
     
      className={`floatpdfright ${className}`}
      style={{ opacity }}
    
    >
    <div className="p-top">
    &nbsp;&nbsp;  &nbsp;&nbsp;  &nbsp;&nbsp; &nbsp;&nbsp;       <FontAwesomeIcon icon={icone} className='ic' /> &nbsp;&nbsp; <button id="editorInk" className="btn btn-pdf-custom  styles.a" aria-checked="false"  ref={dragRef}>
 <FieldBoxx label={field.data} />
       </button>
      </div>
    </div>
  );
};

export default SourceFieldBoxx;
