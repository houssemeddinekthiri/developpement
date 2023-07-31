import { Box, Grid, Snackbar } from "@material-ui/core";
import axios from "axios";
import { useRef, useState } from "react";
import CONSTS from "./constants";
import CustomButton from "./CustomButton";
import AlertSnackBar from './AlertSnackBar';
import DocumentInfo from "./DocumentInfo";
import Loader from "./Loader";
export default function VerifyDocument() {
    const [file, setFile] = useState(null);
    const [uploaded, setUploaded] = useState(false);
    const inputRef = useRef(null)
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [originalDocument, setOriginalDocument] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [alertState, setAlertState] = useState({
        text: '',
        alert: false,
        severity: 'success',

    })
    const handleAlertClose = () => {
        setAlertState({ ...alertState, alert: false });
    }
    const verify = (file) => {

        setLoader(true);
        let formData = new FormData();
        formData.append(
            "doc",
            file,
            file.name
        )
        axios.post('api/documents/verify', formData, { withCredentials: true }).then(
            (data) => {
                if (data.data.verified) {
                    setAlertState({ ...alertState, alert: true, text: 'Document is verified to be legitimate', severity: 'success' });
                    setOriginalDocument(data.data.document);
                    setLoader(false);
                    setLoaded(true);


                }
                else {
                    setAlertState({ ...alertState, alert: true, text: 'Document is Tampered', severity: 'error' });
                    setLoader(false);
                }
            }
        )
    }
    const handleClose = () => {
        setOpen(false);
    }
    const onFileChange = (event) => {
        setOriginalDocument(null);
        if (event.target.files.length > 0) {
            setFile(event.target.files[0]);
            verify(event.target.files[0]);
        }
    }
    return (
        <div style={{ width: '100%' }}>
            <Loader oper={loader}></Loader>
            {open && originalDocument ? (
                <DocumentInfo open={open} verify={true} handleClose={handleClose} document={originalDocument}  ></DocumentInfo>

            ) : (<></>)}
            <Grid container >

                <AlertSnackBar text={alertState.text} alert={alertState.alert} handleClose={handleAlertClose} severity={alertState.severity}></AlertSnackBar>
                <Grid container item xs={10} sm={6} style={{ height: '50vh', marginLeft: 'auto', marginTop: '20px', marginRight: 'auto', boxShadow: CONSTS.boxShadow, textAlign: 'center' }} alignItems='center' justify='center'>

                    <Grid item container xs={11} style={{ border: '2px dashed grey', height: '40vh' }} justify="center" alignItems="center">
                        {!originalDocument ?(
                            <Grid item>
                                <h5 style={{ fontFamily: 'poppins' }}>{"Upload A Document to Verify"} </h5>
                                <input type="file" accept="pdf" onChange={onFileChange} ref={inputRef} style={{ display: 'none' }}></input>
                                <CustomButton text="Click Here To Upload" onClick={() => { inputRef.current.click(); }}></CustomButton>
                              
                            </Grid>
                          ):(
                            <Grid item>
                            <h5 style={{ fontFamily: 'poppins' }}>{"Document is verified"} </h5>
                            <CustomButton text="Go Back" onClick ={()=>{ setOriginalDocument(null) }}></CustomButton>
                            <CustomButton text="Document details" style={{ margin: '5px' }} onClick={() => { setOpen(true) }}></CustomButton>
                           
                            </Grid>

                          ) }
                     </Grid>





                </Grid>

            </Grid>

        </div>
    )
}