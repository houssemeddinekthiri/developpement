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

export default function Page1(props, children ) {

  const [textFormattingVisible, setTextFormattingVisible] = useState(false);

  const divRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);


  useEffect(() => {
    let viewport = props.page.getViewport({ scale: props.scale });
    let canvas = canvasRef.current;
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
    if (!selectedLabel) {
      return;
    }

    const labelId = selectedLabel.id;


    divRef.current.removeChild(selectedLabel);


    const newLabels = labels.filter((label) => label !== selectedLabel);
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
        (item) => item.element !== selectedLabel
      );
      props.setLabelsOnPages(updatedLabelsOnPages);
    }
  }






  const handleLabelDuplicate = (id) => {
    if (selectedLabel) {
      const newLabel = selectedLabel.cloneNode(true);
      const offsetX = parseInt(newLabel.style.left, 10) + 20;
      const offsetY = parseInt(newLabel.style.top, 10) + 20;

      newLabel.style.left = offsetX + 'px';
      newLabel.style.top = offsetY + 'px';

newLabel.id = 'label_' + Date.now();
      newLabel.style.color = selectedLabel.style.color;
newLabel.typee=selectedLabel.typee
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
  if (labelData === 'signature') {

    setShowSignature(true);


    const signatureImage = new Image();

    signatureImage.onload = () => {
      const offsetX = event.nativeEvent.offsetX;
  const offsetY = event.nativeEvent.offsetY;
      const imageWidth = 90;
      const imageHeight = 40;
      const signature = document.createElement('div');


      signature.style.backgroundColor= 'rgb(157, 194, 231)'
      signature.style.border='2px solid rgb(157, 194, 231)'
      signature.style.borderRadius='4px'
      signature.style.color='white'

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
      signature.style.display = 'flex';
signature.style.alignItems = 'center';
signature.style.justifyContent = 'center';
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





  } else  if (labelData === "Tampon d'entreprisee") {
    setShowTampon(true);


    const TamponImage = new Image();
    TamponImage.src = props.signatureImage;
    TamponImage.onload = () => {
      const offsetX = event.nativeEvent.offsetX;
  const offsetY = event.nativeEvent.offsetY;
      const imageWidth = 100;
      const imageHeight = 40;
      const image = document.createElement('img');



      image.alt = 'Signature';
      image.style.position = 'absolute';
      image.style.left = offsetX + 'px';
      image.style.top = offsetY + 'px';
      image.style.width = imageWidth + 'px';
      image.style.height = imageHeight + 'px';
      image.contentEditable=false;
      image.draggable = false;
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
else if(labelData==='Emaill'){
  const offsetX = event.nativeEvent.offsetX;
  const offsetY = event.nativeEvent.offsetY;

  const label = document.createElement('div');
  label.innerHTML = labelData;
  label.style.position = 'absolute';
label.style.width=120+'px'
label.style.height=40 +'px'

  label.style.left = offsetX + 'px';
  label.style.top = offsetY + 'px';

label.style.textAlign='center'
  label.id = 'label_' + Date.now();
label.typee='Email'
label.style.backgroundColor= 'transparent'
label.style.border='2px solid rgb(157, 194, 231)'
label.style.borderRadius='4px'
label.style.color='rgb(157, 194, 231)'

  const newLabels = { ...props.labelsOnPages };

  if (!newLabels[props.pageNum]) {
    newLabels[props.pageNum] = [];
  }
  label.style.display = 'flex';
label.style.alignItems = 'center';
label.style.justifyContent = 'center';

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
  const imageWidth = 120;
  const imageHeight = 40;
  const label = document.createElement('div');
  label.innerHTML = labelData;
  label.style.position = 'absolute';
label.style.width=120+'px'
label.style.height=40 +'px'
label.style.cursor = 'move';
  label.style.left = offsetX + 'px';
  label.style.top = offsetY + 'px';
  label.style.backgroundColor= 'transparent'
label.style.border='2px solid rgb(157, 194, 231)'
label.style.borderRadius='4px'
label.style.color='rgb(157, 194, 231)'
label.style.textAlign='center'
label.style.backgroundColor='rgb(157, 194, 231)'
label.style.color='white'
label.style.display = 'flex';
label.style.alignItems = 'center';
label.style.justifyContent = 'center';
  label.id = 'label_' + Date.now();
if(labelData==='Name'){
  label.typee='Name'

}
else if(labelData==='Date'){
  label.typee='Date'


}
else if(labelData==='Email'){
  label.typee='Email'
}
else if(labelData==='Initial'){
  label.typee='Initial'

}
else if(labelData==="Tampon d'entreprise"){
  label.typee='Tampon'
  label.style.width=120+'px'
  label.style.height=40+'px'
  label.style.backgroundColor='rgb(157, 194, 231)'
label.style.color='white'
label.style.display = 'flex';
label.style.alignItems = 'center';
label.style.justifyContent = 'center';

}
else if(labelData==='Signature'){
label.typee="Signature"
label.style.width=imageWidth+'px'
label.style.height=imageHeight+'px'
label.style.backgroundColor='rgb(157, 194, 231)'
label.style.color='white'
label.style.display = 'flex';
label.style.alignItems = 'center';
label.style.justifyContent = 'center';
}
else{
  label.typee='Company'
}
  const newLabels = { ...props.labelsOnPages };

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
};

const [draggingLabel, setDraggingLabel] = useState(null);
const [selectedLabel, setSelectedLabel] = useState(null);

const [clickedLabelType, setClickedLabelType] = useState(null);

const [activeMoveable, setActiveMoveable] = useState(null);

  const [inputLabel, setInputLabel] = useState(false);

  const handleLabelClick = (e) => {
    const clickedLabel = e.target;

    if (clickedLabel === canvasRef.current) {
setSelectedLabel(null)
      setActiveMoveable(null);
setActiveImage(null)
    } else {

console.log("gggg:"+clickedLabel.textContent)
setSelectedLabel(clickedLabel)
      setActiveMoveable(clickedLabel);
      setDraggingLabel(clickedLabel)


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
      setSelectedLabel(clickedLabel);


    } else {
      setClickedLabelType(null);
    }
  };


  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const handlePanelClose = () => {
    setSelectedLabel(null);
  };
const [selectedFontFamily, setSelectedFontFamily] = useState('Helvetica');
const [isBold, setIsBold] = useState(false);
const [isItalic, setIsItalic] = useState(false);
const [isUnderlined, setIsUnderlined] = useState(false);
const [selectedColor, setSelectedColor] = useState(null);
const handleLabelColorChange = (color) => {
  if (selectedLabel) {
    selectedLabel.style.color = color;
    setSelectedColor(color);

    const updatedLabelsOnPages = { ...props.labelsOnPages };
    if (updatedLabelsOnPages[props.pageNum]) {
      const labelIndex = updatedLabelsOnPages[props.pageNum].findIndex(
        (item) => item.element === selectedLabel
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
    textDecoration: selectedLabel ? `underline 3px ${selectedLabel.style.color}` : 'none',
    display: 'inline',
    fontSize: '20px'
  };
  const handleLabelFontFamilyChange = (fontFamily) => {
    if (selectedLabel) {

      selectedLabel.style.fontFamily = fontFamily;


      const labelId = selectedLabel.id;
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
      //  onDoubleClick={handleLabelClicked}
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
          targetProps={{
            style: {
              width: '150px'
            }
          }}
          dragWithClip={true}
          padding={{ left: 10, right: 10, bottom: 10, top: 10 }}
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
 {selectedLabel === label && (
   <div>
   <div
     className="delete-icon"

     style={{
       zIndex: 1000,
position: 'absolute',
top: label.offsetTop +(props.labelsMoved[props.pageNum] && props.labelsMoved[props.pageNum][selectedLabel.id] ? props.labelsMoved[props.pageNum][selectedLabel.id][1] : 0)+4+ 'px',
     left: label.offsetLeft +(props.labelsMoved[props.pageNum] && props.labelsMoved[props.pageNum][selectedLabel.id] ? props.labelsMoved[props.pageNum][selectedLabel.id][0] : 0) + 144+ 'px',
    transform: 'translate(-50%, -40%)',

     }}
   >

     <IconButton
onClick={handleLabelDelete}
>
     <Delete /></IconButton>

   </div>
   <div
     className="delete-icon"

     style={{
      zIndex: 1000,
position: 'absolute',
top: label.offsetTop +(props.labelsMoved[props.pageNum] && props.labelsMoved[props.pageNum][selectedLabel.id] ? props.labelsMoved[props.pageNum][selectedLabel.id][1] : 0)+30+ 'px',
    left: label.offsetLeft +(props.labelsMoved[props.pageNum] && props.labelsMoved[props.pageNum][selectedLabel.id] ? props.labelsMoved[props.pageNum][selectedLabel.id][0] : 0) + 147+ 'px',
   transform: 'translate(-50%, -40%)',

    }}
   >

     <IconButton

>
     < FileCopy  onClick={() => handleLabelDuplicate(id)}/></IconButton>

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
{activeImage==='Initial' && (
  <div>
        <div
          className="delete-icon"

          style={{
            zIndex: 1000,
     position: 'absolute',
     top: label.offsetTop +(props.imageMoved[props.pageNum] && props.imageMoved[props.pageNum][activeImage.id] ? props.imageMoved[props.pageNum][activeImage.id][1] : 0)+10 + 'px',
     left: label.offsetLeft +(props.imageMoved[props.pageNum] && props.imageMoved[props.pageNum][activeImage.id] ? props.imageMoved[props.pageNum][activeImage.id][0] : 0) + activeImage.width-10 + 'px',
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
     top: label.offsetTop +(props.imageMoved[props.pageNum] && props.imageMoved[props.pageNum][activeImage.id] ? props.imageMoved[props.pageNum][activeImage.id][1] : 0)+10 + 'px',
     left: label.offsetLeft +(props.imageMoved[props.pageNum] && props.imageMoved[props.pageNum][activeImage.id] ? props.imageMoved[props.pageNum][activeImage.id][0] : 0) + activeImage.width-40 + 'px',
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
