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

import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import Loader from './Loader';
export default function Pdf(props) {
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
                        <Button color="inherit" onClick={() => { download() }} ><FontAwesomeIcon icon={faDownload} size='lg'></FontAwesomeIcon></Button>

                    </div>


                </Toolbar>
            </AppBar>

            <Grid container>
                <Grid item xs={9}>
                    <div className={classes.root}>
                        <PerfectScrollbar>

                        {generatePages()}
                        </PerfectScrollbar>
                    </div>
                </Grid>
                {state.open || (owner&& !props.isOwnerSigner) || props.signed ? (<Grid item xs={3}>

                    <Comments open={state.open} setState={setState}></Comments>
                </Grid>) : (
                
                    <Grid item xs={3} justify='center' alignItems='center'>
                    <Grid container style={{width:'100%',height:'100%'}} justify='center' alignItems='center'>

                            <div >

                            <CustomButton text="Sign" onClick={handleSign} style={{width:'80%',margin:'10px'}} ></CustomButton>
                      

                            <CustomButton text="Reject" onClick={handleReject} style={{width:'80%',margin:'10px'}}></CustomButton>
                            </div>
                        </Grid>
                </Grid>)}


            </Grid>
          </SignatureContext.Provider>  

    );
}