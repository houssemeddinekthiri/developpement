import React, { Component, useEffect, useRef, useState } from 'react';
import signaturePad from 'signature_pad';
import * as  fileDownload from 'js-file-download';
import { Button, Grid, makeStyles } from '@material-ui/core';
import axios from 'axios';
import trimCanvas from 'trim-canvas'
import SignatureCanvas from 'react-signature-canvas'
import { grey } from '@material-ui/core/colors';
import Loader from './Loader';


export default function SignatureBox(props) {
    const [signature_pad, setSignaturePad] = useState(null);
    let canvasRef = {};
    const parentRef = useRef(null);
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(0);
    const [sig, setSig] = useState(null);
    const [flag, setFlag] = useState(false);
    const [penColor,setPenColor]= useState('black');
    const [saved,setSaved] = useState(false);
    const [loader,setLoader] = useState(false);
    useEffect(() => {
         setWidth(parentRef.current.getBoundingClientRect().width);

    },[props])
    

    const handleSave  = async ()=>{
       setLoader(true);
        var buf = Buffer.from(canvasRef.toDataURL().split(',')[1], 'base64');
        let file = new File([buf],'signature.png');
    
         let formData = new FormData();
         formData.append(
            "doc",
            file,
            'signature.png'
          );
          formData.append('type','handwritten')

         axios.post('/api/users/uploadsignature',formData,{withCredentials:true}).then(
             (data) => {props.loadSignatures();setSaved(true);setLoader(false)},
             (err)=>{console.log(err); setLoader(false)}
         )
        }
    useEffect(() => {
        setWidth(parentRef.current.getBoundingClientRect().width);
    }, [flag])
    const clear = () => {
        canvasRef.clear();
        setSaved(false);
    }
    return (
        <>
        <Loader open={loader}></Loader>
            <Grid container alignItems='center' justify='center' style={{ textAlign: 'center',width:'100%', marginTop: '10px', marginLeft: '0px', paddingLeft: '0px' }} >
        
        <Grid item container xs={2} sm={1} lg={1} justify="flex-end" style={{backgroundColor:grey[100],borderRadius:'20px'}}>
            <Grid item xs={6} id="black" style={{margin:'10px'}} onClick={()=>setPenColor("black")} >
                <div style={{backgroundColor:'black',width:'30px',height:'30px',borderRadius:'50%',border:(penColor=="black"? "2px solid skyblue":"none" )}}>

                </div>
            </Grid>
            <Grid item id="blue" xs={6} style={{margin:'10px'}} onClick={()=>setPenColor("blue")}>
                <div style={{backgroundColor:'blue',width:'30px',height:'30px',borderRadius:'50%',border:(penColor=="blue"? "2px solid skyblue":"none" )}}>

                </div>
            </Grid>
            <Grid item id="green" xs={6} style={{margin:'10px'}} onClick={()=>setPenColor("green")}>
                <div style={{backgroundColor:'green',width:'30px',height:'30px',borderRadius:'50%',border:(penColor=="green"? "2px solid skyblue":"none" )}}>

                </div>
            </Grid>
            <Grid item id="red" xs={6} style={{margin:'10px'}} onClick={()=>setPenColor("red")}>
                <div style={{backgroundColor:'red',width:'30px',height:'30px',borderRadius:'50%',border:(penColor=="red"? "2px solid skyblue":"none" )}}>

                </div>
            </Grid>
        
            </Grid>
            <Grid item container xs={10} sm={8} lg={8} >
                
                <div ref={parentRef} style={{ width: '100%',boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
 }}>
     
{/* 
                    <canvas width={width} height={300} style={{
                        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
                    }} ref={canvasRef} ></canvas> */}
                    <SignatureCanvas  penColor={penColor} ref={(ref) => { canvasRef = ref }}
    canvasProps={{width:width,height:300,className: 'sigCanvas'}} />
                </div>
            </Grid>
           
                   

            
            <Grid item xs={8} style={{ textAlign: 'center', margin: '10px' }}>

            {saved ? (<Button variant="contained"  style={{
                    margin: '5px',color:'white', backgroundImage:
                        'linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)', fontFamily: 'poppins' }}>saved</Button>):(
                            <Button variant="contained" color="primary" style={{
                                margin: '5px', backgroundImage:
                                    'linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)', fontFamily: 'poppins'
                            }} onClick={handleSave} >save or Replace</Button>

                        )}  

                <Button variant="contained" color="primary" style={{
                    margin: '5px', backgroundImage:
                        'linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)', fontFamily: 'poppins'
                }} onClick={clear}  >Clear</Button>
            </Grid>

        </Grid>
      
        </>
      )
}
