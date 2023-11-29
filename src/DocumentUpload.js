import axios from 'axios';
import React, { useEffect, useState } from 'react';
import GoogleChooser from './DriveUploadUtility';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import Loader from './Loader';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ComputerIcon from '@material-ui/icons/Computer';
import CustomButton from './CustomButton';
import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import { FormControlLabel, Checkbox } from '@material-ui/core';

const useStyles = makeStyles({
  input: {
    display: 'none'
  }
});



function UploadFromSystem(props) {
  const handleFileChange = (event) => {
    onFileUpload(event)
  }
  const onFileUpload = (event) => {
    props.setFile(event.target.files[0]);
    props.setDocument(event.target.files[0]);
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <input
        accept="application/pdf"
        className={classes.input}
        id="invisible-input"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="invisible-input">
        <CustomButton text="Upload From PC" onClick={() => { document.getElementById('invisible-input').click() }} icon={ComputerIcon}></CustomButton>
      </label>
    </React.Fragment>

  )

}

function UploadFromDrive(props) {

  const onFileChange = (data) => {
    if (data.action == "picked") {
      const fileId = data.docs[0].id;
      axios.post("/api/documents/drive/" + fileId, {}, { withCredentials: true, responseType: 'arraybuffer' }).then(
        resp => {

          const arr = new Uint8Array(resp.data);
          const blob = new Blob([arr], { type: 'application/pdf' });
          const file = new File([blob], "demo.pdf");

          props.setFile(file);
          props.setDocument(file);

        }
      );

    }
  }
  return (
    <div>

      <GoogleChooser clientId={"590836734361-smo1evccgmndrq0finsa92979rv09th7.apps.googleusercontent.com"}
        developerKey={"AIzaSyAcqjChzklH2e84G0zS0yPSDhSFTW7dv5s"}
        scope={['https://www.googleapis.com/auth/drive.file']}
        onChange={data => onFileChange(data)}
        onAuthFailed={data => console.log(data)}
        multiselect={false}
        navHidden={true}
        authImmediate={false}
        mimeTypes={['application/pdf']}
      >
        <div className="google">
          <CustomButton text="Upload From Drive" icon={CloudUploadIcon}></CustomButton>
        </div>
      </GoogleChooser>




    </div>


  )



}

const styles = makeStyles(theme => ({
  grid: {
    backgroundColor: grey[10],
    width: "50%",
    height: '50vh',
    margin: 'auto',
    alignContent: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '90%',
      height: '60vh'
    },
    boxSizing: 'border-box',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'

  }
}));
export default function DocumentUpload(props) {
  const [state, setState] = useState({
    uploaded: false,
    name: null,
    description: null,
    loader: false, file: null
  });
  const history = useHistory();

  useEffect(() => {
    console.log(state);
  }, [state])


  const onSelect = () => {
    setState({ ...state, uploaded: true })

  }
  const setDocument = (fileData) => {
    let newState = { ...state, file: fileData, uploaded: true };
    setState(newState);
    // setFile(fileData);

  }
  const [selectedOption, setSelectedOption] = useState('Only Me'); // Step 2

  const handleCheckboxChange = (event) => {
    setSelectedOption(event.target.value); // Step 3
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.id]: e.target.value });
  }
const[id , setID]=useState('');
  const upload = async () => { // Déclarez la fonction comme async
    const formData = new FormData();
    formData.append(
      "doc",
      state.file,
      state.name,
    );
    const allPositions = [];
    formData.append('description', state.description);
    setState({ ...state, loader: true });
    const currentDate = new Date();
const fiveDaysLater = new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000);

    const signerr = {
      email: Cookies.get('email'),
      name: Cookies.get('name'),
      image:Cookies.get('image'),
      deadline:fiveDaysLater,
      order: 0
    };


    allPositions.push(signerr);

    try {
      const response = await axios.post("/api/documents", formData, { withCredentials: true });
      const data = response.data;

      props.setFileID(data);
      setState({ ...state, loader: true });
console.log("emaill:"+Cookies.get('image'))
      if (selectedOption === 'Only Me') {
        console.log("emaik:"+localStorage.getItem('user'))
        await axios.post(`/api/documents/${data._id}/Add_signers`, { signers: allPositions });
        setID(data._id)
        history.push('/doc/' + data._id);

      } else {
        window.location.replace(data._id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const buttonDisabled = () => {
    return (state.name == null || state.name.trim() == '')
  }
  const classes = styles();

  return (

    <React.Fragment>
      {state.uploaded == false ? (

        <Grid className={classes.grid} container direction="column">

          <Grid item style={{ padding: '10px' }} >
            <UploadFromSystem setDocument={setDocument} onSelect={onSelect} setFile={props.setFile} ></UploadFromSystem>
          </Grid>

          <Grid item >
            <UploadFromDrive setDocument={setDocument} onSelect={onSelect} setFile={props.setFile}></UploadFromDrive>
          </Grid>


        </Grid>


      ) : (

        <Grid className={classes.grid} container spacing={2}
        >
          <Grid item xs={12}>
            <TextField style={{ width: "100%" }}
              id="name"
              label="File Name"
              type="text"
              onChange={handleChange}
              variant="outlined"
              spellCheck='false'
              autoComplete='off'
            />
          </Grid>

          <Grid item xs={12}>
            <TextField style={{ width: "100%" }}
              id="description"
              label="Description (optional)"
              type="text"
              onChange={handleChange}
              multiline
              rowsMax={4}
              variant="outlined"
              spellCheck='false'
              autoComplete='off'
            />

          </Grid>
         &nbsp;&nbsp;&nbsp; <Grid item xs={12} container spacing={2}><h4  style={{fontFamily:'cursive'}}>Who will sign this document?   &nbsp;&nbsp;     </h4>&nbsp;&nbsp;<br/>
</Grid>
          <Grid item xs={12} container spacing={2}>

        <br/>
        &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedOption === 'Only Me'}
                onChange={handleCheckboxChange}
                value="Only Me"
              />
            }
            label="Only Me"
          />
</Grid>
    <Grid item xs={12} container spacing={2}>
    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;   <FormControlLabel
            control={
              <Checkbox
                checked={selectedOption === 'Several People'}
                onChange={handleCheckboxChange}
                value="Several People"
              />

            }
            label="Several People"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Grid>
          <Grid item xs={12} style={{ textAlign: 'center' }}>

            <CustomButton text="Upload" icon={CloudUploadIcon} onClick={upload} disabled={buttonDisabled()}></CustomButton>

          </Grid>

          <Loader open={state.loader}></Loader>

        </Grid>
      )}

    </React.Fragment>
  )
}





