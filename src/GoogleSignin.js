import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router';
import gicon from './google.png'

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#3300FF',
        height: '50px',
        textAlign: 'center'
    },
    imageDiv: {
        width: "18%",
        height: '100%',
        display: 'inline-block',
        margin: '0px',
        float: 'left',
        backgroundColor: 'white'
    },
    img: {
        height: '90%',
        width: '80%'
    },
    txtDiv: {
        width: "82%",
        height: '100%',
        cursor: 'pointer',
        display: 'inline-block',
        padding: '0px',
        color: 'white'
    },
    txt: {
        marginTop: '18px'
    }

}))
export default function GoogleSignin() {
    const classes = useStyles();
    const href = "http://localhost:3001/auth/google"
    return (
      
        <div className={classes.root}>
            <div className={classes.imageDiv}>
                <img className={classes.img} src={gicon}></img>
            </div>
            <div className={classes.txtDiv} onClick={() => { window.location.replace(href) }} >
                <p className={classes.txt}>Sign in with Google</p>
            </div>
        </div>
    );
}
