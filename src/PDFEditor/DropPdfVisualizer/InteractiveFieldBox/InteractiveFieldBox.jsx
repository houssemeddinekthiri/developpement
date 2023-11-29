// InteractiveFieldBox.js
import React, { useEffect, useState , useRef } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import FieldBox from '../../FieldBox';
import SignatureCanvas from 'react-signature-canvas';
import { ItemTypes } from '../../ItemTypes';
import ContentEditable from 'react-contenteditable';
import styles from './InteractiveFieldBox.module.scss';
import MaterialIcon, {colorPalette} from 'material-icons-react';
import { ChromePicker } from 'react-color'; // Import ChromePicker from react-color
import DatePicker from 'react-datepicker'; // Import DatePicker from the appropriate library
import 'react-datepicker/dist/react-datepicker.css';
import ModalTampon from './ModalTampon';
import Draggable from "react-draggable";
import SignatureBox from '../../../SignatureBox';
import 'react-resizable/css/styles.css'; // Assurez-vous d'importer les styles CSS de react-resizable
import Modal from './Modal'
import Moveable from 'react-moveable';
import { Resizable } from 'react-resizable';
import { ResizableBox } from 'react-resizable'; // Import ResizableBox
import 'react-resizable/css/styles.css'; // Import the styles for ResizableBox
import ModalSignaturre from './ModalSignature';
import ModalText  from './ModalText';
import SideBarFields from '../../SideBarFields/SideBarFields'
const InteractiveFieldBox  = ({ field,currentPage, handleInputEdit,fieldsByPages,setFieldsByPages, handleShowPanel,  handleInputDelete, onDeleteField,onDragStart  , onDropField , width , height
  }) => {
  // State to manage the button click
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [content, setContent] = useState(field.data);
  const [contents, setContents] = useState(field.data);// State to hold the input text
  const [isEditable, setIsEditable] = useState(false); // State to manage editable property
  const [isDraggable, setIsDraggable] = useState(false); // State to manage draggable property
  const [showPanel, setShowPanel] = useState(false); // State to control the panel visibility
  const [isBlueFrame, setIsBlueFrame] = useState(false);
  const [frameWidth, setFrameWidth] = useState(50); // Largeur initiale du cadre
  const [frameHeight, setFrameHeight] = useState(50); // Hauteur initiale du cadre

const[showPanelSignature  , setShowPanelSignature]=useState(false);

  const [showPanelDate, setShowPanelDate] = useState(false); // State to control the panel visibility
  const [showD, setShowD] = useState(false); // State to control the panel visibility
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 }); // State to store the panel position
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [borderr, setBorderr] = useState('transparent'); // Set a default color
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
 const [isPanelVisible, setIsPanelVisible] = useState(false); // Nouvel état pour la visibilité du panneau
 const [isDoubleClick, setIsDoubleClick] = useState(false);
 const [isDoubleClickCopier, setIsDoubleClickCopier] = useState(false);
const[selectedField , setSelectedField]=useState()
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

  const [{ isDragging }, dragRef, preview] = useDrag(() => ({
    type: ItemTypes.FIELD,
    item: field,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [field]);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []); // eslint-disable-line

  const opacity = isDragging ? 0.4 : 1;
  const border = isDragging ? 'red' : 'blue';
  const fontSize = isDragging ? '10px' : '15px';

  // Function to handle input change
  const handleInputChange = (event) => {
    setContent(event.target.value);
  };

  const handleDoubleClick = () => {
    if (field.data === 'Nom' || field.data === 'Prenom' || field.data === 'Entreprise'  ) {
      setIsEditable(!isEditable);
      setIsDraggable(false);
      setSelectedField(field);
      setIsInputFocused(true);

    }
  };


  const handleDateChange = (date) => {

    const formattedDate = formatDate(date);

    setContent(formattedDate);

    // Close the date panel
    setShowPanelDate(false);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const handleClick = (event) => {
    event.stopPropagation();
    if (!isEditable) {
      setIsDraggable(true);


    }

  };
  const [openModall, setOpenModall] = useState(false);
  const [openModalText, setOpenModalText] = useState(false);
  const [openModalSign, setOpenModalSign] = useState(false);
  const handleMouseEnter = () => {
  //  if(field.data==='Nom'    || field.data==='Entreprise'){
   // setOpenModalText(true);}
    if(field.data==='Date'){
      setShowPanelDate(true)
    }

    if(field.data==='signature'){
      setOpenModalSign(true)
    }
    if(field.data==="Tampon d'entreprise"){
      setOpenModall(true)
    }
  };




  const [inputSize, setInputSize] = useState(15);
  const [selectedFont, setSelectedFont] = useState('Arial');

  //
  const handleFontFamilyChange = (event) => {
    setSelectedFont(event.target.value);
  };
  // Function to handle input size change
  const handleInputChangeSize = (event) => {
    setInputSize(parseInt(event.target.value));
  };


  const handleMouseEnterr = () => {
    setIsDoubleClick(true);
    setIsDoubleClickCopier(true)

  };
  const inputRef = useRef(null);

const handleCopier=()=>{
  setShowPanelDate(true)
}


  useEffect(() => {
    if (isEditable) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isEditable]);


  useEffect(() => {
    if (isInputFocused) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isInputFocused]);




  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(true);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };



  const handleInputBlur = () => {
    if (!inputValue) {
      setShowInput(false);
    }
  };
  const [deleteIconClicked, setDeleteIconClicked] = useState(false);
  const handleDeleteClick = () => {
    setInputValue('');
    setShowInput(false);
     setIsDoubleClick(false)
     setIsDoubleClickCopier(false)
     setShowPanel(false)
  };

  const handleDeleteClickOut = () => {
    setIsDoubleClick(false);
    setIsDoubleClickCopier(false)


  };

  const [openModal, setOpenModal] = useState(false);

  const handleOutsideClick = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target) && !deleteIconClicked) {
      setIsEditable(false);
      setIsDoubleClick(false)
      setIsDoubleClickCopier(false)

    }
    setDeleteIconClicked(false);
    if (!inputRef.current.contains(event.target)) {
      setIsInputFocused(false);

    }
  };
  const [isDraggingg, setIsDragging] = useState(false);
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Function to handle dragging stop
  const handleDragStop = () => {
    setIsDragging(false);
  };

  const signatureRef = useRef();
  const signatureCanvasRef = useRef(null);
  const [penColor, setPenColor] = useState('black'); // État pour la couleur du stylo

  const handleClear = () => {
    signatureRef.current.clear();
  };

  const [inputContent, setInputContent] = useState(''); // State to store input content

  const handleCopyClick = (content) => {
    setInputContent(content);
    setSelectedField(content);
    setOpenModal(true);
  };
  const [signatureDataURL, setSignatureDataURL] = useState('');

  const handleSaveImga = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL(); // Obtient l'image de la signature au format Data URL
      setSignatureDataURL(signatureData); // Met à jour l'état avec l'URL de l'image de signature
      setContent(`<img src="${signatureData}" alt="Signature" style="max-width: 100px; maw-height:50px"  />${inputValue}`);
      console.log(signatureData)
    }
  };




  const moveableRef = useRef(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  const handleDrag = ({ left, top }) => {
    setPosition({ left, top });
  };






  const handleCopyToAllPages = () => {
    if (content) {
      const updatedFieldsByPages = { ...fieldsByPages };

      for (const pageIndex in updatedFieldsByPages) {
        const newFieldId = `00${pageIndex}${Object.keys(updatedFieldsByPages[pageIndex]).length}`;
        const originalField = updatedFieldsByPages[pageIndex][field._id];

        updatedFieldsByPages[pageIndex] = {
          ...updatedFieldsByPages[pageIndex],
          [newFieldId]: {
            ...field,
            _id: newFieldId,
            page: parseInt(pageIndex),
            top: originalField.top + 50,
            left: originalField.left + 50,
            data: content,
          },
        };
      }

      setFieldsByPages(updatedFieldsByPages);
      console.log(width)
    }
  };






  const [resizableWidth, setResizableWidth] = useState(field.width);
  const [resizableHeight, setResizableHeight] = useState(field.height);




  const handleResize = ({ width, height }) => {
    setResizableWidth(width);
    setResizableHeight(height);
  };

  return (


    <div

    className="inputContainer"
    onDoubleClick={(event) => {
      handleMouseEnter(event);
      handleDeleteClickOut(event)}}
    onClick={(event) => {
      handleClick(event);
      handleDoubleClick(event)
    }}
  >


  <div

   ref={moveableRef}
style={{
  position: 'absolute',
  left: position.left,
  top: position.top,

}}

>

     {showInput &&  (



      <ContentEditable

      disabled={!isEditable}
className={`${styles.box} ${isInputFocused ? styles.blueFrame : ''}`}
      innerRef={(element) => {
        dragRef(element);
        inputRef.current = element;
      }}

        html={content}
        onChange={(event) => {
          handleInputChange(event);
          handleChange(event);
        }}

        onDoubleClick={(event) => {
          handleDeleteClickOut(event);
          handleDoubleClick(event);
          setIsEditable(true);


        }}
        onMouseEnter={handleMouseEnterr}

        style={{
          width:"200px",
          height:"40px",
       textAlign: 'center',
       boxSizing: 'border-box',
padding:'8px',
marginTop:'15px',
          left:field.left ,top:field.top,pointerEvents: 'auto',
       opacity,  border,  fontSize , color:selectedColor , fontStyle: field.isItalic ? 'italic' : 'normal' ,
        fontWeight: field.isBold ? 'bold' : 'normal',
        textDecoration: field.isUnderline ? 'underline' : 'none',
        fontSize: inputSize + 'px',
        fontFamily: selectedFont,}}
      // onDoubleClick={handleDoubleClick}
              showPanel={showPanel}
        value={inputValue}

        onBlur={(event) => {
          handleInputBlur(event);
          handleInputBlur();
        }}

      >

   </ContentEditable>



     )}

    {isDoubleClick &&  (
          <button
            className={styles.transparentButton}
            style={{
              position: 'absolute',
              top: field.top - 1,
              left: field.left + 160,

            }}
            onClick={handleDeleteClick}
          >
            <MaterialIcon icon="close" />
          </button>
        )}

{isDoubleClickCopier &&  (
          <button
            className={styles.transparentButton}
            style={{
              position: 'absolute',
              top: field.top - 2,
              left: field.left +130,
              fontSize:'5px'
            }}
            onClick={() => handleCopyToAllPages(content)}
          >
            <MaterialIcon icon="content_copy"   />

          </button>
          )}

<Modal
       open={openModal}
        onClose={() => setOpenModal(false)}
applyToAllPages={handleCopyToAllPages}
        setContent={setContent}/>
</div>



{currentPage === field.page && (
      <Moveable
      throttleResize={1}
      renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        target={moveableRef.current}
        draggable={true}
        onDrag={handleDrag}
        container={null}
        origin={false}

        bounds={{
          left: 0,
          top: 0,
          right: width ,
          bottom: height

        }}

        keepRatio={false}
        edge={true}
        onResize={handleResize}
        snapThreshold={5}
        snapCenter={false}
      />
    )}

    {showPanelDate &&  (
       <div

       className={styles.Panel}
       style={{ zIndex: 999 , width:'350px' , height:'550px' , backgroundColor:'whitesmoke' , position: 'absolute', top: '50%', left: '-15%', transform: 'translate(-50%, -50%)' }}
     >
          {/* Add the color picker to the panel */}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <b style={{fontFamily:'Cambria'  , fontSize:'15px'}}>Sélectionner un date</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onDoubleClick={() => setShowPanelDate(false)} className={styles.transparentButton}> <MaterialIcon icon="close" > </MaterialIcon> </button><br/>
      <br/>     &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;<DatePicker selected={new Date()} onChange={handleDateChange} />

          </div>
        )}

{showPanelSignature &&  (
       <div

       className={styles.Panel}
       style={{ zIndex: 999 , width:'350px' , height:'550px' , backgroundColor:'whitesmoke' , position: 'absolute', top: '50%', left: '-15%', transform: 'translate(-50%, -50%)' }}
     >
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <b style={{fontFamily:'Cambria'  , fontSize:'15px'}}>Signature</b>  &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onDoubleClick={() => setShowPanelSignature(false)} className={styles.transparentButton}> <MaterialIcon icon="close" > </MaterialIcon> </button><br/>
      <br/>
     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <div style={{width:'330px' , height:'250' , backgroundColor:'white'}}>

      <SignatureCanvas
      className='styles.ll'
        ref={(ref) => {
          signatureRef.current = ref;
          signatureCanvasRef.current = ref;
        }}
        penColor={penColor} // Utilisez l'état de la couleur du stylo
        canvasProps={{ width: 300, height: 300, className: 'signatureCanvas', top: '30px' }}
      />
      <br />
      &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; <input
        type="color"
        value={penColor}
        onChange={(e) => setPenColor(e.target.value)} // Met à jour la couleur du stylo
      /> &nbsp;&nbsp;
      <button onClick={handleClear}>Effacer</button>
      &nbsp;&nbsp;  <button onClick={handleSaveImga}>Sauvegarder</button>

     </div>
          </div>
        )}

      {showPanel &&  (
        <div

          className={styles.Panel}
          style={{ zIndex: 999 , width:'350px' , height:'550px' , backgroundColor:'whitesmoke' , position: 'absolute', top: '50%', left: '-15%', transform: 'translate(-50%, -50%)' }}
        >
          {/* Add the color picker to the panel */}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <b style={{fontFamily:'Cambria'  , fontSize:'15px'}}>Changer le couleur</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onClick={() => setShowPanel(false)} className={styles.transparentButton}> <MaterialIcon icon="close" > </MaterialIcon> </button>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <div style={{padding:'20px'}}>
          <ChromePicker color={selectedColor} onChange={handleColorChange}   />
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b   style={{fontFamily:'Cambria'  , fontSize:'15px'}}>Changer le style</b><br/><br/>
          <button onClick={handleToggleItalic} className={styles.transparentButton}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <MaterialIcon icon="format_italic" >{field.isItalic ? 'Enlever l\'italique' : 'Mettre en italique'}</MaterialIcon>

          </button>
          <button onClick={handleBoldToggle} className={styles.transparentButton}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <MaterialIcon icon="format_bold" >{field.isBold ? 'Enlever le gras' : 'Mettre en gras'}</MaterialIcon>
          </button>

          <button onClick={handleUnderlineToggle} className={styles.transparentButton}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<MaterialIcon icon="format_underlined" > {field.isUnderline ? 'Enlever le soulignement' : 'Mettre en soulignement'}</MaterialIcon>
          </button>
          <div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='number' placeholder='nouvelle size' value={inputSize} onChange={handleInputChangeSize}></input></div><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;  <div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <label htmlFor='fontFamilyDropdown'>Font Family:&nbsp;&nbsp;</label>
            <select id='fontFamilyDropdown' value={selectedFont} onChange={handleFontFamilyChange}>
              <option value='Arial'>Arial</option>
              <option value='Times New Roman'>Times New Roman</option>
              <option value='Verdana'>Verdana</option>
              <option value='Helvetica'>Helvetica</option>Cambria
              {/* Add more font options as needed */}
              <option value='Cambria'>Cambria</option>
            </select>
          </div>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <button  onClick={handleDeleteClick}>delete Fields </button>
        </div>
      )}
<ModalTampon
       open={openModall}
        onClose={() => setOpenModall(false)}

        setContent={setContent}/>
<ModalSignaturre
       open={openModalSign
      }
        onClose={() => setOpenModalSign(false)}

        setContent={setContent}/>
        <ModalText
       open={openModalText
      }
        onClose={() => setOpenModalText(false)}
setSelectedField={setSelectedField}
        setContent={setContent}
        field={field}

        selectedFont={selectedFont}
        setSelectedFont={setSelectedFont}
        setInputSize={setInputSize}
        inputSize={inputSize}

        />


    </div>


  );
      }
export default InteractiveFieldBox;
