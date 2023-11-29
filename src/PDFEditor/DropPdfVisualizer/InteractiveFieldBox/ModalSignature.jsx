import React, { useState ,useRef } from 'react';
import nft from './nft.jpg';
import SignatureCanvas from 'react-signature-canvas';
import { clear } from 'google-auth-library/build/src/auth/envDetect';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
const ModalSignaturre = ({ open, onClose , selectedFieldData , inputValue , setContent }) => {
  const [selectedOption, setSelectedOption] = useState(null);


  const signatureRef = useRef();
  const signatureCanvasRef = useRef(null);
  const [penColor, setPenColor] = useState('black'); // État pour la couleur du stylo


  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);


  const [signatureDataURL, setSignatureDataURL] = useState('');

  const handleSaveImga = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL();
      setSignatureDataURL(signatureData);
      setContent(`<img src="${signatureData}" alt="Signature" style="max-width: 130px; maw-height:70px"  />`);
      console.log(signatureData)
      onClose()
    }
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
        className='modalContainerr'
      >
        <div className='modalRight'>

         <h4 style={{textAlign:'center'}}>Ajouter votre signature</h4>

          <div className='content'>
          <Grid container alignItems='center'  style={{ textAlign: 'center', width:'850px', marginTop: '10px', marginLeft: '0px', paddingLeft: '0px', marginRight:"10px" }} >

          <Grid item container xs={2} sm={1} lg={1} justify="flex-end" style={{backgroundColor:grey[100],borderRadius:'20px'}}>
            <Grid item xs={6} id="black" style={{margin:'10px'}} onClick={()=>setPenColor("black")} >
                <div style={{backgroundColor:'black',width:'30px',height:'30px',borderRadius:'50%',border:(penColor=="black"? "2px solid skyblue":"none" )}}>

                </div>
            </Grid>
            <Grid item id="blue" xs={6} style={{margin:'10px'}} onClick={()=>setPenColor("blue")}>
                <div style={{backgroundColor:'blue',width:'30px',height:'30px',borderRadius:'50%',border:(penColor=="blue"? "2px solid skyblue":"none" )}}>

                </div>
            </Grid>
            <Grid item id="green" xs={6} style={{margin:'10px'}} onClick={()=>setPenColor("green")}>
                <div style={{backgroundColor:'green',width:'30px',height:'30px',borderRadius:'50%',border:(penColor=="green"? "2px solid skyblue":"none" )}}>

                </div>
            </Grid>
            <Grid item id="red" xs={6} style={{margin:'10px'}} onClick={()=>setPenColor("red")}>
                <div style={{backgroundColor:'red',width:'30px',height:'30px',borderRadius:'50%',border:(penColor=="red"? "2px solid skyblue":"none" )}}>

                </div>
            </Grid>

            </Grid>
            <Grid item container xs={10} sm={8} lg={8} >

            <div  style={{ width: '100%',boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
 }}>
          <SignatureCanvas
      className='styles.ll'
        ref={(ref) => {
          signatureRef.current = ref;
          signatureCanvasRef.current = ref;
        }}
        penColor={penColor} // Utilisez l'état de la couleur du stylo
        canvasProps={{  className: 'signatureCanvas' ,backgroundColor:'whitesmoke'}}
      />

</div>
            </Grid>
            </Grid>


          <div className='btnContainer'>
            <button className='btnPrimary' onClick={handleSaveImga} >
              <span className='bold'>Appliquer</span>
            </button>
            <button className='btnOutline'  onClick={handleClear}  >
              <span className='bold' >Clear</span>
            </button>
          </div>
        </div>
      </div>
   </div>
   </div>
  );
};

export default ModalSignaturre;
