import React from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import moment from 'moment';
import CONSTS from './constants';
import { createMuiTheme,ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from '@material-ui/core';

const theme = createMuiTheme({
  overrides: {
    MuiTimelineItem: {
      missingOppositeContent: {
        "&:before": {
          display: "none"
        }
      }
    }
  }
});


export default function BasicTimeline(props) {
  const getColor = (action)=>{ 
    if(action==='created' || action==='viewed')return 'yellow';
    if(action==='expired' || action==='rejected')return 'red';
    if(action==='signed')return 'green';
     return "blue";

  }
  
  const getText = (action,email) =>{
    if(action ==='created'){
      return "Document Created by "+email;
    }
    if(action ==='viewed'){
      return "Document Viewed by "+email;
    }
    if(action==='signed'){
      return "Document Signed by "+email;
    }
    if(action==='expired'){
      return 'Document Expired for '+email;
    }
    if(action==='rejected'){
      return "Document Rejected by "+email;
    }
  }
  return (
    <ThemeProvider theme={theme}>
        <div >

      <Timeline align='right' >
        {props.timeline.map((el,i)=>{
           return(
            <TimelineItem>
            <TimelineSeparator>
              <TimelineDot style={{background:getColor(el.action) ,boxShadow:'none',width:'1px',height:'1px'}} />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                <h5 style={{padding:'0',margin:'0'}}>{getText(el.action,el.email)}</h5>
                <body>{moment(el.time).fromNow()}</body>
            </TimelineContent>
          </TimelineItem>
           ) 
          })}
      
      </Timeline>
        </div>
      </ThemeProvider>

 );
}
