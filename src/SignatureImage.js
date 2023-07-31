import { Box, Divider, FormControlLabel, Grid, Switch, Typography } from "@material-ui/core";
import { Backup } from "@material-ui/icons";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import CONSTS from "./constants";
import CustomButton from "./CustomButton";
import Sig from './sig.png';
import Jimp from 'jimp';
import Loader from "./Loader";
export default function SignatureImage(props) {
    const [uploaded, setUploaded] = useState(false);
    const inputRef = useRef(null);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [saved, setSaved] = useState(false);
    const [color, setColor] = useState("none");
    const [transparent, setTransparent] = useState(false);
    const [preview, setPreview] = useState(null);
    const [loader,setLoader] = useState(false);
    const handleChange = (event) => {
        setImageFile(event.target.files[0]);
        setImage(URL.createObjectURL(event.target.files[0]));
        setPreview(URL.createObjectURL(event.target.files[0]));
        setUploaded(true);
    }
    useEffect(() => {
        setColor("none");
    }, [])
    const handleSave = async () => {
        setLoader(true);
        let buff = await fetch(preview).then(res => res.arrayBuffer())

        let file = new File([buff], "image.png");
        let formData = new FormData();
        formData.append(
            "doc",
            file,
            'signature.png'
        );
        formData.append('type', 'image')

        axios.post('/api/users/uploadsignature', formData, { withCredentials: true }).then(
            (data) => { props.loadSignatures(); setSaved(true);setLoader(false); },
            (err) => { console.log(err) ;setLoader(false)}
        )
    }
    const imageColorChange = (img, red, green, blue, alpha) => {
        alpha = (alpha===true)?1:0;
        console.log(alpha);
        Jimp.read(img).then(function (image) {

            image.quality(60)                 // set JPEG quality
                .greyscale()                 // set greyscale
                .contrast(1)
                .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {


                    let r = image.bitmap.data[idx + 0]
                    let g = image.bitmap.data[idx + 1]
                    let b = image.bitmap.data[idx + 2]
                    let a = image.bitmap.data[idx + 3]
                    if (r == 0 && g == 0 && b == 0) {
                        image.bitmap.data[idx + 0] = red;
                        image.bitmap.data[idx + 1] = green;
                        image.bitmap.data[idx + 2] = blue;
                    }
                    if (r == 255 && g == 255 && b == 255) {

                        image.bitmap.data[idx + 3] = alpha;
                    }


                }).getBuffer(Jimp.MIME_PNG, function (err, src) {
                    let file = new File([src], 'preview.png');

                    setPreview(URL.createObjectURL(file));
                });
        });

    }
    const changeImageTransparent = (img, transparent) => {
        transparent = (transparent===true) ? 1 : 0 ;
        console.log(transparent);
        Jimp.read(img).then(function (image) {
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {


                let r = image.bitmap.data[idx + 0]
                let g = image.bitmap.data[idx + 1]
                let b = image.bitmap.data[idx + 2]
                let a = image.bitmap.data[idx + 3]
                if (r == 255 && g == 255 && b == 255) {

                    image.bitmap.data[idx + 3] = transparent;
                }
            }).getBuffer(Jimp.MIME_PNG, function (err, src) {
                let file = new File([src], 'preview.png');
                setPreview(URL.createObjectURL(file));
            });
        })
    }

    const changeColor = (color) => {
        switch (color) {
            case ("red"): imageColorChange(image, 255, 0, 0, !transparent); break;
            case ("blue"): imageColorChange(image, 0, 0, 255, !transparent); break;
            case ("green"): imageColorChange(image, 0, 255, 0, !transparent); break;
            case ("black"): imageColorChange(image, 0, 0, 0, !transparent); break;
            default:
                setPreview(image);
                break;
        }
        setColor(color);
    }
    const resetColor = () => {
        changeColor("none");
        setSaved(false);
    }
    const changeToTransparent = (transparent) => {
        changeImageTransparent(preview, !transparent);
        setTransparent(transparent);
    }
    return (
        <React.Fragment>
            <Loader open={loader}></Loader>
            <div style={{ textAlign: 'center', width: '100%' }}>
                <Grid container >

                    {!uploaded ?
                        (
                            <Grid item xs={10} sm={6} container style={{ height: '50vh', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', boxShadow: CONSTS.boxShadow }} justify='center' alignItems='center' >

                                <Grid item container xs={10} style={{ height: '40vh', border: '2px dashed grey', textAlign: 'center' }} justify="center" alignItems='center'  >
                                    <Grid item>
                                        <p style={{ fontFamily: 'poppins' }}>Upload your signature here</p>
                                        <input type="file" accept="image/png, image/jpeg" onChange={handleChange} ref={inputRef} style={{ display: 'none' }} ></input>
                                        <CustomButton text="Upload Image" icon={Backup} onClick={() => { inputRef.current.click() }}></CustomButton>
                                    </Grid>

                                </Grid>
                            </Grid>
                        ) :
                        (
                            <>
                                <Grid item xs={10} md={6} container style={{ maxHeight: '60vh', height: '50vh', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', boxShadow: CONSTS.boxShadow }} justify='center' alignItems='center' >

                                    <Grid item container xs={10} justify="space-between" alignItems="center" >

                                        <Grid item xs={4} >
                                            <img style={{ maxHeight: '30vh', width: '100%' }} src={image}></img>
                                        </Grid>
                                        <Grid item xs={4} >
                                            <img style={{ maxHeight: '25vh', width: '100%', border: '2px solid blue' }} src={preview}></img>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item container xs={4}>

                                            <Grid item xs={12}>

                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={transparent}
                                                            onChange={() => { changeToTransparent(!transparent) }}
                                                            name="transparent"
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Transparent"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid item container xs={8} justify="center">

                                            <Grid item xs={1} id="black" style={{ margin: '10px' }} onClick={() => changeColor("black")} >
                                                <div style={{ backgroundColor: 'black', width: '30px', height: '30px', borderRadius: '50%', border: (color == "black" ? "2px solid skyblue" : "none") }}>

                                                </div>
                                            </Grid>
                                            <Grid item id="blue" xs={1} style={{ margin: '10px' }} onClick={() => changeColor("blue")}>
                                                <div style={{ backgroundColor: 'blue', width: '30px', height: '30px', borderRadius: '50%', border: (color == "blue" ? "2px solid skyblue" : "none") }}>

                                                </div>
                                            </Grid>
                                            <Grid item id="green" xs={1} style={{ margin: '10px' }} onClick={() => changeColor("green")}>
                                                <div style={{ backgroundColor: 'green', width: '30px', height: '30px', borderRadius: '50%', border: (color == "green" ? "2px solid skyblue" : "none") }}>

                                                </div>
                                            </Grid>
                                            <Grid item id="red" xs={1} style={{ margin: '10px' }} onClick={() => changeColor("red")}>
                                                <div style={{ backgroundColor: 'red', width: '30px', height: '30px', borderRadius: '50%', border: (color == "red" ? "2px solid skyblue" : "none") }}>

                                                </div>
                                            </Grid>

                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12}>
                                            {saved ? (<CustomButton text="saved" style={{ margin: '10px' }}></CustomButton>) : (<CustomButton text="Save" style={{ margin: '10px' }} onClick={handleSave}></CustomButton>)}
                                            <CustomButton text="Back" onClick={() => { setUploaded(false); setImage(null); setSaved(false) }}></CustomButton>
                                            <CustomButton text="Reset Color" onClick={resetColor} style={{ margin: '10px' }}></CustomButton>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </>
                        )
                    }



                </Grid>
            </div>

        </React.Fragment>
    )
}