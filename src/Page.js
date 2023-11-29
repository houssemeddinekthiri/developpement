
import React, { useRef, useEffect, useState } from 'react'
import { InputLabel, makeStyles, TextareaAutosize , IconButton } from '@material-ui/core';
import DraggableImage from './DraggableImage';
import Moveable from 'react-moveable';
import Pdf from './Pdf';
import './s.css'
import { PDFDocument, rgb ,StandardFonts } from 'pdf-lib';
import * as  fileDownload from 'js-file-download';
import Loader from './Loader';
import { jsPDF } from 'jspdf';
import { FileCopy  , Delete  , Close ,Palette   ,FormatBold, FormatItalic, FormatUnderlined} from '@material-ui/icons';

import { Table } from 'react-bootstrap';

export default function Page(props, children ) {

  const [textFormattingVisible, setTextFormattingVisible] = useState(false);

  const divRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);

  const convertCanvasToImage = (canvas, callback) => {
    const image = new Image();


image.onload = () => {
  console.log("Image chargée avec les dimensions:", image.width, image.height);
  callback(image.src);

};


    image.src = canvas.toDataURL("image/png");

    console.log("Image base64:", image.src);

  };
  useEffect(() => {
    let viewport = props.page.getViewport({ scale: props.scale });
    let canvas = canvasRef.current;
    console.log("canvas"+canvas.toDataURL('image/png'))
    let context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    divRef.current.style.width = viewport.width + 'px';
    divRef.current.style.height = viewport.height + 'px';
    props.setPageDimensions({ width: viewport.width, height: viewport.height });
    let renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    props.page.render(renderContext);

    convertCanvasToImage(canvas, (imageSrc) => {
      console.log("Image chargée:", imageSrc);

      props.setImagess((prevImages) => [...prevImages, canvas.toDataURL('image/png')]);
    });


  }, []);



  const useStyles = makeStyles(({
    root: {
      position: 'relative',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxShadow: '0 6px 6px rgba(0,0,0,0.2)',
      paddingBottom: '5px',

    }
  }))
  const canvasClick = (event) => {
    if (props.mode === 'sign') {

      let newImage = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY, imagewidth: 200, imageheight: 50 };
      setImages([...images, newImage]);

      props.setState({ mode: 'none' });
    }

  }
  const imageChange = (id, state) => {

    let newImages = images;
    newImages[id] = { ...newImages[id], ...state };
    setImages(newImages);
    props.imagesChange(props.pageNum, newImages);

  }
  const imageDelete = (id) => {

    let newImages = images;
    newImages = newImages.filter((image, index) => (index !== id));
    setImages(newImages);
    props.imagesChange(props.pageNum, newImages);


  }


  const moveableRef = useRef(null);

  const [labels, setLabels] = useState([]);
  const [labeel, setLabeel] = useState([]);
  const [tab, setTab] = useState([]);



  const handleLabelDelete = () => {
    if (!props.selectedLabel) {
      return;
    }

    const labelId = props.selectedLabel.id;


    divRef.current.removeChild(props.selectedLabel);


    const newLabels = labels.filter((label) => label !== props.selectedLabel);
    setLabels(newLabels);


    const newLabelsMoved = { ...props.labelsMoved };
    const pageLabelsMoved = newLabelsMoved[props.pageNum] || {};

    if (pageLabelsMoved[labelId]) {
      delete pageLabelsMoved[labelId];
      console.log('Supprimé avec succès');
    }

    newLabelsMoved[props.pageNum] = pageLabelsMoved;
    props.setLabelsMoved(newLabelsMoved);


    const updatedLabelsOnPages = { ...props.labelsOnPages };
    if (updatedLabelsOnPages[props.pageNum]) {
      updatedLabelsOnPages[props.pageNum] = updatedLabelsOnPages[props.pageNum].filter(
        (item) => item.element !== props.selectedLabel
      );
      props.setLabelsOnPages(updatedLabelsOnPages);
    }
  }






  const handleLabelDuplicate = (id) => {
    if (props.selectedLabel) {
      const newLabel = props.selectedLabel.cloneNode(true);
      const offsetX = parseInt(newLabel.style.left, 10) + 20;
      const offsetY = parseInt(newLabel.style.top, 10) + 20;

      newLabel.style.left = offsetX + 'px';
      newLabel.style.top = offsetY + 'px';

newLabel.id = 'label_' + Date.now();
      newLabel.style.color = props.selectedLabel.style.color;
newLabel.typee=props.selectedLabel.typee
      const newLabels = { ...props.labelsOnPages };
      newLabels[props.pageNum].push({ element: newLabel, left: offsetX, top: offsetY } );
      props.setLabelsOnPages(newLabels);

      setLabels([...labels, newLabel]);

      divRef.current.appendChild(newLabel);

    }

  };

  const handleLabelDuplicateImage = (id) => {
    if (activeImage) {
      const newLabel = activeImage.cloneNode(true);
      const offsetX = parseInt(newLabel.style.left, 10) + 20;
      const offsetY = parseInt(newLabel.style.top, 10) + 20;

      newLabel.style.left = offsetX + 'px';
      newLabel.style.top = offsetY + 'px';


      newLabel.style.color = activeImage.style.color;
      newLabel.id = 'label_' + Date.now();
      newLabel.typee=activeImage.typee
      const newLabels = { ...props.image };

      newLabels[props.pageNum].push({ element: newLabel, left: offsetX , top: offsetY} );
      props.setImage(newLabels);

      setLabeel([...labeel, newLabel]);

      divRef.current.appendChild(newLabel);

    }
  };
  const [showSignature, setShowSignature] = useState(false);

  const [showTampon, setShowTampon] = useState(false);


  const handleDrop = (event) => {
    event.preventDefault();
    const labelData = event.dataTransfer.getData('text/plain');
    if (labelData === 'Signature') {

      setShowSignature(true);


      const signatureImage = new Image();
      signatureImage.src = props.signatureImage;
      signatureImage.onload = () => {
        const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;
        const imageWidth = 150;
        const imageHeight = 60;
        const signature = document.createElement('img');


        console.log("image signature:"+props.signatureImage)
        if(props.signDefault===0){
          signature.src = props.signature;
        }
        else{
          signature.src = props.signatureImage;
        }
        signature.alt = 'Signature';
        signature.style.position = 'absolute';
        signature.style.left = offsetX + 'px';
        signature.style.top = offsetY + 'px';
        signature.style.width = imageWidth + 'px';
        signature.style.height = imageHeight + 'px';
        signature.contentEditable=false;
        signature.draggable = false;
        signature.id = 'label_' + Date.now();
        signature.typee='Signature'
        signature.style.cursor="move"
        const newLabels = { ...props.image };

        if (!newLabels[props.pageNum]) {
          newLabels[props.pageNum] = [];
        }

        newLabels[props.pageNum].push({ element: signature, left: offsetX, top: offsetY });
        props.setImage(newLabels);

        console.log("Signature"+signature)
        divRef.current.appendChild(signature);
        setLabeel([...labeel , signature])
        props.setLabeels([...props.labeels , signature])

      };


    } else  if (labelData === "Tampon d'entreprise") {
      setShowTampon(true);


      const TamponImage = new Image();
      TamponImage.src = props.signatureImage;
      TamponImage.onload = () => {
        const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;
        const imageWidth = 100;
        const imageHeight = 60;
        const image = document.createElement('img');


        console.log("image signature:"+props.signatureImage)

        image.src = props.TamponImage;

        image.alt = 'Signature';
        image.style.position = 'absolute';
        image.style.left = offsetX + 'px';
        image.style.top = offsetY + 'px';
        image.style.width = imageWidth + 'px';
        image.style.height = imageHeight + 'px';
        image.contentEditable=false;
        image.draggable = false;
        image.style.cursor="move"
        image.id = 'label_' + Date.now();
        image.typee='Tampon'
        const newLabels = { ...props.image };

        if (!newLabels[props.pageNum]) {
          newLabels[props.pageNum] = [];
        }

        newLabels[props.pageNum].push({ element: image, left: offsetX, top: offsetY });
        props.setImage(newLabels);

        console.log("Signature"+image)
        divRef.current.appendChild(image);
        setLabeel([...labeel , image])
        props.setLabeels([...props.labeels , image])

      };
    }
  else if(labelData==='Email'){
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;

    const label = document.createElement('div');
    label.innerHTML = props.email;
    label.style.position = 'absolute';
  label.style.width=240+'px'
  label.style.height=30 +'px'
  label.style.cursor="move"
    label.style.left = offsetX + 'px';
    label.style.top = offsetY + 'px';
    label.contentEditable = true;
  label.style.textAlign='center'
    label.id = 'label_' + Date.now();
  label.typee='Email'
    const newLabels = { ...props.labelsOnPages };
    label.contentEditable = true;
    if (!newLabels[props.pageNum]) {
      newLabels[props.pageNum] = [];
    }

    newLabels[props.pageNum].push({ element: label, left: offsetX, top: offsetY });
    props.setLabelsOnPages(newLabels);

    setLabels([...labels, label]);
    setTab([...tab, label]);
    divRef.current.appendChild(label);
    setInputLabel(label);
  }
    else {
      const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;

    const label = document.createElement('div');
    label.innerHTML = labelData;
    label.style.position = 'absolute';
  label.style.width=120+'px'
  label.style.height=30 +'px'
  if(labelData==="Name"){
    label.innerHTML = props.name;
    label.style.width=150+'px'
  }
    label.style.left = offsetX + 'px';
    label.style.top = offsetY + 'px';
    label.contentEditable = true;
  label.style.textAlign='center'
    label.id = 'label_' + Date.now();
  if(labelData==='Name'){
    label.typee='Name'
  }
  else{
    label.typee='Company'
  }
    const newLabels = { ...props.labelsOnPages };
    label.contentEditable = true;
    if (!newLabels[props.pageNum]) {
      newLabels[props.pageNum] = [];
    }
label.style.cursor="move"
    newLabels[props.pageNum].push({ element: label, left: offsetX, top: offsetY });
    props.setLabelsOnPages(newLabels);

    setLabels([...labels, label]);
    setTab([...tab, label]);
    divRef.current.appendChild(label);
    setInputLabel(label);
    }
  };
const [draggingLabel, setDraggingLabel] = useState(null);


const [clickedLabelType, setClickedLabelType] = useState(null);

const [activeMoveable, setActiveMoveable] = useState(null);

  const [inputLabel, setInputLabel] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const handlePopupClick = (e) => {

    e.stopPropagation();

  };

  const handleLabelClick = (e) => {
    const clickedLabel = e.target;

    if (clickedLabel === canvasRef.current) {

      setActiveMoveable(null);
      setActiveImage(null)
    } else {

      props.setSelectedLabel(clickedLabel)
      setActiveMoveable(clickedLabel);
      setDraggingLabel(clickedLabel)

      if (clickedLabel instanceof HTMLImageElement ) {

        setActiveImage(clickedLabel);
        setShowDeleteIcon(true);

      }


    }


  };
  const [activeImage, setActiveImage] = useState(null);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  const handleImageDelete = () => {

    if (!activeImage) {
      return;
    }

    const labelId = activeImage.id;


    divRef.current.removeChild(activeImage);


    const newLabels = labeel.filter((label) => label !== activeImage);
    setLabeel(newLabels);


    const newLabelsMoved = { ...props.imageMoved };
    const pageLabelsMoved = newLabelsMoved[props.pageNum] || {};

    if (pageLabelsMoved[labelId]) {
      delete pageLabelsMoved[labelId];
      console.log('Supprimé avec succès');
    }

    newLabelsMoved[props.pageNum] = pageLabelsMoved;
    props.setImageMoved(newLabelsMoved);


    const updatedLabelsOnPages = { ...props.image };
    if (updatedLabelsOnPages[props.pageNum]) {
    updatedLabelsOnPages[props.pageNum] = updatedLabelsOnPages[props.pageNum].filter(
        (item) => item.element !== activeImage
      );
      props.setImage(updatedLabelsOnPages);
    }
  };
  const handleLabelClicked = (e) => {
    const clickedLabel = e.target;


console.log("label:"+clickedLabel)
    if (clickedLabel !== canvasRef.current || clickedLabel.tagName !== 'IMG') {
      props.setSelectedLabel(clickedLabel);


    } else {
      setClickedLabelType(null);
    }
  };


  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const handlePanelClose = () => {
    props.setSelectedLabel(null);
  };
const [selectedFontFamily, setSelectedFontFamily] = useState('Helvetica');
const [isBold, setIsBold] = useState(false);
const [isItalic, setIsItalic] = useState(false);
const [isUnderlined, setIsUnderlined] = useState(false);
const [selectedColor, setSelectedColor] = useState(null);
const handleLabelColorChange = (color) => {
  if (props.selectedLabel) {
    props.selectedLabel.style.color = color;
    setSelectedColor(color);

    const updatedLabelsOnPages = { ...props.labelsOnPages };
    if (updatedLabelsOnPages[props.pageNum]) {
      const labelIndex = updatedLabelsOnPages[props.pageNum].findIndex(
        (item) => item.element === props.selectedLabel
      );
      if (labelIndex !== -1) {
        updatedLabelsOnPages[props.pageNum][labelIndex].color = color;
      }
    }
    props.setLabelsOnPages(updatedLabelsOnPages);
  }
}

  const boldUnderlinedStyle = {
    textDecoration: ' underline 1px  ',
    display: 'inline',
    color:'black',
    fontSize:'20px'

  };
  const boldUnderlinedStylee = {
    textDecoration: props.selectedLabel ? `underline 3px ${props.selectedLabel.style.color}` : 'none',
    display: 'inline',
    fontSize: '20px'
  };
  const handleLabelFontFamilyChange = (fontFamily) => {
    if (props.selectedLabel) {

      props.selectedLabel.style.fontFamily = fontFamily;


      const labelId = props.selectedLabel.id;
      props.setLabelFontFamily((prevFontFamily) => ({
        ...prevFontFamily,
        [labelId]: fontFamily,
      }));
    }
  };

  const handleColorButtonClick = (color) => {
    setSelectedColor(color);
    handleLabelColorChange(color);
  };

  const classes = useStyles();
  return (
    <React.Fragment>


      <div
      id='content'
        ref={divRef}
        className={classes.root}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      // onDoubleClick={handleLabelClicked}
        onClick={handleLabelClick}
              >
        <canvas onClick={canvasClick} className={classes.root, "__page" + props.pageNum} ref={canvasRef}  />
        {images.map((image, id) => {
          return (
            <DraggableImage
              key={id}
              id={id}
              imageDelete={imageDelete}
              imageChange={imageChange}
              onDragStart={(e) => e.preventDefault()}
              pageNum={props.pageNum}
              image={image}

            >
              {children}
            </DraggableImage>
          );
        })}

{labels.map((label, id) => (

<React.Fragment key={id} >

{activeMoveable === label && (
<Moveable
          key={id}
          target={label}
          resizable
          draggable
          keepRatio
          snappable
          bounds={{
            left:30,
            top:30,
            right:props.pageDimensions.width-30,
            bottom:props.pageDimensions.height-30
          }}

          throttleResize={0}
          edge
          zoom={1}
          origin={false}



          padding={{ left: 10, right: 10, bottom: 30, top: 20 }}
               onRender={e => {
                   e.target.style.cssText += e.cssText;

                  }}



          onResizeStart={(e) => {
            e.setOrigin(["%", "%"]);
            e.dragStart && e.dragStart.set(props.frame.translate);
          }}
          onResize={({ target, width, height }) => {
            if (width <= props.pageDimensions.width - 100 && height <= props.pageDimensions.height - 100) {
              target.style.width = `${width}px`;
              target.style.height = `${height}px`;
              const initialHeight = 600;
              const initialFontSize = 300;
              const newFontSize = (height / initialHeight) * initialFontSize;
              target.style.fontSize = `${newFontSize}px`;
              props.setSizeFont(`${newFontSize}px`)
            }
          }}


          onDrag={(e) => {
            const newLabelsMoved = { ...props.labelsMoved };
            const pageLabelsMoved = newLabelsMoved[props.pageNum] || {};
            pageLabelsMoved[label.id] = e.beforeTranslate;

            newLabelsMoved[props.pageNum] = pageLabelsMoved;
            props.setLabelsMoved(newLabelsMoved);

            props.frame.translate = e.beforeTranslate;
            e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;


          }}



        >


</Moveable>

)}
 {props.selectedLabel === label && (
   <div className='overlay' style={{

     zIndex: 1000,
     position: 'absolute',
     top: label.offsetTop +(props.labelsMoved[props.pageNum] && props.labelsMoved[props.pageNum][props.selectedLabel.id] ? props.labelsMoved[props.pageNum][props.selectedLabel.id][1] : 0)- 125 + 'px',
     left: label.offsetLeft +(props.labelsMoved[props.pageNum] && props.labelsMoved[props.pageNum][props.selectedLabel.id] ? props.labelsMoved[props.pageNum][props.selectedLabel.id][0] : 0)+100  + 'px',
     transform: 'translate(-50%, -40%)',
   }} >

   <div

className='modalContainer' onClick={handlePopupClick}
>
<div className='modalRight'>
<IconButton onClick={handlePanelClose}>
    <Close /> </IconButton>
    <hr  style={{color:'red' ,backgroundColor:'blue'}}/>








  <div className='content'>

  <Table style={{ width:'460' , height:'40px'}}>
  <tr>
<td  style={{ border: '1px solid #ccc' , alignItems:'center' , textAlign:'center'}}>
<select
style={{ border: 'transparent', backgroundColor: 'transparent', borderRadius: '4px', height: '30px' }}
value={selectedFontFamily}
defaultValue={props.selectedLabel.style.font}
onChange={(e) => {
setSelectedFontFamily(e.target.value);
handleLabelFontFamilyChange(e.target.value);
}}
>
<option value='TimesRomanItalic'>TimesRomanItalic</option>
<option value='Times New Roman'>Times New Roman</option>
<option value='Courier'>Courier</option>
<option value='Helvetica'>Helvetica</option>
<option vaoption value='cursive'>cursive</option>
  </select>
</td>
<td style={{ border: '1px solid #ccc' , alignItems:'center' , textAlign:'center'}}>
<IconButton onClick={() => {setColorPickerVisible(!colorPickerVisible)}}>
<span style={boldUnderlinedStylee}>

<b>A</b>
</span>
  </IconButton>


  <IconButton onClick={() => handleLabelDuplicate(id)}>
    <FileCopy />
  </IconButton>

  </td>
  <td style={{ border: '1px solid #ccc' , alignItems:'center' , textAlign:'center'}}>
  {/*<IconButton onClick={() => setTextFormattingVisible(!textFormattingVisible)}>
     <span style={boldUnderlinedStyle}>

 <b>B</b>
</span>
  </IconButton>
*/}


  <IconButton onClick={() => handleLabelDelete(id)}   >
  <Delete />
</IconButton>


  </td>




</tr>

   <tr >
    <td></td>
   <td style={{  alignItems: 'center', textAlign: 'center' }}>
   {colorPickerVisible && (
    <div>

            <IconButton onClick={() => handleColorButtonClick('red')}>
              <span className="color-circle"
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'red', cursor: 'pointer' , marginLeft:'5px' }}
     ></span>
            </IconButton>
            <IconButton onClick={() => handleColorButtonClick('royalblue')}>
              <span className="color-circle"
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'royalblue', cursor: 'pointer' , marginLeft:'5' }}
     ></span>
            </IconButton>
            <IconButton onClick={() => handleColorButtonClick('green')}>
              <span className="color-circle"
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'green', cursor: 'pointer' , marginLeft:'5' }}
     ></span>
            </IconButton>
            <IconButton onClick={() => handleColorButtonClick('black')}>
              <span className="color-circle"
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'black', cursor: 'pointer' , marginLeft:'5' }}
     ></span>
            </IconButton>
            </div>
   )}
          </td>
    {/*<td  colSpan={1}>
    {textFormattingVisible && (
    <div className="text-formatting-panel"  style={{backgroundColor:'white'}}  >

    <IconButton
    onClick={() => {
    setIsBold(!isBold);
    props.selectedLabel.style.fontWeight = isBold ? 'normal' : 'bold';
    }}
    >
    <FormatBold />
    </IconButton>

              <IconButton
    onClick={() => {
    setIsItalic(!isItalic);
    props.selectedLabel.style.fontStyle = isItalic ? 'normal' : 'italic';
    }}
    >
    <FormatItalic />
    </IconButton>

    <IconButton
    onClick={() => {
    setIsUnderlined(!isUnderlined);
    props.selectedLabel.style.textDecoration = isUnderlined ? 'none' : 'underline';
    }}
    >
    <FormatUnderlined />
    </IconButton>

    </div>
  )}
 </td>
  */}
</tr>

</Table>

  </div>

</div>
</div>




   </div>
 )}


</React.Fragment>
        ))}
        {labeel.map((label, id) => (
          <React.Fragment key={id} >
{activeMoveable===label &&(
<Moveable
          key={id}
          target={label}
          resizable
          draggable
          keepRatio

          snappable
          ref={moveableRef}
          bounds={{
            left:30,
            top:30,
            right:props.pageDimensions.width-30,
            bottom:props.pageDimensions.height-30
          }}
          throttleResize={0}
          edge
          zoom={1}
          origin={false}
          onResizeStart={(e) => {
            e.setOrigin(["%", "%"]);
            e.dragStart && e.dragStart.set(props.frame.translate);
          }}
          onResize={({ target, width, height }) => {
            if (width <= props.pageDimensions.width - 100 && height <= props.pageDimensions.height - 100) {
              target.style.width = `${width}px`;
              target.style.height = `${height}px`;
              const initialHeight = 600;
              const initialFontSize = 300;
              const newFontSize = (height / initialHeight) * initialFontSize;
              target.style.fontSize = `${newFontSize}px`;
              props.setSizeFont(`${newFontSize}px`)
            }
          }}


          onDrag={(e) => {

            const newLabelsMoved = { ...props.imageMoved };
            const pageLabelsMoved = newLabelsMoved[props.pageNum] || {};
            pageLabelsMoved[label.id] = e.beforeTranslate;
            newLabelsMoved[props.pageNum] = pageLabelsMoved;
            props.setImageMoved(newLabelsMoved);

            props.frame.translate = e.beforeTranslate;
            e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;


          }}


        >



</Moveable>

)}
{activeImage===label && (
  <div>
        <div
          className="delete-icon"

          style={{
            zIndex: 1000,
     position: 'absolute',
     top: label.offsetTop +(props.imageMoved[props.pageNum] && props.imageMoved[props.pageNum][activeImage.id] ? props.imageMoved[props.pageNum][activeImage.id][1] : 0)+40+ 'px',
     left: label.offsetLeft +(props.imageMoved[props.pageNum] && props.imageMoved[props.pageNum][activeImage.id] ? props.imageMoved[props.pageNum][activeImage.id][0] : 0) + activeImage.width+12+ 'px',
     transform: 'translate(-50%, -40%)',

          }}
        >

          <IconButton
onClick={handleImageDelete}
    >
          <Delete /></IconButton>

        </div>
        <div
          className="delete-icon"

          style={{
            zIndex: 1000,
     position: 'absolute',
     top: label.offsetTop +(props.imageMoved[props.pageNum] && props.imageMoved[props.pageNum][activeImage.id] ? props.imageMoved[props.pageNum][activeImage.id][1] : 0) + 9+'px',
     left: label.offsetLeft +(props.imageMoved[props.pageNum] && props.imageMoved[props.pageNum][activeImage.id] ? props.imageMoved[props.pageNum][activeImage.id][0] : 0) + activeImage.width+14 + 'px',
     transform: 'translate(-50%, -40%)',

          }}
        >

          <IconButton

    >
          < FileCopy  onClick={() => handleLabelDuplicateImage(id)}/></IconButton>

        </div>
        </div>
      )}

</React.Fragment>
        ))}




      </div>

<div>

</div>

    </React.Fragment>

  )
}

