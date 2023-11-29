// DropPage.js
import React, { useCallback, useRef , useState } from 'react';
import { useDrop } from 'react-dnd';
import { DocumentPage } from '../../../PDFCore';
import InteractiveFieldBox from '../InteractiveFieldBox';
import { ItemTypes } from '../../ItemTypes';
import Draggable from "react-draggable";
import MaterialIcon, {colorPalette} from 'material-icons-react';
import SideBarFields from '../../SideBarFields/SideBarFields';
import Modal from '../InteractiveFieldBox/Modal';
import Moveable from 'react-moveable';
const DropPage = ({ src, width, height, page, fields, onDropField,content, onEditField,handleChangeInput, onDeleteField,handleCopyToAllPages ,fieldsByPages,setFieldsByPages ,moveableRef , setIsDoubleClick , selectedFieldData }) => {
  const moveBox = useCallback(
    (item, left, top) => {
      onDropField({
        ...item,
        _id: item._id ?? `00${page}${Object.keys(fields).length}`,
        page,
        top,
        left,
      });
    },
    [onDropField, page, fields]
  );



  const ref = useRef();

  const [, dropRef] = useDrop(
    () => ({
      accept: [ItemTypes.SOURCE_FIELD, ItemTypes.FIELD],
      drop(item, monitor) {
        const pageRect = ref.current.getBoundingClientRect();

        const sourcePosition = monitor.getInitialSourceClientOffset();

        const clickOffset = monitor.getInitialClientOffset();

        const releaseDifference = monitor.getDifferenceFromInitialOffset();

        const clickRelativeToItem = clickOffset.y - sourcePosition.y;
        const deltaTotalTop = clickOffset.y + releaseDifference.y;
        const topRelativeToPage = deltaTotalTop - pageRect.y;

        const clickRelativeToItemX = clickOffset.x - sourcePosition.x;
        const deltaTotalLeft = clickOffset.x + releaseDifference.x;
        const leftRelativeToPage = deltaTotalLeft - pageRect.x;

        const top = topRelativeToPage - clickRelativeToItem;
        const left = leftRelativeToPage - clickRelativeToItemX;

        moveBox(item, left, top);

        return undefined;
      },
    }),
    [moveBox]
  );



  const handleDeleteField = (fieldId) => {
    onDeleteField(fieldId);
  };

  return (
    <div style={{ position: 'relative' }} className="container"  >
      <DocumentPage ref={dropRef(ref) } src={src} width={width} height={height}>
        {Object.values(fields).map((field) => (
         <InteractiveFieldBox
         key={field._id}
         field={field}
         currentPage={page}
         onEditField={onEditField}
         onDeleteField={handleDeleteField}
         setSelectedFieldData={selectedFieldData}
         width={width}
         height={height}
         fieldsByPages={fieldsByPages} // Pass fieldsByPages
         setFieldsByPages={setFieldsByPages}
         handleCopyToAllPages={handleCopyToAllPages}
         handleChangeInput={handleChangeInput}

         // Pass setFieldsByPages
       />

        ))}
      </DocumentPage>
    </div>
  );
};

export default DropPage;
