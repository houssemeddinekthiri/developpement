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



const InteractiveFieldBox = ({ field, handleInputEdit, handleShowPanel,  handleInputDelete, onDeleteField }) => {
  // State to manage the button click

  const [content, setContent] = useState(field.data);
  const [contents, setContents] = useState(field.data);// State to hold the input text
  const [isEditable, setIsEditable] = useState(false); // State to manage editable property
  const [isDraggable, setIsDraggable] = useState(false); // State to manage draggable property
  const [showPanel, setShowPanel] = useState(false); // State to control the panel visibility

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
const[selectedField , setSelectedField]=useState()
 const handleDeleteFieldd = () => {
  onDeleteField(field._id);
};
  // Function to handle color selection from the color picker
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
  const border = isDragging ? 'red' : 'blue'; // Change border color when dragging
  const fontSize = isDragging ? '10px' : '15px'; // Change font size when dragging

  // Function to handle input change
  const handleInputChange = (event) => {
    setContent(event.target.value); // Update the content state with the input text
  };

  // Function to handle double-click and make the field editable
  const handleDoubleClick = () => {
    if(field.data==='Nom' || field.data==='Prenom' || field.data==='Entreprise'){
    setIsEditable(!isEditable);
    setIsDraggable(false);

   // handleInputEdit(field);
    }

  };
  const handleDateChange = (date) => {
    // Convert the selected date to the desired format (e.g., DD/MM/YYYY)
    const formattedDate = formatDate(date);

    // Update the content state with the formatted date
    setContent(formattedDate);

    // Close the date panel
    setShowPanelDate(false);
  };
  const handlePanelClose = () => {
    setShowPanelDate(false);

  };
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  // Function to handle click and make the field draggable

  const handleClick = (event) => {
    event.stopPropagation();
    if (!isEditable) {
      setIsDraggable(true);
     // const inputRect = dragRef.current.getBoundingClientRect();

      // Call handleShowPanel with the selected field


    }
    const handlePanelClose = () => {
      setShowPanel(false);
    };
  };
  // Function to handle mouse enter and show the empty panel
  const handleMouseEnter = () => {
    if(field.data==='Nom'   || field.data==='Prenom'  || field.data==='Entreprise'){
    setShowPanel(true);}
    if(field.data==='Date'){
      setShowPanelDate(true)
    }// Afficher l'icône lorsque le curseur survole l'input

    if(field.data==='signature'){
      setShowPanelSignature(true)
    }
  };




  const [inputSize, setInputSize] = useState(15); // State to hold the input size, initialized to 15
  const [selectedFont, setSelectedFont] = useState('Arial'); // State to hold the selected font, initialized to 'Arial'

  //
  const handleFontFamilyChange = (event) => {
    setSelectedFont(event.target.value); // Update the selected font state with the new value
  };
  // Function to handle input size change
  const handleInputChangeSize = (event) => {
    setInputSize(parseInt(event.target.value)); // Update the input size state with the new value
  };


  const handleMouseEnterr = () => {
    setIsDoubleClick(true);
    setIsResizing(true)

  };
  const inputRef = useRef(null);




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
  };

  const handleDeleteClickOut = () => {
    setIsDoubleClick(false);

  };
  const handleOutsideClick = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target) && !deleteIconClicked) {
      setIsEditable(false);

    }
    setDeleteIconClicked(false);
  };
  const handleClickDropper = () => {
    // Appeler la fonction handleShowPanel lorsque l'élément "dropper" est cliqué
   // handleShowPanel(field);
  };


  const signatureRef = useRef();
  const signatureCanvasRef = useRef(null);
  const [penColor, setPenColor] = useState('black'); // État pour la couleur du stylo

  const handleClear = () => {
    signatureRef.current.clear();
  };

  const handleSave = () => {
    const signatureData = signatureRef.current.toDataURL(); // Obtient l'image de la signature au format Data URL
    // Traitez les données de signature (enregistrez-les sur un serveur, par exemple)
  };
  const [signatureDataURL, setSignatureDataURL] = useState('');

  const handleSaveImga = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL(); // Obtient l'image de la signature au format Data URL
      setSignatureDataURL(signatureData); // Met à jour l'état avec l'URL de l'image de signature
      setContent(`<img src="${signatureData}" alt="Signature" style="max-width: 100px; maw-height:50px"  />${inputValue}`);
    }
  };














  const [isResizing, setIsResizing] = useState(false);





  return (
    <div
    className="inputContainer"
    ref={dragRef}
    onDoubleClick={handleDeleteClickOut}
      onClick={(event)=>{
        handleClick(event);
        handleMouseEnter(event);


      handleClickDropper();
      }}
    >
     <div  style={{ display: 'flex', alignItems: 'center' }}>


     {showInput &&  (

      <ContentEditable

      innerRef={(element) => {
        dragRef(element);
        inputRef.current = element;
      }}

        html={content}
        onChange={(event) => {
          handleInputChange(event);
          handleChange(event); // Call your handleChange function if needed
        }}
        disabled={!isEditable}
        onDoubleClick={(event)=>{

         handleDeleteClickOut(event);
        handleDoubleClick(event);
        }}
        onMouseEnter={handleMouseEnterr}
        className={styles.box}
        style={{ opacity, top: field.top, left: field.left, border, borderRadius:  '5px', fontSize , color:selectedColor , fontStyle: field.isItalic ? 'italic' : 'normal' ,
        fontWeight: field.isBold ? 'bold' : 'normal',
        textDecoration: field.isUnderline ? 'underline' : 'none',
        fontSize: inputSize + 'px',
        fontFamily: selectedFont,}}
      // onDoubleClick={handleDoubleClick}
              showPanel={showPanel}
        value={inputValue}
       // handleShowPanel={ handleShowPanel}
        onBlur={(event) => {
          handleInputBlur(event);
          handleInputBlur(); // Call your handleInputBlur function if needed
        }}

      >

   </ContentEditable>

     )}

    {isDoubleClick &&  (
          <button
            className={styles.transparentButton}
            style={{
              position: 'absolute',
              top: field.top - 22,
              left: field.left - 15,

            }}
            onClick={handleDeleteClick}
          >
            <MaterialIcon icon="close" />
          </button>
        )}





    </div>
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
          signatureCanvasRef.current = ref; // Conservez la référence à SignatureCanvas
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
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <b style={{fontFamily:'Cambria'  , fontSize:'15px'}}>Changer le couleur</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onDoubleClick={() => setShowPanel(false)} className={styles.transparentButton}> <MaterialIcon icon="close" > </MaterialIcon> </button>

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
    </div>
  );
      }
export default InteractiveFieldBox;
