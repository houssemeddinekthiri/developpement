import React, { useEffect, useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { makeStyles, withStyles } from '@material-ui/core';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import StepConnector from '@material-ui/core/StepConnector';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import EmailIcon from '@material-ui/icons/Email';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CONSTS from './constants';
import DocumentUpload from './DocumentUpload';
import Signers from './Signers';
import EmailBox from './EmailBox';
import axios from 'axios';
import { useParams } from 'react-router';

function getSteps() {
  return ['Upload A Document', 'Add  People to Sign', 'Generate Email'];
}
const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage: CONSTS.backgroundImage,
    },
  },
  completed: {
    '& $line': {
      backgroundImage: CONSTS.backgroundImage,
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage: CONSTS.backgroundImage,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage: CONSTS.backgroundImage
  },
});
function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <CloudUploadIcon />,
    2: <GroupAddIcon />,
    3: <EmailIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {

  active: PropTypes.bool,

  completed: PropTypes.bool,

  icon: PropTypes.node,
};


const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  stepperDiv: {
    width: "100%",
    textAlign: 'center'
  },
  stepperLabel: {
    fontFamily: CONSTS.fontFamily
  }
});

export default function WorkFlowStepper(props) {
  const classes = useStyles();

  const [state, setState] = useState({
    activeStep: null,
    file: null,
    id: null,
  });
  const params = useParams();
  useEffect(()=>{
    if(params.fileID!=='new'){

      axios.get('/api/documents/'+params.fileID +'/status',{withCredentials:true}).then(
        (data)=>{
          let status = data.data.status;
          if(status==='uploaded'){
            setState({...state,activeStep:1})
          }
         else if(status==='added_signers'){
            setState({...state,activeStep:2})
          }
          else {
            window.location.replace('/add/new');
          }
        }
  
      )
    }
    else{
      setState({...state,activeStep:0})
    }
  },[])

  const handleNext = () => {
    setState({ ...state, activeStep: state.activeStep + 1 });
  };


  const setFile = (fileData) => {
    setState({ ...state, file: fileData });

  }

  const setFileID = (id) => {
    setState({ ...state, id: id });
  }

  const viewFile = () => {
    window.location.replace("http://localhost:3000/status");
  }

  const stepContent = () => {
    if (state.activeStep == 0) {
      return (<DocumentUpload setFileID={setFileID} setFile={setFile} changeState={handleNext} />);
    }
    if (state.activeStep == 1) {
      return (<Signers changeState={handleNext} />)
    }
    if (state.activeStep == 2) {
      return (<EmailBox changeState={viewFile} />)
    }
  }
  return (
    <div className={classes.root}>
      {(state.activeStep < 3) ? (
        <div className={classes.stepperDiv}>

          <Stepper activeStep={state.activeStep} alternativeLabel connector={<ColorlibConnector />}>
            {getSteps().map((label) => (

              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon} className={classes.stepperLabel}>{label}</StepLabel>
              </Step>

            ))}
          </Stepper>

          <div>
            {stepContent()}
          </div>

        </div>
      ) : (
        // <Pdf pdf={URL.createObjectURL(state.file)}></Pdf>
        <div></div>
      )
      }
    </div>
  );
}


