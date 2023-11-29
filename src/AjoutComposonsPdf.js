import React, { useContext, useEffect, useState } from 'react';
import Page from './Page';
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { grey } from '@material-ui/core/colors';
import { AppBar, Grid, makeStyles, Toolbar, Typography } from '@material-ui/core';


import CONSTS from './constants';
import { Link, useHistory } from 'react-router-dom';
import CustomButton from './CustomButton';
import { Button } from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import CreateIcon from '@material-ui/icons/Create';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import Comments from './Comments';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  {faCalendar, faDownload, faPenNib}  from '@fortawesome/free-solid-svg-icons'
import SignatureContext from './SignatureContext';
import * as  fileDownload from 'js-file-download';
import Cookies from 'js-cookie';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import './input.css'
import { faPen , faUser ,faBuilding , faSignature , faCalendarAlt , faStamp,faEnvelope , faEllipsisH   } from '@fortawesome/free-solid-svg-icons';

import { faHexagon } from '@fortawesome/free-solid-svg-icons';


import './PDFEditor/FieldBox/FieldBox.module.scss'
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import Loader from './Loader';
import DraggableTextLabel from './DraggableTextLabel'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { toBlob } from 'html-to-image';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Page1 from './page1';
import fontkit from '@pdf-lib/fontkit';
export default function AjoutComposonSPdf(props, labels , canvasRef ,label , pageNum
   ) {

    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    const [state, _setState] = useState({
        scale: 1.3,
        pages: [],
        name: null,
        pdf: null,
        open: false,
        mode:'none'
    })
    const zlib = require('zlib');
    const base64 = require('base64-js');
    const [loader,setLoader] = useState(false);
    const [owner,setOwner] = useState(false);
    const [images,setImages] = useState(null);
    const [defautlt,setDefauult] = useState();
    const [signatureData,setSignatureData] = useState({});
    const [TamponData,setTamponData] = useState({});
    const defaultt = signatureData.defaultSignature === 0 ? signatureData.signature : signatureData.imageSignature;

    const setState = (data) => {
        _setState({ ...state, ...data });
    }
    const toBase64 = (buffer)=>{
        let TYPED_ARRAY = new Uint8Array(buffer);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
          }, '');
        let base64String = btoa(STRING_CHAR);
          return 'data:image/png;base64, '+base64String;

      }
    useEffect(() => {

        setState({ pdf: props.pdf});
        if(props.owner===Cookies.get('email'))
            {
              setOwner(true);
            }




        let pdfPages = [];
        const loadingTask = pdfjsLib.getDocument(props.pdf);

        loadingTask.promise.then(function (pdf) {
            setImages(Array(pdf.numPages));
            for (let i = 0; i < pdf.numPages; i++) {
                pdf.getPage(i + 1).then(page => {
                    pdfPages = [...pdfPages, page]
                    if (pdfPages.length === pdf.numPages) {
                        setState({ pages: pdfPages });
                    }
                })
            }
        });

        axios.get('/api/users/getsignatures',{withCredentials:true}).then(
            (data)=>{
                let signature = null;
                let imageSignature= null;
                if(data.data.signature)
                 signature = toBase64(data.data.signature.data);
                 if(data.data.imageSignature)
                 imageSignature =toBase64(data.data.imageSignature.data);
                setSignatureData({
                  signature:signature,
                  imageSignature:imageSignature,
                  defaultSignature:data.data.defaultSignature
                })

            }

        )
        axios.get('/api/users/getTampon',{withCredentials:true}).then(
          (data)=>{

              let TamponImage= null;
              if(data.data.TamponImage)


               TamponImage =toBase64(data.data.TamponImage.data);
                setTamponData({

                TamponImage:TamponImage,

              })

          }

      )


    }, [props]);
    const imagesChange = (pageNum,data)=>{
        let newImages = images;
        newImages[pageNum] = data;
        setImages(newImages);
    }
    const useStyles = makeStyles(({
        root: {
            height: '88vh',
            maxHeight: '88vh',
            backgroundColor: grey[100]
        },
        title: {
            fontFamily: 'poppins',
            fontWeight: 600
        }
    }))


    const [frame, setFrame] = useState({
      translate: [0, 0]
    });
    const [labelsOnPages, setLabelsOnPages] = useState({});

    const [ImageOnPage, setImageOnPages] = useState({});
    const [sizeFont, setSizeFont] = useState();
    const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
    const [labelPositions, setLabelPositions] = useState({});

    const [finalLabelPositions, setFinalLabelPositions] = useState([]);
    const [movedLabels, setMovedLabels] = useState({});
    const [labelsMoved, setLabelsMoved] = useState({});

    const [imageMoved, setImageMoved] = useState({});
    const [labelFonts, setLabelFonts] = useState({});
    const [labelColors, setLabelColors] = useState({});
    const [labelFontFamily, setLabelFontFamily] = useState({});
    const [image, setImage] = useState({});
    const [labeels, setLabeels] = useState([]);
    const generatePages = () => {

        return state.pages.map((page, index) => {

            return (
                <Page1
                    key={`page_${index + 1}`}
                    page={page}
                    scale={state.scale}
                    pageNum={index}
                    mode = {state.mode}
                    setState = {setState}
                    imagesChange = {imagesChange}
                    pdf={props.pdf}
                    setLabelsOnPages={setLabelsOnPages}
                    movedLabels={movedLabels}
                    labeels={labeels}
                    setLabeels={setLabeels}
                    setMovedLabels={setMovedLabels}
                    labelsOnPages={labelsOnPages}
                   setFrame={frame}
                   frame={frame}
                   image={image}
                   setImage={setImage}
                   pageDimensions={pageDimensions}
                   setPageDimensions={setPageDimensions}
                   labelPositions={labelPositions}
                   setLabelPositions={setLabelPositions}
                   sizeFont={sizeFont}
                   setSizeFont={setSizeFont}
                   finalLabelPositions={finalLabelPositions}
                   setFinalLabelPositions={setFinalLabelPositions}
                   labelsMoved={labelsMoved}
                   setLabelsMoved={setLabelsMoved}
                  ImageOnPage={ImageOnPage}
                  setImageOnPages={setImageOnPages}
                   labelFontFamily={labelFontFamily}
                   setLabelFontFamily={setLabelFontFamily}
                  signatureImage ={ signatureData.imageSignature}
                  signature={signatureData.signature}
                  signDefault={signatureData.defaultSignature}
                  imageMoved={imageMoved}
                  setImageMoved={setImageMoved}
                  TamponImage={TamponData.TamponImage}
                  email={Cookies.get('email')}

                />
            );
        })
    }
    const [labelPositionss, setLabelPositionss] = useState({});
    const history= useHistory();
    const setSigningMode = ()=>{
       if(signatureData.signature || signatureData.imageSignature)setState({mode:'sign'});
       else {
            history.push('/sig');
       }
   }
   const handleSign = async () =>{
    try {
      const pdfBytes = new Uint8Array(props.pdf.data);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      if (!pdfDoc) {
        console.error('Impossible de charger le PDF.');
        return;
      }
      const allPositions = [];
      for (let pageNum = 0; pageNum < state.pages.length; pageNum++) {
        const page = pdfDoc.getPages()[pageNum];

        if (labelsOnPages[pageNum]) {
          const labelsOnPage = labelsOnPages[pageNum];

          for (let i = 0; i < labelsOnPage.length; i++) {



            const label = labelsOnPage[i];
            const text = label.element.innerHTML;

            console.log(label.element)
            const labelId=label.element.id
            const { left, top } = label;
            console.log(left +"top:"+top)
            const offsetX = parseFloat(left) + (labelsMoved[pageNum] && labelsMoved[pageNum][label.element.id] ? labelsMoved[pageNum][label.element.id][0] : 0);
            const offsetY = parseFloat(top) + (labelsMoved[pageNum] && labelsMoved[pageNum][label.element.id] ? labelsMoved[pageNum][label.element.id][1] : 0);


            const pdfWidth = page.getWidth();
            const pdfHeight = page.getHeight();

            const x1 = offsetX * (pdfWidth / pageDimensions.width);
            const y1 = pdfHeight - offsetY * (pdfHeight / pageDimensions.height)-12;
            console.log('type:'+label.element.type)
            const positions = {
              page: pageNum,
              elementId: label.element.id   ,
              typee:label.element.typee,
              x: x1,
              y: y1,

            };
            allPositions.push(positions);

            const fontSizeString = window.getComputedStyle(label.element).getPropertyValue('font-size');
            const fontSize = parseFloat(fontSizeString);
            console.log('size:'+fontSize)
            const colorString = window.getComputedStyle(label.element).getPropertyValue('color') ;
            console.log("ggggg"+colorString)
            const colorArray = colorString.match(/\d+/g);
              console.log('image'+labeels)

                const red = parseInt(colorArray[0]) / 255;
                const green = parseInt(colorArray[1]) / 255;
                const blue = parseInt(colorArray[2]) / 255;


                    const color = rgb(red, green, blue);
                console.log('colorString:'+colorString)



                  const fontFamily = window.getComputedStyle(label.element).getPropertyValue('font-family').replace(/['"]+/g, '');

                console.log(fontFamily);

                let font;
                if (fontFamily === 'Times New Roman') {
                  font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
                } else if (fontFamily === 'TimesRomanItalic') {
                  font = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
                } else if (fontFamily === 'Courier') {
                  font = await pdfDoc.embedFont(StandardFonts.Courier);
                } else if (fontFamily === 'cursive') {
                  font = await pdfDoc.embedFont(StandardFonts.CourierOblique);
                } else {
                  font = await pdfDoc.embedFont(StandardFonts.Helvetica);
                }

                console.log("font:"+labelPositionss)

                    if (!isNaN(fontSize)  ) {

                      page.drawText(text, {
                        x: x1,
                        y: y1,
                        size: fontSize,
                        color: color,
                    font:font
                      });




                    } else {
                      console.error('Invalid font size:', fontSizeString);
                    }

          }

        }
        if (image[pageNum]) {
          const imagesOnPage = image[pageNum];

          for (let j = 0; j < imagesOnPage.length; j++) {
            const image = imagesOnPage[j];
            const imageSrc = image.element.src;

            const imageBuffer = await fetch(imageSrc).then((response) => response.arrayBuffer());
            const embeddedImage = await pdfDoc.embedPng(imageBuffer);
            const fontSizeString = window.getComputedStyle(image.element).getPropertyValue('height');
            const height = parseFloat(fontSizeString);
            const widthString = window.getComputedStyle(image.element).getPropertyValue('width');
            const width = parseFloat(widthString);
            const imageID = image.element.id
              console.log('imageId'+imageID)
            const { left, top } = image;
            const offsetX = parseFloat(left) + (imageMoved[pageNum] && imageMoved[pageNum][image.element.id] ? imageMoved[pageNum][image.element.id][0] : 0);
            const offsetY = parseFloat(top) + (imageMoved[pageNum] && imageMoved[pageNum][image.element.id] ? imageMoved[pageNum][image.element.id][1] : 0);

            const pdfWidth = page.getWidth();
            const pdfHeight = page.getHeight();
            const x = offsetX * (pdfWidth / pageDimensions.width);
            const y = pdfHeight - offsetY * (pdfHeight / pageDimensions.height) - height;

            const positions = {
              page: pageNum,
              elementId: image.element.id   ,
              typee:image.element.typee,
              x: x,
              y: y,

            };
            allPositions.push(positions);
            console.log("w:"+width+"h:"+height)
            page.drawImage(embeddedImage, {
              x,
              y,
              width: width,
              height: height,
            });
          }
        }


      }
      await axios.post(`/api/documents/${localStorage.getItem('current_id')}/add-positions`, { positions:allPositions });
      const payload = {
        subject: "Document pour Signerrrr",
        body: `http://localhost:3000/doc/${localStorage.getItem('current_id')}`
      };

      axios.post(`../api/documents/${localStorage.getItem('current_id')}/email`, payload)
        .then(data => {
          console.log("Success");
          history.push('/status');
        })
        .catch(error => {
          console.error("Error:", error);
          // Handle error if needed
        });
    history.push('/status')
      const pdfModifier = await pdfDoc.save();
      const pdfBuffer = Buffer.from(pdfModifier);
      const compressedData = zlib.deflateSync(pdfBuffer);
      const pdfBase64 = compressedData.toString('base64');
      console.log('b:' + pdfBase64);






    } catch (error) {
      console.error('Erreur  de la création du PDF :', error);
    }
}


  const downloadPDF = async () => {
    try {
      const pdfBytes = new Uint8Array(props.pdf.data);
      const pdfDoc = await PDFDocument.load(pdfBytes);



      if (!pdfDoc) {
        console.error('Impossible de charger le PDF.');
        return;
      }


      const pdfModifier = await pdfDoc.save();


      fileDownload(pdfModifier, 'signed.pdf');
    } catch (error) {
      console.error('Erreur  de la création du PDF :', error);
    }
  };



    const classes = useStyles();

    return (
          <SignatureContext.Provider value={signatureData}>
            <Loader open={loader}></Loader>
            <AppBar position="static" style={{ backgroundImage: CONSTS.backgroundImage }}>
                <Toolbar>
                    <Button color="inherit" onClick={()=>history.goBack()}><ArrowBackIosIcon fontSize="small"></ArrowBackIosIcon> </Button>
                    <Typography variant="body1" className={classes.title}>
                        <PictureAsPdfIcon style={{ position: 'relative', top: '5px' }}></PictureAsPdfIcon> <span>{props.name}</span>
                    </Typography>
                    <div style={{ marginLeft: 'auto' }}>
                        <Button color="inherit" onClick={() => { setState({ open: true }) }}><CommentIcon></CommentIcon></Button>
                     {(owner && !props.isOwnerSigner) || props.signed ? (<></>) : (
                         <>
                        <Button color="inherit" onClick={() => { setState({ open: false }) }} ><CreateIcon></CreateIcon></Button>

                         </>
                     )}
                     {props.statuus==='signed'  && (
                         <>
                        <Button color="inherit" onClick={downloadPDF} ><FontAwesomeIcon icon={faDownload} size='lg'></FontAwesomeIcon></Button>
                        </>
                    )}
                    </div>


                </Toolbar>
            </AppBar>

            <Grid container>
                <Grid item xs={props.signed ? 12 : 9}>
                    <div className={classes.root}>
                        <PerfectScrollbar>

                        {generatePages()}
                        </PerfectScrollbar>
                    </div>
                </Grid>

                <Grid item xs={3}  >
                <Grid container style={{width:'100%',height:'100%'}} justify='center' alignItems='center'>
                      <div >



<h2  style={{textAlign:'center' }}>Fields</h2>
    <Grid container style={{ width: '100%', height: '100%' , display: 'flex'}} >
      <div>

     </div>
      <Grid>




&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<div


data-type="Initial"
draggable
onDragStart={(e) => {
  e.dataTransfer.setData('text/plain', 'Initial');
}}
  style={{ display: 'flex', alignItems: 'center' }}
>
  <button
    style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '180px', height: '54px', fontFamily: 'poppins' }}
  >
    <b style={{fontSize:'15px', fontFamily:'cursive'}}>Initial</b>
  </button>
  <div className='iconne' >
    <FontAwesomeIcon icon={faUser} style={{ fontSize: '15px', width: '17px'  }} />
  </div>
</div><br/>
    <div


    data-type="Name"
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('text/plain', 'Name');
    }}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <button
        style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '180px', height: '54px', fontFamily: 'poppins' }}
      >
        <b style={{fontSize:'15px', fontFamily:'cursive'}}>Name</b>
      </button>
      <div className='iconne' >
        <FontAwesomeIcon icon={faUser} style={{ fontSize: '15px', width: '17px'  }} />
      </div>
    </div>

    <br/>
    <div
    data-type="Company"
    data-field="Company"
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('text/plain', 'Company');

    }}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <button
        style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '180px', height: '55.3px', fontFamily: 'poppins' }}
      >
        <b style={{fontSize:'15px', fontFamily:'cursive'}}>Company</b>
      </button>
      <div className='iconne' >
        <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '15px', width: '17px' }} />
      </div>
    </div>
    <br/>
    <div
    data-type="Email"
    data-field="Email"
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('text/plain', 'Email');

    }}
      style={{ display: 'flex', alignItems: 'center' }}
    >

      <button
        style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '180px', height: '54.3px', fontFamily: 'poppins' }}
      >
        <b style={{fontSize:'13.8px', fontFamily:'cursive'}}>Email</b>
      </button>
      <div className='iconne' >
        <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '15px', width: '17px' }} />
      </div>
    </div>
    <br/>
    <div
    data-type="Date"
    data-field="Date"
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('text/plain', 'Date');

    }}
      style={{ display: 'flex', alignItems: 'center' }}
    >

      <button
        style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '180px', height: '54.3px', fontFamily: 'poppins' }}
      >
        <b style={{fontSize:'13.8px', fontFamily:'cursive'}}>Date</b>
      </button>
      <div className='iconne' >
        <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '15px', width: '17px' }} />
      </div>
    </div>
    <br/>
    <div
      data-field="Signature"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', 'Signature');
      }}
      style={{ display: 'flex', alignItems: 'center' }}
    >

   <button
        style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '180px', height: '54.3px', fontFamily: 'poppins' }}
      >
        <b style={{fontSize:'13.8px', fontFamily:'cursive'}}>Signature</b>
      </button>
        <div className='iconne' >
          <FontAwesomeIcon icon={faSignature} style={{ fontSize: '15px', width: '17px' }} />
        </div>

    </div>



    <br/>
    <div
      data-field="Tampon d'entreprise"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', "Tampon d'entreprise");
      }}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <button
        style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '180px', height: '54.3px', fontFamily: 'poppins' }}
      >
        <b style={{fontSize:'13.8px', fontFamily:'cursive'}}>Tampon d'entreprise</b>
      </button>
      <div className='iconne' >
        <FontAwesomeIcon icon={faStamp} style={{ fontSize: '15px', width: '17px' }} />
      </div>
    </div>
    <div >
    <br/>
    <CustomButton text="Send" onClick={handleSign} style={{width:'80%',margin:'10px' , marginLeft:'20px'}} ></CustomButton>



    </div>
    </Grid>
      </Grid>
                        </div>
                    </Grid>
            </Grid>

                </Grid>
              </SignatureContext.Provider>

        );
    }
