import { CircularProgress, Grid } from '@material-ui/core';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import CONSTS from './constants';
import Loader from './Loader';
export default function Report() {
  const [loader,setLoader] = useState(true);
  const [state, setState] = useState({
    series: null,
    options: {
      dataLabels:{
        enabled:true,
        style: {
          fontSize: '10px',
          fontFamily: 'Poppins',
          
      },
     
      dropShadow:{
        enabled:false
      }
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true
              }
            }
          }
        }
      },
      chart: {
        width: 350,
        type: 'donut',

      },
      labels: ['Signed', 'Rejected', 'Expired'],
    }
  });
  const [pie2, setPie2] = useState({
    series: null,
    options: {
      dataLabels:{
        enabled:true,
        style: {
          fontSize: '10px',
          fontFamily: 'Poppins',
          
      },
     
      dropShadow:{
        enabled:false
      }
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true
              }
            }
          }
        }
      },
      chart: {
        width: 350,
        type: 'donut',

      },
      labels: ['Completed', 'Failed', 'Drafts'],
    }
  });
  useEffect(() => {
    axios.get('/api/users/analytics').then(
      (data) => {
        
        setState({ ...state, series: [data.data.signed, data.data.rejected, data.data.expired] })
        setPie2({ ...pie2, series: [data.data.completed, data.data.failed, data.data.drafts] })
        setLoader(false);
      },
      (err) => {
        setLoader(false);
      }
    )
  }, []);

  return (
    <React.Fragment>
      <Loader open={loader}></Loader>
      {pie2.series ? (
          <Grid container justify='center' alignItems="center" style={{width:'80vw',margin:'auto',marginTop:'30px',boxShadow:CONSTS.boxShadow}}>
          <Grid item sm={5} xs={10}  >
            <div style={{textAlign:'center'}}>
  
            <h5 style={{fontFamily:'poppins'}}>Documents shared with you</h5>
            </div>
            
            {state.series ?
              (
                <ReactApexChart  options={state.options} series={state.series} type="donut" width={350}></ReactApexChart>
              ) :
              (<></>)
  
            }
            
           
          </Grid>
          <Grid item sm={5} xs={10}>
            <div style={{textAlign:'center'}}>
  
          <h5 style={{fontFamily:'poppins'}}>Documents created by you</h5>
            </div>
            
            {pie2.series ? (
              <ReactApexChart options={pie2.options} series={pie2.series} type="donut" width={350}></ReactApexChart>
            ) : (<></>)}
          </Grid>
        </Grid>
      ):
      (<></>)}
  
     

    </React.Fragment>

  )


}
