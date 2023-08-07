import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Cookies from 'js-cookie';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import MailIcon from '@material-ui/icons/Mail';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import axios from 'axios';
import CONSTS from './constants';
import image from './assets/images/LOGO.png'

import { useHistory } from 'react-router';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    fontFamily: 'poppins !important',
    textTransform: 'capitalize !important'

  },
  appBar: {
    backgroundImage: CONSTS.backgroundImage
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      padding: '15px'
    },
    fontFamily: 'poppins',
    textTransform: 'capitalize ',
    fontWeight: '900'
  },
  navItem: {
    fontFamily: 'poppins',
    textTransform: 'capitalize ',
    fontWeight: '700',
    color: 'white',
    textDecoration: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    },
  },
  menuIcon: {
    [theme.breakpoints.up('xs')]: {
      display: 'none'
    },
    [theme.breakpoints.down('xs')]: {
      display: 'inline-block'
    },
  },
  list: {
    width: 300,
  },
  link: {
    textUnderline: 'none',
    textDecoration: 'none',
    color: 'inherit',
  }

}));


export default function NavBar(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [sideOpen, setSideOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    axios.post('/auth/logout').then(
      (data) => {
        window.location.replace("http://localhost:3000/login");
      }
    )
  }

  const handleDrawer = () => {
    setSideOpen(!sideOpen);
  }
  const history  = useHistory();
  return (
    <div className={classes.root}>
      <AppBar color="primary" className={classes.appBar} position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
           
          <img className="logo"  src={image} />
          </Typography>
          <Button className={classes.navItem} color="inherit"  onClick={()=>history.push('/')}>Home</Button>
          <Button className={classes.navItem} color="inherit"  onClick={()=>history.push('/add/new')}>add Document</Button>
          <Button className={classes.navItem} color="inherit"  onClick={()=>history.push('/status')}>Documents</Button>
          <Button className={classes.navItem} color="inherit"  onClick={()=>history.push('/verify')} >Verify</Button>
          <Button className={classes.navItem} color="inherit"  onClick={()=>history.push('/editor')}>Edit PDF</Button>
          <Button className={classes.navItem} color="inherit"  onClick={()=>history.push('/report')}>Analytics</Button>

          <div className={classes.navItem}>
            <IconButton
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>{Cookies.get('email').toLowerCase()}</MenuItem>
              <MenuItem onClick={handleClose}>{Cookies.get('name')}</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>

            </Menu>
          </div>
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawer}
            className={classes.menuIcon}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer anchor="left" open={sideOpen} onClose={handleDrawer}>
        <div
          role="presentation"
          onClick={handleDrawer}
          onKeyDown={handleDrawer}
        >
          <List className={classes.list}>
            <ListItem button>
              <ListItemIcon>
                <HomeIcon></HomeIcon>
              </ListItemIcon>
              <a className={classes.link} href="/home">
                <ListItemText primary="Home" >
                </ListItemText>
              </a>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <NoteAddIcon></NoteAddIcon>
              </ListItemIcon>
              <a className={classes.link} href="/add/new" >
                <ListItemText primary="Add Document">
                </ListItemText>
              </a>
            </ListItem>
            <ListItem button >
              <ListItemIcon>
                <CalendarTodayIcon></CalendarTodayIcon>
              </ListItemIcon>
              <a className={classes.link} href="/status" >
                <ListItemText primary="Documents" >
                </ListItemText>
              </a>
            </ListItem>
            <ListItem button >
              <ListItemIcon>
                <CalendarTodayIcon></CalendarTodayIcon>
              </ListItemIcon>
              <a className={classes.link}  onClick={()=>history.push('/verify')} >
                <ListItemText primary="Verify" >
                </ListItemText>
              </a>
            </ListItem>
            <ListItem button >
              <ListItemIcon>
                <CalendarTodayIcon></CalendarTodayIcon>
              </ListItemIcon>
              <a className={classes.link} href="/editor" >
                <ListItemText primary="Edit PDF" >
                </ListItemText>
              </a>
            </ListItem>
            <ListItem button >
              <ListItemIcon>
                <CalendarTodayIcon></CalendarTodayIcon>
              </ListItemIcon>
              <a className={classes.link} href="/report" >
                <ListItemText primary="Analytics" >
                </ListItemText>
              </a>
            </ListItem>
            <Divider></Divider>
            <ListItem>
              <ListItemIcon>
                <MailIcon></MailIcon>
              </ListItemIcon>
              <ListItemText primary={Cookies.get('email')}></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccountCircle></AccountCircle>
              </ListItemIcon>
              <ListItemText primary={Cookies.get('name')}></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ExitToApp></ExitToApp>
              </ListItemIcon>
              <ListItemText primary={"Logout"} onClick={logout}></ListItemText>
            </ListItem>
          </List>

        </div>
      </SwipeableDrawer>

    </div>
  );
}
