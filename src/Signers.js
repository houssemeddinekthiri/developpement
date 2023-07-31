import React, { useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import axios from 'axios';
import { grey } from '@material-ui/core/colors';
import DraggableList from './DraggableList';
import AlertSnackBar from './AlertSnackBar';
import CONSTS from './constants';
import CustomButton from './CustomButton';
import Loader from './Loader';
import SignerBox from './SignerBox';
import { useParams } from 'react-router';
import Cookies from 'js-cookie';


const useStyles = makeStyles(() => ({
    root: {
        width: 'auto',
        textAlign: 'center'
    },
    rootGrid: {
        height: "60vh",
        marginTop: '0px'
    },
    signerBox: {
        backgroundColor: grey[10],
        boxShadow: CONSTS.boxShadow,
        padding: '30px'
    },

}))
export default function Signers(props) {
    const classes = useStyles();
    const [state, setState] = useState({
        signers: [],
        alert: false,
        loader: false,
        alertText:'',
        seq : false
    });
    const params = useParams();
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    const handleAdd = (data) => {
        // console.log(data.email);
        // if(Cookies.get('email')===data.email){
        //     setState({ ...state,alertText:'You cannot add yourself as a signer', alert: true });
        //     return;            
        // }
        if (!validateEmail(data.email)) {
            setState({ ...state,alertText:'Please Enter Valid Email', alert: true });
            return;
        }
        let filteredSigners = state.signers.filter((el) => { return el.email == data.email });
        if (filteredSigners.length == 0) {
            let Signers = [...state.signers, data];
            setState({ ...state, signers: Signers });
        }
        else {
            setState({ ...state,alertText:'you have already added this email', alert: true });
        }
    }
    const handleDelete = (email) => {
        let Signers = [...state.signers];
        Signers = Signers.filter(el => el.email !== email);
        setState({ ...state, signers: Signers });
    }
    const handleSwap = (signers) => {
        setState({ ...state, signers: signers })
    }
    const handleClose = () => {
        setState({ ...state, alert: false });
    }
    const handleSubmit = () => {
        setState({ ...state, loader: true });
        axios.post('../api/documents/' +params.fileID + '/signers', { signers: state.signers , sequential:state.seq}, { withCredentials: true }).then(
            (data) => {
                props.changeState();
                setState({ ...state, loader: false });
            },
            (err) => {
                setState({ ...state, loader: false });
            }

        )
    }
    const setSequential = (event)=>{
        setState({...state,seq:event.target.checked})
    }

    return (
        <div className={classes.root}>
            <AlertSnackBar text={state.alertText} alert={state.alert} handleClose={handleClose} severity="warning"></AlertSnackBar>
            <Loader open={state.loader}></Loader>
            <Grid container justify='center' alignItems='center' className={classes.rootGrid}>
                <Grid xs={11} item className={classes.signerBox}   >
                    <SignerBox seq = {state.seq} setSequential={setSequential} handleSubmit ={handleSubmit} handleAdd={handleAdd} ></SignerBox>
                </Grid>
                <Grid xs={11} sm={8} item>
                    <DraggableList handleSwap={handleSwap} handleDelete={handleDelete} signers={state.signers}></DraggableList>
                </Grid>
            </Grid>
        </div>
    )
}
