import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Box } from '@material-ui/core';
import SignatureBox from './SignatureBox';
import SignatureImage from './SignatureImage';
import TamponImage from './TamponImage';
import axios from 'axios';
import MySignatures from './MySignatures';
import MyTampon from './MyTampon';
import CONSTS from './constants';
import Loader from './Loader';
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function TamponTabls() {
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
    axios.get('/api/users/getTampon',{withCredentials:true}).then(
      (data)=>{
        console.log("oumaima"+data.data.TamponImage);

        let TamponImage= null;
        if(data.data.TamponImage)

         if(data.data.TamponImage)
         TamponImage =toBase64(data.data.TamponImage.data);

        setSignatures({

          TamponImage:TamponImage,

        })
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
        <Tab label="My Buffer" />

        <Tab label="Upload" />

      </Tabs>
    </Paper>
    <Box hidden={value!==0} >
      <MyTampon  setValue={setValue} signatures={signatures}></MyTampon>
    </Box>

    <Box hidden={value!==1} >
      <TamponImage loadSignatures={loadSignatures}></TamponImage>
    </Box>
    </React.Fragment>
  );
}
