import React, { useState } from 'react';
import GoogleSignin from './GoogleSignin';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
 import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import './styles.css';
import image from './assets/images/LOGO.png'

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
 
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],

    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  size: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },

  paper: {
    margin: theme.spacing(2, 6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(0),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
 
}));

export default function LoginPage() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        window.location.href = '/';
      } else {
        // Handle login failure
      }
    } catch (error) {
      console.error(error);
      // Handle login failure
    }
  };

  return (




<><div className="bg-light-main">

</div>
<main className="banner">
  <div className="container">
    <div className="contents">
      <div   >
   
        <Grid  >
    <CssBaseline />
 
    <Grid
      className={classes.size}
      item
      xs={12}
      sm={8}
      md={10}
      component={Paper}
      elevation={1}
      square
     
    >
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
        
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
         
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="email"
            name="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
       
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleLogin}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
               
              </Link>
              <div className={classes.signinButton}>
          <GoogleSignin> </GoogleSignin>
        </div>
            </Grid>
          </Grid>
        
        </form>
      </div>
    </Grid>
  </Grid>
      </div>
  
    </div>
  </div>
</main>
</>
  );
}

       

