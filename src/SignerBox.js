import React, { useEffect, useState } from 'react';
import { Checkbox, Fab, FormControlLabel, Grid } from '@material-ui/core';
import DateTime from './DateTime';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EmailSuggestionBox from './EmailSuggestionBox';
import CustomButton from './CustomButton';
import CONSTS from './constants';
import SendIcon from '@material-ui/icons/Send';


export default function SignerBox(props) {
    const [state, setState] = useState({
        email: null,
        name: null,
        deadline: new Date(),
        image: null
    });
    const [sequential, setSequential] = useState(false);
    useEffect(()=>{
        console.log(props)
        setSequential(props.seq);
    },[props.seq])
    const handleAdd = () => {
        props.handleAdd(state);
    }
    const handleChange = (e) => {

        setState(e);
    }
    const handleDateChange = (date) => {
        let newState = { ...state, deadline: date };
        setState(newState);
    }

    return (
        <React.Fragment>
            <Grid container spacing={2} direction="row" justify="center" alignItems="center" >
                <Grid item xs={12} sm={4}   >
                    <EmailSuggestionBox handleChange={handleChange}>
                    </EmailSuggestionBox>
                </Grid>
                <Grid item xs={12} sm={4} >
                    <DateTime onChange={handleDateChange} ></DateTime>
                </Grid>
                <Grid item xs={5} sm={1} >
                    <Fab color='secondary'  style={{backgroundImage:CONSTS.backgroundImage}} onClick={handleAdd}><PersonAddIcon></PersonAddIcon></Fab>
                </Grid>
              
                <Grid item xs={10} sm={5} >
                    <CustomButton text="submit" icon={SendIcon} style={{ padding: '7px' }} onClick={props.handleSubmit}></CustomButton>
                </Grid>
            </Grid>

        </React.Fragment>

    );
}

