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
import  {faDownload, faPenNib}  from '@fortawesome/free-solid-svg-icons'
import SignatureContext from './SignatureContext';
import * as  fileDownload from 'js-file-download';
import Cookies from 'js-cookie';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import './input.css'
import DraggableImage from './DraggableImage';
import { faPen , faUser ,faBuilding , faSignature , faCalendarAlt , faStamp,faEnvelope ,faCog} from '@fortawesome/free-solid-svg-icons';
import './PDFEditor/FieldBox/FieldBox.module.scss'
import PerfectScrollbar from "react-perfect-scrollbar";
import imgg from './AC.png'
import Loader from './Loader';
import DraggableTextLabel from './DraggableTextLabel'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { toBlob } from 'html-to-image';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import fontkit from '@pdf-lib/fontkit';
export default function Pdf(props, labels , canvasRef ,label , pageNum , children
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


            console.log(images)
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
    const [labelFontFamily, setLabelFontFamily] = useState({});
    const [image, setImage] = useState({});
    const [labeels, setLabeels] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [imagess, setImagess] = useState([]);
    const [can, setCan] = useState();
    const generatePages = () => {

        return state.pages.map((page, index) => {

            return (
                <Page
                    key={`page_${index + 1}`}
                    page={page}
                    scale={state.scale}
                    pageNum={index}
                    mode = {state.mode}
                    setState = {setState}
                    imagesChange = {imagesChange}
                    pdf={ props.pdf}
                    setLabelsOnPages={setLabelsOnPages}
                    movedLabels={movedLabels}
                    labeels={labeels}
setCan={setCan}
                    setLabeels={setLabeels}
                    setMovedLabels={setMovedLabels}
                    labelsOnPages={labelsOnPages}
                   setFrame={frame}
                   frame={frame}
                   image={image}
                   imagess={imagess}
                   setImagess={setImagess}
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
                  name={Cookies.get('name')}
                  selectedLabel={selectedLabel}
                  setSelectedLabel={setSelectedLabel}

                />
            );
        })


    }

    const [labelPositionss, setLabelPositionss] = useState([]);
  useEffect(() => {
      axios.get(`/api/documents/${localStorage.getItem('current_id')}/positions`, { withCredentials: true })
          .then((response) => {
              setLabelPositionss(response.data);
              console.log("pos:" + labelPositionss);
          })
          .catch((error) => {
              console.error(error);
          });
  }, []);

   const history= useHistory();
   const setSigningMode = ()=>{
       if(signatureData.signature || signatureData.imageSignature)setState({mode:'sign'});
       else {
            history.push('/sig');
       }
   }
   const handleSign = async () =>{
    try {

      const pdfBytes = new Uint8Array(props.pdf1);
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

            console.log("eeeeeeeee"+embeddedImage)
            console.log('kkkkkk')
            page.drawImage(embeddedImage, {
              x,
              y,
              width: width,
              height: height,
            });
          }
        }


      }
     // await axios.post(`/api/documents/${localStorage.getItem('current_id')}/add-positions`, { positions:allPositions });

      const pdfModifier = await pdfDoc.save();
      const pdfBuffer = Buffer.from(pdfModifier);
      const compressedData = zlib.deflateSync(pdfBuffer);
      const pdfBase64 = compressedData.toString('base64');
      console.log('b:' + pdfBase64);


      try {
        const response = await axios.post(`/api/documents/${localStorage.getItem('current_id')}/add`, {
          newBuffer: Buffer.from(pdfModifier).toString('base64'),


        }, {
          withCredentials: true,
          responseType: 'json',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data.message === 'Buffer added to document successfully') {
          setLoader(false);
          if(owner)
          {
          props.loadPdff();}
          else{
            props.loadPdf()
          }
        } else {
          console.error('Erreur lors de lajout du PDF modifié :', response.data.error);
        }


      } catch (error) {
        console.error('Erreur lors de l\'appel de API pour ajouter le buffer au document :', error);
      }



    } catch (error) {
      console.error('Erreur  de la création du PDF :', error);
    }
}
const handleReject = ()=>{
  setLoader(true);
  axios.post('/api/documents/'+localStorage.getItem('current_id')+'/reject',{},{withCredentials:true}).then(
      (data)=>{
          setLoader(false);
          props.loadPdf();
      }
  )
}


const goToPage = (pageNum) => {
  console.log(can);



    const pdfViewer = document.getElementById('pdf-viewer');
    if (pdfViewer) {
      pdfViewer.scrollTo(0, (pageNum ) * pdfViewer.clientHeight);
    }

};
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

                          <Button color="inherit" onClick={() => { setSigningMode() }} ><FontAwesomeIcon icon={faPenNib} size='lg'></FontAwesomeIcon></Button>
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
        {(owner && !props.isOwnerSigner) || props.signed || props.expired  ? (
    <></>
  ) : (
        <Grid item xs={2} justify='center' alignItems='center'>
                <Grid container style={{width:'100%',height:'90%'}} justify='center' alignItems='center'>
                <div >
        <br/><br/><br/>
        <div   style={{ position: 'fixed', left: 30, top: 80, background: '#ffffff', padding: '10px' }}>
        {imagess.map((image, index) => (
  <div
    key={`thumbnail_${index + 1}`}
    onClick={() => goToPage(index)}
    style={{ cursor: 'pointer', marginBottom: '10px' }}
  >
    <img
      src={image}
      style={{ width: '110px', height: '150px', border: '2px solid #ddd' }}
    />
  </div>
))}

        </div>


       </div>
                  </Grid>
                  </Grid>)}
            <Grid item   xs={props.signed ? 12 : 7}>
                <div className={classes.root}   >

                    <div  id="pdf-viewer"
               style={{ height: '110vh', maxHeight: '140vh', overflow: 'scroll', backgroundColor: grey[100],zoom:'85%' }}>
                    {generatePages()}
                    </div>

                </div>
            </Grid>

            {(owner && !props.isOwnerSigner) || props.signed || props.expired  ? (
    <></>
  ) : (

                <Grid item xs={3} justify='center' alignItems='center'>
                <Grid container style={{width:'100%',height:'100%'}} justify='center' alignItems='center'>
                         <div >

        <h2 style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fields</span>
            {!owner && (
              <div style={{ marginLeft: '10px' }}>
                <FontAwesomeIcon icon={faCog} style={{ fontSize: '17px', width: '17px' }}  onClick={() => props.setOpenModal(true)}/>
              </div>
            )}
          </div>
        </h2>
            <Grid container style={{ width: '100%', height: '100%' , display: 'flex'}} >
              <div>

            </div>
              <Grid>




  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  {owner ? (
      <div


      data-type="Name"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', 'Name');
      }}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <button
          style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '210px', height: '55.3px', fontFamily: 'poppins' }}
        >
          <b style={{fontSize:'15px', fontFamily:'cursive'}}>{Cookies.get('name')}</b>
        </button>
        <div className='iconne' >
          <FontAwesomeIcon icon={faUser} style={{ fontSize: '15px', width: '17px'  }} />
        </div>
      </div>
      ) : (
      <div


      data-type="Name"

        style={{ display: 'flex', alignItems: 'center' }}
      >
        <button
          style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '210px', height: '55.3px', fontFamily: 'poppins' }}
        >
          <b style={{fontSize:'15px', fontFamily:'cursive'}}>{Cookies.get('name')}</b>
        </button>
        <div className='iconne' >
          <FontAwesomeIcon icon={faUser} style={{ fontSize: '15px', width: '17px'  }} />
        </div>
      </div>
      )}
      <br/>
      {owner ? (
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
          style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '210px', height: '55.3px', fontFamily: 'poppins' }}
        >
          <b style={{fontSize:'15px', fontFamily:'cursive'}}>Company</b>
        </button>
        <div className='iconne' >
          <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '15px', width: '17px' }} />
        </div>
      </div>


      ):(
      <div
      data-type="Company"
      data-field="Company"


        style={{ display: 'flex', alignItems: 'center' }}
      >
        <button
          style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '210px', height: '55.3px', fontFamily: 'poppins' }}
        >
          <b style={{fontSize:'15px', fontFamily:'cursive'}}>Company</b>
        </button>
        <div className='iconne' >
          <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '15px', width: '17px' }} />
        </div>
      </div>)}
      <br/>

      {owner ? (
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
          style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '210px', height: '54.3px', fontFamily: 'poppins' }}
        >
          <b style={{fontSize:'13.8px', fontFamily:'cursive'}}>{Cookies.get('email')}</b>
        </button>
        <div className='iconne' >
          <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '15px', width: '17px' }} />
        </div>
      </div>

      ):(

      <div
      data-type="Email"
      data-field="Email"

        style={{ display: 'flex', alignItems: 'center' }}
      >
        <button
          style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '210px', height: '54.3px', fontFamily: 'poppins' }}
        >
          <b style={{fontSize:'13.8px', fontFamily:'cursive'}}>{Cookies.get('email')}</b>
        </button>
        <div className='iconne' >
          <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '15px', width: '17px' }} />
        </div>
      </div>

      )}
      <br/>


      {owner ? (
      <div
        data-field="Signature"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', 'Signature');
        }}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {defaultt ? (
          <div
            style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '208px', height: '50px', fontFamily: 'poppins', alignItems: 'center' }}
          >
            <img src={defaultt} style={{ width: '200px', height: '49.7px' ,textAlign:'center',  alignSelf:'center' , alignContent:'center' , alignItems:'center'}} />
          </div>
        ) : (
          <div
            style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '208px', height: '50px', fontFamily: 'poppins', alignItems: 'center' }}
          >
            <Link to={{ pathname: "/sig" }}> <p   style={{textAlign:'center'}}>Add Signature</p> </Link>
          </div>
        )}

          <div className='iconne' >
            <FontAwesomeIcon icon={faSignature} style={{ fontSize: '15px', width: '17px' }} />
          </div>

      </div>
      ):(
      <div

        style={{ display: 'flex', alignItems: 'center' }}
      >
        {defaultt ? (
          <div
            style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '208px', height: '50px', fontFamily: 'poppins', alignItems: 'center' }}
          >
            <img src={defaultt} style={{ width: '200px', height: '49.7px' ,textAlign:'center',  alignSelf:'center' , alignContent:'center' , alignItems:'center'}} draggable="false"/>
          </div>
        ) : (
          <div
            style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '208px', height: '50px', fontFamily: 'poppins', alignItems: 'center' }}
          >
            <Link to={{ pathname: "/sig" }}> <p   style={{textAlign:'center'}}>Add Signature</p> </Link>
          </div>
        )}

          <div className='iconne' >
            <FontAwesomeIcon icon={faSignature} style={{ fontSize: '15px', width: '17px' }} />
          </div>

      </div>

      )}
      <br/>

  {owner ?(
      <div
        data-field="Tampon d'entreprise"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', "Tampon d'entreprise");
        }}
        style={{ display: 'flex', alignItems: 'center' }}
      >
      {TamponData.TamponImage ? (
          <div
            style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '208px', height: '50px', fontFamily: 'poppins', alignItems: 'center' }}
          >
           &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;   <img src={TamponData.TamponImage } style={{ width: '150px', height: '49.7px' }} />
          </div>
        ) : (
          <div
            style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '208px', height: '50px', fontFamily: 'poppins', alignItems: 'center' }}
          >
            <Link to={{ pathname: "/tampon" }}> <p   style={{textAlign:'center'}}>Add Buffer</p> </Link>
          </div>
        )}
        <div className='iconne' >
          <FontAwesomeIcon icon={faStamp} style={{ fontSize: '15px', width: '17px' }} />
        </div>
      </div>

  ):(
      <div
        data-field="Tampon d'entreprise"
  draggable="false"
        style={{ display: 'flex', alignItems: 'center' }}
      >
      {TamponData.TamponImage ? (
          <div
            style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '208px', height: '50px', fontFamily: 'poppins', alignItems: 'center' }}
          >
          &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;   <img src={TamponData.TamponImage } style={{ width: '110px', height: '49.7px' ,alignSelf:'center' , alignContent:'center' , position:'flex'}} draggable="false"/>
          </div>
        ) : (
          <div
            style={{ backgroundColor: 'transparent', border: '3px solid rgb(157, 194, 231)', width: '208px', height: '50px', fontFamily: 'poppins', alignItems: 'center' }}
          >
            <Link to={{ pathname: "/tampon" }}> <p   style={{textAlign:'center'}}>Add Buffer</p> </Link>
          </div>
        )}
        <div className='iconne' >
          <FontAwesomeIcon icon={faStamp} style={{ fontSize: '15px', width: '17px' }} />
        </div>
      </div>

  )}

      <div >
      <br/><br/><br/>
      <CustomButton text="Sign" onClick={handleSign} style={{width:'80%',margin:'10px' , marginLeft:'20px'}} ></CustomButton>


      <CustomButton text="Reject"  onClick={handleReject}  style={{width:'80%',margin:'10px', marginLeft:'20px'}}></CustomButton>
      </div>
      </Grid>
        </Grid>
                        </div>
                    </Grid>
            </Grid>
)}

        </Grid>
      </SignatureContext.Provider>

  );
    }


