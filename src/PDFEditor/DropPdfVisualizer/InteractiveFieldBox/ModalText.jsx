import React, { useState ,useRef } from 'react';
import nft from './nft.jpg';
import SignatureCanvas from 'react-signature-canvas';
import { clear } from 'google-auth-library/build/src/auth/envDetect';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
const ModalText = ({ open, onClose , selectedFieldData , inputValue , setContent ,inputSize , setInputSize , selectedFont , setSelectedFont}) => {
  const [selectedOption, setSelectedOption] = useState(null);


  const signatureRef = useRef();
  const signatureCanvasRef = useRef(null);
  const [penColor, setPenColor] = useState('black'); // État pour la couleur du stylo


  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);




  //
  const handleFontFamilyChange = (event) => {
    setSelectedFont(event.target.value);
  };

  const handleInputChangeSize = (event) => {
    setInputSize(parseInt(event.target.value));
  };

  const [signatureDataURL, setSignatureDataURL] = useState('');

  const textt = () => {
    setContent(image);
    onClose()
  };
  const handleClear = () => {
    signatureRef.current.clear();
  };
  if (!open) return null;
  return (
    <div onClick={onClose} className='overlay'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <div className='modalRight'>

         <h4 style={{textAlign:'center'}}>Ajouter votre signature</h4>
<label style={{marginLeft:'20px'}}><b>Field name </b></label>
          <input type='text'  onChange={(e)=>setImage(e.target.value)}  style={{marginLeft:'20px' ,border:'2px solid black' , borderRadius:'3px' , width:'200px' , height:'30px'}}   />

      <br/>
      <div>

        <h2  style={{marginLeft:'20px'}}>     Size:</h2>
      <input type='number' placeholder='nouvelle size' value={inputSize} onChange={handleInputChangeSize} style={{marginLeft:'20px'}}></input></div><br/>
        <div>

            <label htmlFor='fontFamilyDropdown'  style={{marginLeft:'20px'}}>Font Family:&nbsp;&nbsp;</label>
            <select id='fontFamilyDropdown' value={selectedFont} onChange={handleFontFamilyChange}>
              <option value='Arial'>Arial</option>
              <option value='Times New Roman'>Times New Roman</option>
              <option value='Verdana'>Verdana</option>
              <option value='Helvetica'>Helvetica</option>Cambria
              {/* Add more font options as needed */}
              <option value='Cambria'>Cambria</option>
            </select>
            </div>
          <div className='btnContainer'>
            <button className='btnPrimary' onClick={textt} >
              <span className='bold'>Appliquer</span>
            </button>
            <button className='btnOutline'  onClick={onClose}  >
              <span className='bold' >Annuler</span>
            </button>
          </div>
        </div>
      </div>
   </div>

  );
};

export default ModalText;
