import React from 'react';
import GoogleSignin from './GoogleSignin';
import { grey } from '@material-ui/core/colors';
import './LoginPage.css'
import { makeStyles } from '@material-ui/core';
export default function LoginPage() {

    const useStyles = makeStyles((theme) => ({
        textOverlay: {
            position: 'absolute',
            left: '0%',
            top: '0%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            margin: '0px',
            padding: '0px'
        },
        sloganDiv: {
            textAlign: 'center',
            height: 'auto',
            width: '60%',
            margin: '0px'
        },
        sloganText: {
            fontSize: '9vw',
            color: grey['100']
        },
        signinButton: {
            marginLeft: 'auto',
            height: 'auto',
            marginRight: 'auto',
            maxWidth: '300px',
            minWidth: '200px',
            width: '60%'
        }
    }))
    const classes = useStyles();
    return (

        <div id="front_page">
            <div className={classes.textOverlay}>
                <div className={classes.sloganDiv} >
                    <h1 className={classes.sloganText}>Sign Anywhere  Anytime</h1>
                </div>
                <div className={classes.signinButton}  >
                    <GoogleSignin > </GoogleSignin>
                </div>

            </div>
        </div>

    )

}
