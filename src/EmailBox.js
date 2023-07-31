import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import Loader from './Loader';
import SendIcon from '@material-ui/icons/Send';
import { grey } from '@material-ui/core/colors';
import CustomButton from './CustomButton';
import { useParams } from 'react-router';



export default function EmailBox(props) {

    const [state, setState] = useState({
        subject: '',
        body: '',
        loader: false
    })
    const params = useParams();
    const handleChange = (e) => {
        setState({ ...state, [e.target.id]: e.target.value });
    }
    const sendEmail = () => {
        setState({ ...state, loader: true });

        axios.post('../api/documents/' +params.fileID + "/email", { subject: state.subject, body: state.body }).then(
            data => {
                props.changeState();
            },
            error => {
                setState({ ...state, loader: false });
            }
        );


    }
    const disabledButton = () => {
        return (state.subject.trim() == '' || state.body.trim() == '');
    }


    return (
        <React.Fragment>
            
            <Grid container style={{ alignContent: 'center', justifyContent: 'center', margin: 'auto', width: '50vw', height: 'auto', backgroundColor: grey[10], padding: '30px', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                <Grid item xs={12} style={{ textAlign: 'center' }} >
                    <TextField
                        id="subject"
                        label="Subject"
                        defaultValue=""
                        variant="outlined"
                        style={{ width: "80%" }}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'center', paddingTop: '20px' }}>
                    <TextField
                        id="body"
                        label="Body"
                        defaultValue=""
                        multiline
                        rows="5"
                        rowsMax="7"
                        variant="outlined"
                        style={{ width: "80%" }}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item sm={12} style={{ textAlign: 'center' }}>
                    <CustomButton text="Send Email" icon={SendIcon} onClick={sendEmail} disabled={disabledButton()} style={{margin:'5px'}}></CustomButton>
                </Grid>
                <Loader open={state.loader}></Loader>
            </Grid>


        </React.Fragment>

    );
}
