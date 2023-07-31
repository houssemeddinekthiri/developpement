import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CONSTS from './constants';

export default function CustomButton(props) {
    const useStyles = makeStyles({
        root: {
            backgroundImage: props.disabled===true ? 'none' :  CONSTS.backgroundImage,
            color: 'white',
            padding: '5px',
            borderRadius: '3px',
        },
        label: {
            fontFamily: CONSTS.fontFamily,
            textTransform: 'capitalize',
            fontWeight: '600',
        },
    });
    
    const classes = useStyles();

    return (
        <Button onClick={props.onClick ? props.onClick : (()=>{})} disabled={props.disabled!=null ? props.disabled :false} variant='contained'
            classes={{
                root: classes.root,
                label: classes.label,
            }}
            style={props.style ? props.style : {}}
        >
            {
                props.icon ?
                    (<props.icon/>) :
                    (<React.Fragment>
                    </React.Fragment>)
            }
            <span style={props.icon ? {paddingLeft:'5px'}:{}} > {props.text ? props.text: ''}</span>
        </Button>
    );
}