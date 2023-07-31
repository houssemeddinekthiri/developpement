import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
    Avatar,
    Chip,
    ListItem,
    ListItemAvatar,
    ListItemText
} from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles({
    table: {
        minWidth: 650
    }
});

function createData(email, expiryDate, status) {
    return { email, expiryDate, status };
}


export default function SignersTable(props) {
    const classes = useStyles();
    const [rows,setRows]= useState([]);
    useEffect(()=>{

        const rows = props.signers.map((signer)=>{
           return( createData(
                <ListItem style={{padding:'0px'}}>
                    <ListItemAvatar>
                        <Avatar alt={"Uknown"} src={signer.image}/>
                    </ListItemAvatar>
                    <ListItemText  secondary={signer.name ? signer.email:''} primary={signer.name ? signer.name : signer.email} />
                </ListItem>,
                moment(signer.deadline).format('YYYY-MM-DD HH:mm'),
        
                <Chip
                    variant="outlined"
                    color="secondary"
                    label={signer.status}
                ></Chip>
            ))
        })
        setRows(rows);
    },[])
   

    return (
        <TableContainer component={Paper} elevation={0}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell >Expiry Date</TableCell>
                        <TableCell >Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell style={{padding:'2px'}} component="th" scope="row">
                                {row.email}
                            </TableCell>
                            <TableCell >{row.expiryDate}</TableCell>
                            <TableCell >{row.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
