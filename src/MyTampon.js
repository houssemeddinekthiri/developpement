import { Box, Grid, List, ListItem } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Sig from './sig.png';
import CustomButton from "./CustomButton";
import CONSTS from "./constants";
import Loader from "./Loader";
export default function MyTampon(props) {
    const [default_, setDefault] = useState(0);
    useEffect(() => {
        setDefault(props.signatures.default)
    }, [props])

    return (
        <React.Fragment>
            {props.signatures && ( props.signatures.TamponImage) ?

                (
                    <Grid container justify="center" >

                    {props.signatures && props.signatures.TamponImage ?
                        (
                            <Grid container item xs={10} sm={4} style={{ margin: '20px', boxShadow: CONSTS.boxShadow,borderRadius:'5%' }} justify='center' alignItems='center'>
                                <Grid item xs={11} sm={12} container justify="center" >

                                    <img src={props.signatures.TamponImage} style={{ width: '60%', padding: '20px' }}></img>
                                </Grid>
                                <Grid item container xs={11} sm={12} justify='center'>
                                        <CustomButton text="Replace" style={{ margin: '5px' ,borderRadius:'5%'}} onClick={() => props.setValue(1)} ></CustomButton>


                                </Grid>
                            </Grid>
                        ) :
                        (<></>)

                    }
                </Grid>

                ):
                (
                    <Grid container justify="center" alignItems="center" style={{height:'50vh',width:'100%'}}>
                        <Grid item container xs={10} sm={6} justify="center" alignItems="center" >
                        <Grid>
                            <div style={{textAlign:'center'}}>
                            <h4 style={{fontFamily:'poppins'}}>No Buffer are found to display</h4>
                            <CustomButton onClick={()=>{props.setValue(1)}} text="Create your Buffer"></CustomButton>
                            </div>

                        </Grid>

                        </Grid>
                    </Grid>

                )
            }

        </React.Fragment>
    )
}
