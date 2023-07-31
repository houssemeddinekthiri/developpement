import './App.css';
import React, { useState }  from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import NavBar from './Navbar';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import Cookies from 'js-cookie';
import WorkFlowStepper from './WorkFlowStepper';
import Status from './Status';
import DocumentInfo from './DocumentInfo';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import Document from './Document';
import SignatureBox from './SignatureBox';
import SignatureTabs from './SignatureTabs';
import VerifyDocument from './VerifyDocument';
import Experiment from './Experiment';
import Pdf from './EditorPdf'
import samplePDF from './sample.pdf'
import Report from './Report';

const THEME = createMuiTheme({

});

function App() {
  const [pdf,setPdf]= useState(samplePDF);
  const handleFileChange =(pdf)=>{
    setPdf(pdf);
  }

  const isLoggedIn = () => {
    if (Cookies.get('id') === null || Cookies.get('id') === undefined) return false;
    let user = JSON.parse(window.atob(Cookies.get('id')));
    return (Cookies.get('email') && Cookies.get('name') && user && user.email === Cookies.get('email') && user.name === Cookies.get('name'));
  }
  const protectRoute = (Component) => () => {
    return isLoggedIn() ? ( Component) : (<Redirect to='/login'></Redirect>)
  }
  return (
    <MuiThemeProvider theme={THEME}>

    <Router>
      <Switch>
        <Route path='/login' render={() => { return !isLoggedIn() ? (<> <LoginPage></LoginPage> </>) : (<Redirect to='/'></Redirect>) }}></Route>
        <Route exact path="/add/:fileID" render={protectRoute(
          <>
            <NavBar></NavBar>
            <WorkFlowStepper></WorkFlowStepper>
          </>
        )}></Route>

        <Route exact path="/status" render={protectRoute(
          <>
            <NavBar></NavBar>
            <Status></Status>
          </>
        )}></Route>

         <Route exact path="/doc/:fileId" render={protectRoute(
          <>
            <Document></Document>
          </>
        )}></Route>
        <Route exact path="/sig" render={protectRoute(
          <>
            <NavBar></NavBar>
            <SignatureTabs></SignatureTabs>
            {/* <SignatureBox></SignatureBox> */}
          </>
        )}></Route>
         <Route exact path="/verify" render={protectRoute(
          <>
            <NavBar></NavBar>
            <VerifyDocument></VerifyDocument>
            {/* <SignatureBox></SignatureBox> */}
          </>
        )}></Route>
          <Route exact path="/editor" render={protectRoute(
          <>
            <NavBar></NavBar>
            <Pdf pdf={pdf}  handleFileChange = {handleFileChange}></Pdf>
            {/* <SignatureBox></SignatureBox> */}
          </>
        )}></Route>
        <Route exact path="/report" render={protectRoute(
          <>
            <NavBar></NavBar>
            <Report></Report>
          </>
        )}>
        </Route>
        <Route exact path="/" render={protectRoute(
          <>
            <NavBar></NavBar>
            <HomePage></HomePage>
          </>
        )}>

        </Route>
      </Switch>
    </Router>
    </MuiThemeProvider>
  );
}

export default App;
