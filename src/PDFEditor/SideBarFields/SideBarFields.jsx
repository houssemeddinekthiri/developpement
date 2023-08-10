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

const SideBarFields = ({ props,fieldGroups, fieldsByPages, handleShowPanel , fieldGroupss ,  fields, onDropField, onEditField, onDeleteField  ,setDeleteIconVisible ,handleDeleteField}) => {
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
              />
          );
      })
  }

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
     setLoader(false);

 }
 const history= useHistory();
 const setSigningMode = ()=>{
     if(signatureData.signature || signatureData.imageSignature)setState({mode:'sign'});
     else {
          history.push('/sig');
     }
 }
  const classes = useStyles();
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
