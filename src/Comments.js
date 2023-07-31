import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText, Divider, TextField, Grid, Fab, ListItemAvatar, Avatar } from '@material-ui/core';
import CustomButton from './CustomButton';
import SendIcon from '@material-ui/icons/Send';
import CONSTS from './constants';
import axios from 'axios';
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    fontFamily: 'poppins !important',
    textTransform: 'capitalize !important'

  },

}));


export default function Comments(props) {
  const classes = useStyles();
  const [comments,setComments] = useState([]);
  const [comment,setComment] = useState('');
  const loadComments = ()=>{
    axios.get('/api/documents/'+localStorage.getItem('current_id')+'/comments').then(
      (resp)=> {setComments(resp.data.comments);console.log(resp.data.comments)},
      (err)=> console.error(err)
    )
  }
  useEffect(()=>{
    loadComments();
  },[])
  const addComment = ()=>{
     
      if(comment  && comment.trim()!==''){
        axios.post('/api/documents/'+localStorage.getItem('current_id')+'/comments',{message:comment},{withCredentials:true}).then(
          (data) => {
            console.log(data.data);
            loadComments();
            setComment('');
          },
          (err)=> console.error(err)
    
        )
      }
  }
  const handleCommentChange= (event)=>{
      setComment(event.target.value);
  }
 
  return (
    <Grid container alignItems='flex-end'  style={{height:'88vh',flexDirection:'row'}}>
      <Grid item xs={12} style={{maxHeight:'10vh',alignSelf:'flex-start'}} >
        <div style={{height:'75vh'}}>
      <PerfectScrollbar>
        
        <List >
          {comments.map((comment,index)=>{
            return(
          <ListItem key={index} >
            <ListItemAvatar>
              <Avatar src={comment.user.image}></Avatar>
            </ListItemAvatar>
            <ListItemText style={{wordBreak:'break-all'}} primary={comment.user.name} secondary={comment.comment}>
            </ListItemText>
          </ListItem>
            )
          })}
         
        </List>
      </PerfectScrollbar>
        </div>
      </Grid>

      <Grid item xs={9} >
        <TextField variant='standard' rowsMax={3} label='Post' value={comment} onChange={handleCommentChange}  multiline  style={{marginBottom:'10px',marginLeft:'10px'}}></TextField>
        </Grid>
        <Grid item xs={3}>
        <Fab style={{backgroundImage:CONSTS.backgroundImage,}} onClick={addComment} ><SendIcon style={{color:'white'}} > </SendIcon></Fab>
      </Grid>
    </Grid>

      
   
  );
}
