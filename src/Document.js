
import axios from 'axios';
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import Cookies from 'js-cookie';
import React, { useEffect, useState ,useRef } from 'react';
import { useParams } from 'react-router';
import Loader from './Loader';
import NavBar from './Navbar';
import Pdf from './Pdf';
import html2canvas from 'html2canvas';
import { PDFDocument, rgb } from 'pdf-lib'
import { useHistory } from 'react-router';
import { Table } from 'react-bootstrap';
import Modal from './modalText';
import SignatureCanvas from 'react-signature-canvas';
import { clear } from 'google-auth-library/build/src/auth/envDetect';
import { Button, makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { InputLabel, TextareaAutosize , IconButton } from '@material-ui/core';
import { Grid, TextField } from '@material-ui/core';
import { Backup } from "@material-ui/icons";
import CONSTS from "./constants";
import * as htmlToImage from 'html-to-image';
import CustomButton from './CustomButton';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { faPen , faUser ,faBuilding , faSignature , faCalendarAlt , faStamp,faEnvelope ,faCog ,faArrowRight, faDownload} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import imgs from './signat.png'
import imm from './AC.png'
export default function Document(props) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const [document, setDocument] = useState(null);
    const [document1, setDocument1] = useState(null);
    const [comments, setComments] = useState([]);
    const [name,setName]= useState('');
    const [owner,setOwner] = useState(Cookies.get('email'));
    const [signed,setSigned] = useState(false);
    const [isOwnerSigner,setIsOwnerSigner] = useState(false);
    const[statuus , setStatuus]=useState(null)
    const[company , setCompany]=useState("Company")


    const[uI , setUi]=useState("")
    const[namee , setNamee]=useState(Cookies.get('name'))
    const parts = namee.split(' ');
    const firstNameInitial = parts[0].charAt(0).toUpperCase();
    const lastNameInitial = parts[1].charAt(0).toUpperCase();
    const initial=firstNameInitial+lastNameInitial;
    const [initiall,setInitiall] = useState(initial);
    const[email , setEmail]=useState(Cookies.get('email'))
    let params = useParams();
    const [state, _setState] = useState({
        scale: 1.3,
        pages: [],
        name: null,
        pdf: null,
        open: false,
        mode:'none'
    })
   ;
    const [signatureData,setSignatureData] = useState({});
    const signatureRef = useRef();
    const signatureCanvasRef = useRef(null);
    const [penColor, setPenColor] = useState('black');
    const [signatureDataURL, setSignatureDataURL] = useState('');
    const handleClear = () => {
      signatureRef.current.clear();
    };

       const toBase64 = (buffer)=>{
        let TYPED_ARRAY = new Uint8Array(buffer);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
          }, '');
        let base64String = btoa(STRING_CHAR);
          return 'data:image/png;base64, '+base64String;

      }

      const history = useHistory();
      const labelRef = useRef(null);
      const labelRef2 = useRef(null);
      const labelRef1 = useRef(null);

      const initialRef = useRef(null);
      const initialRef1 = useRef(null);
      const initialRef2 = useRef(null);
       const loadPdff = ()=>{

        setDocument(null);
        axios.get('/api/documents/' + params.fileId, { withCredentials: true }).then(
          resp => {
              setDocument(null);

              let signer  =resp.data.signers.filter((signer)=>signer.email/*===Cookies.get('email')*/);

              if(signer[0].documentSigné===null  ){
                setDocument(resp.data.buffer);
              }
              else{
                setDocument(signer[0].documentSigné);
              }
              setComments(resp.data.comments);
              setName(resp.data.name);
              setOwner(resp.data.owner);
              setIsOwnerSigner(resp.data.isOwnerSigner);
              setSigned((signer.length>0 && (signer[0].status==='signed'|| signer[0].status==='rejected'  || signer[0].status==='expired' )));
               console.log(signer[0].status)
              setStatuus(signer[0].status)
              console.log("status:"+statuus);
              localStorage.setItem('current_id',params.fileId);

          },
          (err) => {
              console.log(err)
          }
      )
  }
      const [openModal, setOpenModal] = useState(false);
      const [openPopUp, setOpenPopup] = useState(false);
      const[showSignatureText , setShowSignatureText]=useState(true)
      const[showSignatureDraw , setShowSignatureDraw]=useState(false)
      const[showSignatureImage , setShowSignatureImage]=useState(false)
      const[Tamponn , setTamponn]=useState(null)
      const [image, setImage] = useState(null);
      const [imageFile, setImageFile] = useState(null);
      const [preview, setPreview] = useState(null);

      const [previews, setPreviews] = useState(null);
    const handleChange = (event) => {
  setImageFile(event.target.files[0]);
  setImage(URL.createObjectURL(event.target.files[0]));


  if (event.target.files[0] && event.target.files[0].size > 0) {
    setPreview(URL.createObjectURL(event.target.files[0]));
  }
}

    const [selectedOptionnn, setSelectedOptionnn] = useState(null);
    const [selectedOptionI, setSelectedOptionI] = useState(null);
    const handleCheckboxChange = (event) => {
      setSelectedOptionnn(event.target.value);
    };
    const handleCheckboxChangee = (event) => {
      setSelectedOptionI(event.target.value);
    };
    const handleCheckboxChangeTampon = (event) => {
      setTamponOption(event.target.value);
    };
let urlI;
const imageBufferrqRef = useRef(null);
const imageBufferrqReff = useRef(null);
let imageBufferrq= imageBufferrqRef.current;
let imageBufferr=  imageBufferrqReff.current ;

const TamponRef = useRef(null);
let imageBufferT= TamponRef.current;
  const loadPdf = async () => {

    axios.get('/api/documents/' + params.fileId, { withCredentials: true }).then(
      async (resp) => {
        setDocument(null);

        let signer = resp.data.signers.filter((signer) => signer.email === Cookies.get('email'));
        if (signer[0]) {

          if (signer[0].documentSigné === null) {
            if (resp.data.owner === signer[0].email) {
              setDocument(resp.data.buffer);
              setDocument1(resp.data.buffer.data);

            } else {
              try {

                const pdfBytes = new Uint8Array(resp.data.buffer.data);
                console.log("pdf:" + document1);
                const pdfDoc = await PDFDocument.load(pdfBytes);

                if (!pdfDoc) {
                  console.error('Impossible de charger le PDF.');
                  return;
                }

                const response = await axios.get(`/api/documents/${params.fileId}/positions`, { withCredentials: true });
                setLabelPositions(response.data);
                console.log('page' + response.data);
                const nameLabels = [];
                const emailLabels = [];
                const companyLabels = [];
                const signatureLabels = [];
                const tamponLabels = [];
                const DateLabel=[];
                const InitiaLabel=[];
                let page;
                let labels
                let imgSrcc;
                let embeddedImagee;
                response.data.forEach((position) => {

                  const currentDate = new Date();

                  const formattedDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear();
                  const formattedTime = currentDate.getHours() + ':' + (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
                  const dateTimeString = formattedDate + ' ' + formattedTime;

                  switch (position.typee) {
                    case 'Initial':
                      InitiaLabel.push({
                        x: position.x,
                        y: position.y,
                        width: 30,
                        height: 20,
                        page:position.page
                      });
                      break;
                    case 'Name':
                      nameLabels.push({
                        text: namee,
                        x: position.x,
                        y: position.y,
                        size: 12,
                        page:position.page
                      });
                      break;
                    case 'Email':
                      emailLabels.push({
                        text: email,
                        x: position.x,
                        y: position.y,
                        size: 12,
                        page:position.page
                      });
                      break;
                    case 'Company':


                      companyLabels.push({
                        text: company,
                        x: position.x,
                        y: position.y,
                        size: 12,
                        page:position.page
                      });
                      break;
                      case 'Date':


                      DateLabel.push({
                        text: dateTimeString,
                        x: position.x,
                        y: position.y,
                        size: 12,
                        page:position.page
                      });
                      break;
                    case 'Signature':
                      signatureLabels.push({

                        x: position.x,
                        y: position.y,
                        width: 120,
                        height: 30,
                        page:position.page
                      });
                      break;
                    case 'Tampon':
                      tamponLabels.push({
                        x: position.x,
                        y: position.y,
                        width: 100,
                        height: 60,
                        page:position.page
                      });
                      break;
                    default:
                      break;
                  }


                nameLabels.forEach((label) => {
                  const  page = pdfDoc.getPages()[label.page];
                  page.drawText(label.text, {
                    x: label.x,
                    y: label.y,
                    size: label.size,
                  });
                });

                emailLabels.forEach((label) => {
                  page = pdfDoc.getPages()[label.page];
                  page.drawText(label.text, {
                    x: label.x,
                    y: label.y,
                    size: label.size,
                  });
                });

                companyLabels.forEach((label) => {
                page = pdfDoc.getPages()[label.page];
                  page.drawText(label.text, {
                    x: label.x,
                    y: label.y,
                    size: 12,
                  });
                });
                DateLabel.forEach((label) => {

                  page = pdfDoc.getPages()[label.page];
                  page.drawText(label.text, {
                    x: label.x,
                    y: label.y,
                    size: 12,
                  });
                });


              });


              axios.get('/api/users/getsignatures',{withCredentials:true}).then(async (data) => {
                    let signature = null;
                    let imageSignature= null;
                    if(data.data.signature)

                         signature = toBase64(data.data.signature.data);

                     if(data.data.imageSignature)
                   console.log("base64"+data.data.imageSignature.data)

                   let  signatureDataa;
                   let imagee=preview;

                   if (signatureRef.current) {
                          signatureDataa = signatureRef.current.toDataURL();
                          setSignatureDataURL(signatureData);

                  }
                     imageSignature =toBase64(data.data.imageSignature.data);
                      setSignatureData({
                      signature:signature,
                      imageSignature:imageSignature,
                      defaultSignature:data.data.defaultSignature
                    })
                    console.log("SignatureDate"+signatureDataa)
                    let dataUrl="";




                    if (selectedOptionI === 'initial1') {
                      const canvas= await html2canvas(initialRef1.current)
                      canvas.style.backgroundColor='transparent'
                      canvas.style.imageRendering = 'pixelated';
                          urlI=canvas.toDataURL('image/png');
                         setPreviews(dataUrl);

                         const response = await fetch(urlI);
                         const imageBuffer = await response.arrayBuffer();

                         const imageBuffers = new Uint8Array(imageBuffer);
                         const base64Data = toBase64(imageBuffers);
                         imageBufferrq = await fetch(base64Data).then((response) => response.arrayBuffer());
                         imageBufferrqRef.current = imageBufferrq;
                        } else if (selectedOptionI === 'initial2') {
                          const canvas= await html2canvas(initialRef.current)
                          canvas.style.backgroundColor='transparent'
                          canvas.style.imageRendering = 'pixelated';
                          urlI = canvas.toDataURL('image/png');
                             setPreviews(dataUrl);

                             const response = await fetch(urlI);
                             const imageBuffer = await response.arrayBuffer();

                             const imageBuffers = new Uint8Array(imageBuffer);
                             const base64Data = toBase64(imageBuffers);
                             imageBufferrq = await fetch(base64Data).then((response) => response.arrayBuffer());
                             setUi(imageBufferrq)
                             imageBufferrqRef.current = imageBufferrq;
                    } else if (selectedOptionI === 'initial3') {
                      const canvas= await html2canvas(initialRef2.current)
                      canvas.style.backgroundColor='transparent'
                      canvas.style.imageRendering = 'pixelated';
                      urlI = canvas.toDataURL('image/png');
                         setPreviews(dataUrl);

                         const response = await fetch(urlI);
                         const imageBuffer = await response.arrayBuffer();

                         const imageBuffers = new Uint8Array(imageBuffer);
                         const base64Data = toBase64(imageBuffers);
                         imageBufferrq = await fetch(base64Data).then((response) => response.arrayBuffer());
                         setUi(imageBufferrq)
                         imageBufferrqRef.current = imageBufferrq;
                    }



                    if (selectedOptionnn === 'label1') {
                     const canvas= await html2canvas(labelRef1.current)
                     canvas.style.backgroundColor='transparent'
                     canvas.style.imageRendering = 'pixelated';
                        const dataUrl = await canvas.toDataURL('image/png');
                        setPreviews(dataUrl);

                        const response = await fetch(dataUrl);
                        const imageBuffer = await response.arrayBuffer();

                        const imageBuffers = new Uint8Array(imageBuffer);
                        const base64Data =await toBase64(imageBuffers);
                        imageBufferr = await fetch(base64Data).then((response) => response.arrayBuffer());
                        imageBufferrqReff.current = imageBufferr;
                     } else


                      if (selectedOptionnn === 'label2') {
                        try {
                          const canvas = await html2canvas(labelRef.current);
                          canvas.style.backgroundColor='transparent'
                          canvas.style.imageRendering = 'pixelated';
                          const dataUrl = await canvas.toDataURL('image/png');

                          setPreviews(dataUrl);


                          const response = await fetch(dataUrl);
                          const imageBuffer = await response.arrayBuffer();

                          const imageBuffers = new Uint8Array(imageBuffer);
                          const base64Data = await toBase64(imageBuffers);
                          imageBufferr = await fetch(base64Data).then((response) => response.arrayBuffer());
                          imageBufferrqReff.current = imageBufferr;
                        } catch (error) {
                          console.error('Error converting HTML element to image:', error);
                        }
                      }
                   else


                  if (selectedOptionnn === 'label3') {
                      const canvas=await html2canvas(labelRef2.current)
                      canvas.style.imageRendering = 'pixelated';
                      canvas.style.backgroundColor='transparent'
                        const dataUrl = await canvas.toDataURL('image/png');
                        setPreviews(dataUrl);


                        const response = await fetch(dataUrl);
                        const imageBuffer = await response.arrayBuffer();

                        const imageBuffers = new Uint8Array(imageBuffer);
                        const base64Data = await toBase64(imageBuffers);
                        imageBufferr = await fetch(base64Data).then((response) => response.arrayBuffer());
                        imageBufferrqReff.current = imageBufferr;
                     } else if (imagee) {

                      const response = await fetch(imagee);
                      const imageBuffer = await response.arrayBuffer();

                      const imageBuffers = new Uint8Array(imageBuffer);
                      const base64Data =await  toBase64(imageBuffers);
                      imageBufferr = await fetch(base64Data).then((response) => response.arrayBuffer());
                      imageBufferrqReff.current = imageBufferr;
                    }  else if (signatureDataa) {
                      const response = await fetch(signatureDataa);
                      const imageBuffer = await response.arrayBuffer();

                      const imageBuffers = new Uint8Array(imageBuffer);
                      const base64Data =await  toBase64(imageBuffers);
                      imageBufferr = await fetch(base64Data).then((response) => response.arrayBuffer());
                      imageBufferrqReff.current = imageBufferr;
                    }

                  if(imageBufferr){
                  const embeddedImagee = await pdfDoc.embedPng(imageBufferr);
                  signatureLabels.forEach(async(label) => {
                    const page = pdfDoc.getPages()[label.page];
                    await page.drawImage(embeddedImagee, label);
                  });}


                if(imageBufferrq){
                const embeddedImageez = await pdfDoc.embedPng(imageBufferrq);

                  InitiaLabel.forEach(async (label) => {
                    const page = pdfDoc.getPages()[label.page];
                    await page.drawImage(embeddedImageez, label);
                  });
                }
                     const pdfModifier = await pdfDoc.save();
                     console.log("odifier" + pdfModifier);

                     setDocument(pdfModifier);
                     setDocument1(pdfModifier);

                }


            )

                axios.get('/api/users/getTampon', { withCredentials: true }).then(async (data) => {
                  let TamponImage = null;
                  if (data.data.TamponImage) {
                    TamponImage = toBase64(data.data.TamponImage.data);
                  } else {
                    history.push('/tampon');
                  }
                  const imgSrc = TamponImage;

                  imageBufferT = await fetch(imgSrc).then((response) => response.arrayBuffer());
                 TamponRef.current=imageBufferT;
                 if(imageBufferT   && TamponOption==='oui'){


                  const embeddedImage = await pdfDoc.embedPng(imageBufferT);

                  tamponLabels.forEach((label) => {
                    labels=label
                    page = pdfDoc.getPages()[label.page];
                    page.drawImage(embeddedImage, labels);
                  });
                }
                });
                console.log("doc" + document);
              } catch (error) {
                console.error('Erreur lors du chargement ou de la modification du PDF :', error);
              }
              if(signer[0].status==='rejected'){
                setDocument(resp.data.buffer);
                setDocument1(resp.data.buffer.data);
              }
            }
          } else {
            setDocument(signer[0].documentSigné);

          }

          setComments(resp.data.comments);
          setName(resp.data.name);
          setOwner(resp.data.owner);
          setIsOwnerSigner(resp.data.isOwnerSigner);

          setSelectedOptionnn(null)
          setSelectedOptionI(null)
          setPreview(null)
          setSigned(signer.length > 0 && (signer[0].status === 'signed' || signer[0].status === 'rejected' || signer[0].status === 'expired'));
          console.log(signer[0].status);
          setStatuus(signer[0].status);
          console.log("status:" + statuus);
          localStorage.setItem('current_id', params.fileId);
        } else {
          setDocument(resp.data.buffer);
          setDocument1(resp.data.buffer.data);
          setStatuus("rejected");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const [selectedColor, setSelectedColor] = useState(null);


  const handleColorClick = (color) => {
    setSelectedColor(color);
  };
  const [ColorInitial, setColorInitial] = useState(null);
  const [TamponOption, setTamponOption] = useState(null);

  const handleColorClicked = (color) => {
    setColorInitial(color);
  };
    useEffect(() => {

        loadPdf();
        setOpenPopup(true);
    }, [])


    const [labelPositions, setLabelPositions] = useState([]);
    const [showSIgnatureT ,setShowSignatureT] = useState(true);
    const [showInitial ,setShowInitial] = useState(false);
    const handlePanelClose = () => {
      setOpenModal(false);
    };

    const Condition = () => {
      setOpenPopup(false);
      setOpenModal(true)
    };

    const showSignatureTextt = () => {
      setShowSignatureText(true)
      setShowSignatureImage(false)
      setShowSignatureDraw(false)

    };
    const showInitaill = () => {
     setShowSignatureT(false)
     setShowInitial(true)

    };
    const showSignature = () => {
      setShowSignatureT(true)
      setShowInitial(false)

     };
    const showSignatureDrawt = () => {
      setShowSignatureText(false)
      setShowSignatureImage(false)
      setShowSignatureDraw(true)

    };
    const showSignatureImagee = () => {
      setShowSignatureText(false)
      setShowSignatureImage(true)
      setShowSignatureDraw(false)

    };

    const inputRef = useRef(null);


  useEffect(() => {
      axios.get(`/api/documents/${params.fileId}/positions`, { withCredentials: true })
          .then((response) => {
              setLabelPositions(response.data);
              console.log("pos:" + document);
          })
          .catch((error) => {
              console.error(error);
          });
  }, []);



    return (
        <React.Fragment>

        {statuus!=='signed' && statuus!=='rejected' && owner!==Cookies.get('email') &&  openPopUp && (

<div className='overlay' style={{

  zIndex: 1000,
  position: 'absolute',
  top: 150,
  left:550,
  transform: 'translate(-50%, -40%)',

  }}>

  <div

  className='modalContainer'
  >
  <div className='modalRight' style={{textAlign:'center'}}>
  <br/>


  <div className='content'>
  <h2>Votre signature est requise</h2><br/>
Pour continuer à vous connecter en tant qu'invité,
<br/> vous devez d'abord lire et accepter nos <br/><b><u style={{color:'red'}}>Conditions générales.</u></b>
  <FormControlLabel
            control={
              <Checkbox

                value="J'accepte les conditions générales"
              />

            }
            label="J'accepte les conditions générales."/>
    <br/><br/>
  <Grid item xs={12}>

</Grid>


<Grid item xs={12} style={{ textAlign: 'center' }}>

<hr></hr>
<CustomButton text="connecter" onClick={Condition} style={{marginLeft:'10px'}} ></CustomButton>

<CustomButton text="Continuer" onClick={Condition} style={{marginLeft:'10px'}} ></CustomButton>


</Grid>

  </div>

  </div>
  </div>

  </div>
)}
{statuus!=='signed' && statuus!=='rejected' && owner!==Cookies.get('email') &&  openPopUp && (

<div className='overlay' style={{

  zIndex: 1000,
  position: 'absolute',
  top: 150,
  left:550,
  transform: 'translate(-50%, -40%)',

  }}>

  <div

  className='modalContainer'
  >
  <div className='modalRight' style={{textAlign:'center'}}>
  <br/>


  <div className='content'>
  <h2>Votre signature est requise</h2><br/>
Pour continuer à vous connecter en tant qu'invité,
<br/> vous devez d'abord lire et accepter nos <br/><b><u style={{color:'red'}}>Conditions générales.</u></b>
  <FormControlLabel
            control={
              <Checkbox

                value="J'accepte les conditions générales"
              />

            }
            label="J'accepte les conditions générales."/>
    <br/><br/>
  <Grid item xs={12}>

</Grid>


<Grid item xs={12} style={{ textAlign: 'center' }}>

<hr></hr>
<CustomButton text="connecter" onClick={Condition} style={{marginLeft:'10px'}} ></CustomButton>

<CustomButton text="Continuer" onClick={Condition} style={{marginLeft:'10px'}} ></CustomButton>


</Grid>

  </div>

  </div>
  </div>

  </div>
)}

{statuus!=='signed' && statuus!=='rejected' && owner!==Cookies.get('email') &&  openPopUp && (

<div className='overlay' style={{

  zIndex: 1000,
  position: 'absolute',
  top: 150,
  left:550,
  transform: 'translate(-50%, -40%)',

  }}>

  <div

  className='modalContainer'
  >
  <div className='modalRight' style={{textAlign:'center'}}>
  <br/>


  <div className='content'>
  <h2>Votre signature est requise</h2><br/>
Pour continuer à vous connecter en tant qu'invité,
<br/> vous devez d'abord lire et accepter nos <br/><b><u style={{color:'red'}}>Conditions générales.</u></b>
  <FormControlLabel
            control={
              <Checkbox

                value="J'accepte les conditions générales"
              />

            }
            label="J'accepte les conditions générales."/>
    <br/><br/>
  <Grid item xs={12}>

</Grid>


<Grid item xs={12} style={{ textAlign: 'center' }}>

<hr></hr>
<CustomButton text="connecter" onClick={Condition} style={{marginLeft:'10px'}} ></CustomButton>

<CustomButton text="Continuer" onClick={Condition} style={{marginLeft:'10px'}} ></CustomButton>


</Grid>

  </div>

  </div>
  </div>

  </div>
)}
         {openModal && (
  <div className='overlay' style={{
    zIndex: 1000,
    position: 'absolute',
    top: 300,
    left: 650,
    transform: 'translate(-50%, -40%)',
    width: "1000px"
  }}>
    <div className='modalContainers'>
      <div className='modalRight'>
        <div className='content'>
          <h2 style={{fontFamily:'cursive'}}>Configurer les paramètres de votre signature</h2>
          <hr style={{
      height: '100%',
      borderLeft: '1px solid #ccc',
      margin: 0,
    }} />
          <br />
          <Grid item xs={12}>

            <TextField style={{ width: "30%" }}
              id="initial"
              label="Initial"
              type="text"
              value={initiall} onChange={(e) => setInitiall(e.target.value)}
              variant="outlined"
              spellCheck='false'
              autoComplete='off'
            />
            <TextField style={{ width: "30%" }}
              id="name"
              label="Your Name"
              type="text"
              value={namee} onChange={(e) => setNamee(e.target.value)}
              variant="outlined"
              spellCheck='false'
              autoComplete='off'
            />
            <TextField style={{ width: "35%" }}
              id="company"
              label="Company Name"
              type="text"
              value={company} onChange={(e) => setCompany(e.target.value)}
              variant="outlined"
              spellCheck='false'
              autoComplete='off'
            />
          </Grid>


          <Grid item xs={12}>
          <br/>

          <div className="sidebar"   >
            <Table >
            <tr><td>

              </td>
 </tr>
              <tr style={{border:"transparent" }}>
<td >
  <div>


  </div>
  <table style={{ border: 'transparent', borderCollapse: 'collapse' }}>
    <tr><td onClick={showSignatureTextt} style={{ border: 'transparent', borderCollapse: 'collapse', marginLeft: '10px', backgroundColor:'rgb(225, 220, 220)' }} >
       <button  style={{backgroundColor:'transparent',border:'transparent' , marginTop:"40px" ,  marginBottom:'20px' , marginLeft:'15px' }} > <FontAwesomeIcon icon={faPen} style={{ fontSize: '18px', width: '20px' , backgroundColor:'transparent' }} /></button><br/></td></tr>
       <tr style={{ border: 'transparent', borderCollapse: 'collapse', margin: '10px' , borde:'transparent' }}><td onClick={showSignatureDrawt} style={{ backgroundColor:'rgb(225, 220, 220)'  , border:'transparent'}}>   <button  style={{backgroundColor:'transparent',border:'transparent', marginTop:"5px" ,  marginBottom:'5px' , marginLeft:'15px' , marginRight:'15px'}}> <FontAwesomeIcon icon={faSignature} style={{ fontSize: '20px', width: '22px' }} /></button><br/></td></tr>
       <tr><td  onClick={showSignatureImagee} style={{ backgroundColor:'rgb(225, 220, 220)'}}>  <button style={{backgroundColor:'transparent',border:'transparent', marginTop:"25px" ,  marginBottom:'80px' , marginLeft:'15px' , marginRight:'15px'}}> <FontAwesomeIcon icon={faDownload} style={{ fontSize: '20px', width: '22x' }} /></button></td></tr>
          </table> </td>

          <td style={{ marginTop: '10px'}}>{showSignatureText  &&(

<>
{showSIgnatureT &&(
<div>

<td >
<table  >
  <tr style={{border:'1px solid black'}}>

  <td >
 &nbsp;&nbsp; <img src={imgs} style={{width:'20px' , height:'25px'}}></img><button style={{backgroundColor:'transparent' , border:'transparent'}}><b style={{fontSize:'20px' , fontFamily:'cursive' , marginBottom:'10px '}}  onClick={showSignature} > Signature   &nbsp;&nbsp;&nbsp;</b></button></td> <td > <img src={imm} style={{width:'20px' , height:'25px'}}></img><button style={{backgroundColor:'transparent' , border:'transparent'}} ><b  style={{fontSize:'20px' , fontFamily:'cursive'}}  onClick={showInitaill} >Initial &nbsp;&nbsp;&nbsp;</b></button></td>
  </tr>
  </table>
  </td>
  <Table  style={{ border: '1px solid black' }}>
<tr>
</tr>

    <tr  style={{ border: '1px solid black' }}>

      <td >
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;   <FormControlLabel style={{marginTop:'20px'}}
  control={
    <Checkbox
      checked={selectedOptionnn === 'label3'}
      value="label3"
      onChange={handleCheckboxChange}
    />
  }
  label={
    <div className='label' ref={labelRef2} style={{color:selectedColor , fontSize:18}}>
      {namee}
    </div>
  }
/>
      </td>
    </tr>
   <tr>

   <td>

   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <FormControlLabel
  control={
    <Checkbox
      checked={selectedOptionnn === 'label1'}
      value="label1"
      onChange={handleCheckboxChange}
    />
  }
  label={
    <div className='labell' ref={labelRef1} style={{color:selectedColor , fontSize:20}}>
      {namee}
    </div>
  }
/>

    </td></tr>
   <tr>

    <td>
    &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; <FormControlLabel style={{marginBottom:'20px', marginRight:'500px'}}
  control={
    <Checkbox
      checked={selectedOptionnn === 'label2'}
      value="label2"
      onChange={handleCheckboxChange}
    />
  }
  label={
    <div  className='label2' ref={labelRef}   style={{color:selectedColor , fontSize:20}}>
      {namee}
    </div>
  }
/>
    </td>

<td></td>
   </tr>
   <tr>
  <td>
    <div style={{ display: 'flex',justifyContent:'flex-start' }}>
    <div style={{marginLeft:'30px'}}>Color:</div><div
        className="color-circle"
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'black', cursor: 'pointer' , marginLeft:'10px' }}
        onClick={() => handleColorClick('black')}
      ></div>
      <div
        className="color-circle"
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'green', cursor: 'pointer' , marginLeft:'10px' }}
        onClick={() => handleColorClick('green')}
      ></div>
      <div
        className="color-circle"
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'red', cursor: 'pointer' , marginLeft:'10px' }}
        onClick={() => handleColorClick('red')}
      ></div>

      <div
        className="color-circle"
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'royalblue', cursor: 'pointer' ,marginRight:'510px' , marginLeft:"10px"}}
        onClick={() => handleColorClick('royalblue')}
      ></div>


    </div>
  </td>
  <td></td>
</tr>

    </Table>
  </div>
)}


{showInitial  &&(

<div>

<td >
<table  >
<tr style={{border:'1px solid black'}}>

<td >
&nbsp;&nbsp; <img src={imgs} style={{width:'20px' , height:'25px'}}></img><button style={{backgroundColor:'transparent' , border:'transparent'}}><b style={{fontSize:'20px' , fontFamily:'cursive' , marginBottom:'10px '}}  onClick={showSignature} > Signature   &nbsp;&nbsp;&nbsp;</b></button></td> <td > <img src={imm} style={{width:'20px' , height:'25px'}}></img><button style={{backgroundColor:'transparent' , border:'transparent'}} ><b  style={{fontSize:'20px' , fontFamily:'cursive'}}  onClick={showInitaill} >Initial &nbsp;&nbsp;&nbsp;</b></button></td>
</tr>
  </table>
  </td>

<Table  style={{ border: '1px solid black' }}>

  <tr  style={{ border: '1px solid black' }}>



    <td style={{ margin: '10px'}}>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp;   <FormControlLabel style={{marginTop:'20px'}}
control={
  <Checkbox
    checked={selectedOptionI === 'initial3'}
    value="initial3"
    onChange={handleCheckboxChangee}
  />
}
label={
  <div className='label' ref={initialRef2} style={{color:ColorInitial}}>
    {initial}
  </div>
}
/>
    </td>
  </tr>
 <tr>


 <td>

 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; <FormControlLabel
control={
  <Checkbox
    checked={selectedOptionI === 'initial1'}
    value="initial1"
    onChange={handleCheckboxChangee}
  />
}
label={
  <div className='labell' ref={initialRef1} style={{color:ColorInitial}}>
    {initial}
  </div>
}
/>

  </td></tr>
 <tr>

  <td>
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp;   <FormControlLabel style={{marginBottom:'20px', marginRight:'500px'}}
control={
  <Checkbox
    checked={selectedOptionI === 'initial2'}
    value="initial2"
    onChange={handleCheckboxChangee}
  />
}
label={
  <div  className='label2' ref={initialRef}   style={{color:ColorInitial}}>
    {initial}
  </div>
}
/>
  </td>

<td></td>
 </tr>
 <tr>
<td>
  <div style={{ display: 'flex',justifyContent:'flex-start' }}>
  <div style={{marginLeft:'30px'}}>Color:</div><div
      className="color-circle"
      style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'black', cursor: 'pointer' , marginLeft:'10px' }}
      onClick={() => handleColorClicked('black')}
    ></div>
    <div
      className="color-circle"
      style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'green', cursor: 'pointer' , marginLeft:'10px' }}
      onClick={() => handleColorClicked('green')}
    ></div>
    <div
      className="color-circle"
      style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'red', cursor: 'pointer' , marginLeft:'10px' }}
      onClick={() => handleColorClicked('red')}
    ></div>

    <div
      className="color-circle"
      style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'royalblue', cursor: 'pointer' ,marginRight:'510px' , marginLeft:"10px"}}
      onClick={() => handleColorClicked('royalblue')}
    ></div>


  </div>
</td>
<td></td>
</tr>

  </Table>


</div>

)}
</>

          )}
  {showSignatureDraw &&(
   <Grid container alignItems='center'  style={{ textAlign: 'center', width:'850px', marginTop: '10px', marginLeft: '0px', paddingLeft: '0px', marginRight:"10px" }} >


      <Grid item container xs={10} sm={8} lg={8} >

      <div  style={{ width: '100%',boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
}}>
    <SignatureCanvas
    style={{marginBottom:'30px'}}
className='styles.ll'
  ref={(ref) => {
    signatureRef.current = ref;
    signatureCanvasRef.current = ref;
  }}
  penColor={penColor}
  canvasProps={{  className: 'signatureCanvas' ,backgroundColor:'whitesmoke'}}

/>

</div>


<div style={{ display: 'flex',justifyContent:'flex-start' , marginTop:'10px' }}>

    <div style={{marginLeft:'30px' }}>Color:</div><div
        className="color-circle"
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'black', cursor: 'pointer' , marginLeft:'10px' }}
        onClick={() => setPenColor('black')}
      ></div>
      <div
        className="color-circle"
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'green', cursor: 'pointer' , marginLeft:'10px' }}
        onClick={() => setPenColor('green')}
      ></div>
      <div
        className="color-circle"
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'red', cursor: 'pointer' , marginLeft:'10px' }}
        onClick={() => setPenColor('red')}
      ></div>

      <div
        className="color-circle"
        style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'royalblue', cursor: 'pointer' ,marginRight:'510px' , marginLeft:"10px"}}
        onClick={() => setPenColor('royalblue')}
      ></div>


    </div>
      </Grid>


      <CustomButton text="Clear" onClick={handleClear} style={{ marginLeft: '10px' }}></CustomButton>

      </Grid>
  )
  }

  {showSignatureImage  &&(

    <Grid container >
    <Grid item xs={10} sm={6} container style={{ height: '33vh',width:'170vh', marginTop: '20px', marginLeft: '15px', marginRight: 'auto', boxShadow: CONSTS.boxShadow }} justify='center' alignItems='center' >

    <Grid item container xs={10} style={{ height: '28vh',width:'100%', border: '2px dashed grey', textAlign: 'center' }} justify="center" alignItems='center'  >
        <Grid item>
            <p style={{ fontFamily: 'poppins' }}>Upload your Signature here</p>
            <input type="file" accept="image/png, image/jpeg"  onChange={handleChange} ref={inputRef} style={{ display: 'none' }} ></input>
            <CustomButton text="Upload Image" icon={Backup} onClick={() => { inputRef.current.click() }}></CustomButton>
        </Grid>

    </Grid>
    </Grid>
    </Grid>

  )}

          </td>
  </tr>
  </Table>

          </div>
        </Grid>
          <br></br>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <br /><FormControlLabel style={{marginBottom:'20px', marginRight:'500px'}}
  control={
    <Checkbox
      checked={TamponOption === 'oui'}
      value="oui"
      onChange={handleCheckboxChangeTampon}
    />
  }
  label={
    <div   ref={labelRef}   style={{fontFamily:'cursive', fontSize:14}}>
     Ajouter Tampon
    </div>
  }
/>

            <CustomButton text="Apply" onClick={loadPdf} style={{ marginLeft: '10px' }}></CustomButton>
               <CustomButton text="Close" onClick={handlePanelClose} style={{ marginLeft: '10px' , backgroundColor:'transparent'}}></CustomButton>
          </Grid>
        </div>


      </div>
    </div>
  </div>
)}

            <Loader open={!document}></Loader>

            { document != null ?

                (<Pdf pdf={document} signed={signed} statuus={statuus} pdf1={document1} Modal={openModal} setOpenModal={setOpenModal}isOwnerSigner={isOwnerSigner} loadPdf = {loadPdf} loadPdff={loadPdff}    owner={owner} comments={comments} name={name} ></Pdf>) :


                (<>

 <NavBar></NavBar>


                </>)
            }
        </React.Fragment>

    )
}
