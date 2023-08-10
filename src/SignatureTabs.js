import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Box } from '@material-ui/core';
import SignatureBox from './SignatureBox';
import SignatureImage from './SignatureImage';
import axios from 'axios';
import MySignatures from './MySignatures';
import CONSTS from './constants';
import Loader from './Loader';
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function CenteredTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [signatures,setSignatures] = useState({});
  const [loader,setLoader] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const toBase64 = (buffer)=>{
    let TYPED_ARRAY = new Uint8Array(buffer);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
      return data + String.fromCharCode(byte);
      }, '');
    let base64String = btoa(STRING_CHAR);
      return 'data:image/png;base64, '+base64String;

  }
  useEffect(()=>{
    loadSignatures();
  },[]);
  const loadSignatures = ()=>{
    setLoader(true);
    axios.get('/api/users/getsignatures',{withCredentials:true}).then(
      (data)=>{
        console.log(data.data);
        let signature = null;
        let imageSignature= null;
        if(data.data.signature)
         signature = toBase64(data.data.signature.data);
         if(data.data.imageSignature)
         imageSignature =toBase64(data.data.imageSignature.data);
        console.log(signature);
        setSignatures({
          signature:signature,
          imageSignature:imageSignature,
          default:data.data.defaultSignature
        })
        setLoader(false);
      },
      (err)=>{
        setLoader(false);
      }
    )
  }
  const changeDefaultSignature = (value)=>{
    setLoader(true);
    axios.post('/api/users/defaultsignature',{defaultSignature:value},{withCredentials:true}).then(
      (data)=>{
        
        setSignatures({...signatures,default:value});
        setLoader(false);
      },
      (err)=>{
        setLoader(false);
      }
    )
  }

  return (
    <React.Fragment>
      <Loader open={loader}></Loader>
    <Paper className={classes.root}>
      <Tabs 
        style={{
          color:"#3f51b5"
        }}
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
      
        centered
      >
        <Tab label="My Signatures" />
        <Tab label="Draw" />
        <Tab label="Upload" />

      </Tabs>
    </Paper>
    <Box hidden={value!==0} >
      <MySignatures changeDefaultSignature={changeDefaultSignature} setValue={setValue} signatures={signatures}></MySignatures>
    </Box>
    <Box hidden={value!==1}>
      <SignatureBox value={value} loadSignatures={loadSignatures}></SignatureBox>
    </Box>
    <Box hidden={value!==2} >
      <SignatureImage loadSignatures={loadSignatures}></SignatureImage>
    </Box>
    </React.Fragment>
  );
}
