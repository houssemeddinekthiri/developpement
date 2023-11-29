import { Fragment } from 'react';
import styles from './SideBarFields.module.scss';
import SourceFieldBox from './SourceFieldBox';
import SourceFieldBoxx from './SourceFieldBox/SourceFieldBoxx';
import InteractiveFieldBox from '../DropPdfVisualizer/InteractiveFieldBox/InteractiveFieldBox';
import React, { useContext, useEffect, useState } from 'react';
import Page from '../../Page';
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { grey } from '@material-ui/core/colors';
import { AppBar, Grid, makeStyles, Toolbar, Typography } from '@material-ui/core';

import { Link, useHistory } from 'react-router-dom';
import CustomButton from '../../CustomButton';

import axios from 'axios';
import Pdf from '../../Pdf';
import * as  fileDownload from 'js-file-download';
import Cookies from 'js-cookie';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";





import CONSTS from '../../constants';


import { Button } from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import CreateIcon from '@material-ui/icons/Create';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import Comments from '../../Comments';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  {faDownload, faPenNib}  from '@fortawesome/free-solid-svg-icons'
import SignatureContext from '../../SignatureContext';




import "react-perfect-scrollbar/dist/css/styles.css";
import Loader from '../../Loader';
const SideBarFields = ({ props,fieldGroups, handleShowPanel , fieldGroupss ,  fields, onDropField, onEditField, onDeleteField,showPanel  ,setDeleteIconVisible ,handleDeleteField ,selectedFont , setSelectedFont , inputSize , setInputSize , setContent}) => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  const [state, _setState] = useState({
    scale: 1.3,
    pages: [],
    name: null,
    pdf: null,
    open: false,
    mode:'none'
})
const [loader,setLoader] = useState(false);
const [owner,setOwner] = useState(false);
const [images,setImages] = useState(null);

const [signatureData,setSignatureData] = useState({});
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
  const [fieldsByPages, setFieldsByPages] = useState({});


const [downloadedPdfUrl, setDownloadedPdfUrl] = useState(null);
const handleSign = ()=>{
    setLoader(true);
    axios.post('/api/documents/'+localStorage.getItem('current_id')+'/sign',{modifications:images,scale:state.scale},{withCredentials:true}).then(
        (data)=>{
            setLoader(false);
            props.loadPdf();

        }
    )
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
function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}
const download = async()=>{
   setLoader(true);
   let data  =toArrayBuffer(props.pdf.data);
   fileDownload(data,'signed.pdf');
   const pdfBlob = new Blob([data], { type: 'application/pdf' });
const pdfUrl = URL.createObjectURL(pdfBlob);
setDownloadedPdfUrl(pdfUrl);
   setLoader(false);

}
const history= useHistory();
const setSigningMode = ()=>{
   if(signatureData.signature || signatureData.imageSignature)setState({mode:'sign'});
   else {
        history.push('/sig');
   }
}

const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);




  //
  const handleFontFamilyChange = (event) => {
    setSelectedFont(event.target.value);
  };
  // Function to handle input size change
  const handleInputChangeSize = (event) => {
    setInputSize(parseInt(event.target.value));
  };

  const [signatureDataURL, setSignatureDataURL] = useState('');

  const textt = () => {
    setContent(image);

  };

  return(
  <div className={styles.fieldsWrapper} style={{width:'300px' , backgroundColor:"white"}}>
    <div className={styles.fields}>
      <h2 style={{fontFamily:'Verdana'}}><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fields</h2>
      {Object.entries(fieldGroups).map(([key, value]) => (
        <Fragment key={key}>
          {value.map((field) => (
            <div key={field.id}>
              <SourceFieldBox field={field}  />



            </div>
          ))}

        </Fragment>
      ))}



      <br/><br/><br/><br/><br/><br/><br/><br/>
      <div> <CustomButton text="Sign" onClick={handleSign} style={{width:'50%',margin:'10px', left:'70px'}} ></CustomButton>


<CustomButton text="Reject" onClick={handleReject} style={{width:'50%',margin:'10px' , left:'70px'}}></CustomButton></div>

    </div>

  </div>
  )
};

export default SideBarFields;
