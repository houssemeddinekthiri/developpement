import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import { grey } from '@material-ui/core/colors';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ErrorIcon from '@material-ui/icons/Error';
import AccountBoxOutlinedIcon from '@material-ui/icons/AccountBoxOutlined';
import QueryBuilderOutlinedIcon from '@material-ui/icons/QueryBuilderOutlined';
import DraftsIcon from '@material-ui/icons/Drafts';
const useStyles = makeStyles((theme) => ({

    root: {
        width: '100%',
        height: "89vh",
        backgroundColor: grey[50],
    },
    active:{
        backgroundColor: grey[90],
    }
}));



export default function SideBar(props) {
    const classes = useStyles();
    const handleClick = (event) => {
        props.setStatus(event.currentTarget.id);
    }

    return (
        <div className={classes.root}>
            <List component="nav">
                <ListItem selected={props.status==="ALL_DOCUMENTS"} button id="ALL_DOCUMENTS" onClick={handleClick}>
                    <ListItemIcon>
                        <AllInboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="All Documents" />
                </ListItem>
                <ListItem selected={props.status==="MY_DOCUMENTS"} button id="MY_DOCUMENTS" onClick={handleClick}>
                    <ListItemIcon>
                        <AccountBoxOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Documents" />
                </ListItem>
                <ListItem selected={props.status==="DRAFTS"} button id="DRAFTS" onClick={handleClick}>
                    <ListItemIcon>
                        <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Drafts" />
                </ListItem>
                <ListItem selected={props.status==="ACTION_REQUIRED"} button id="ACTION_REQUIRED" onClick={handleClick}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Action Required" />
                </ListItem>

                <ListItem selected={props.status==="WAITING_FOR_OTHERS"} button id="WAITING_FOR_OTHERS" onClick={handleClick}>
                    <ListItemIcon>
                        <QueryBuilderOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Waiting for others" />
                </ListItem>
                <ListItem selected={props.status==="EXPIRING_SOON"} button id="EXPIRING_SOON" onClick={handleClick}>
                    <ListItemIcon>
                        <AccessAlarmIcon />
                    </ListItemIcon>
                    <ListItemText primary="Expiring Soon" />
                </ListItem>
                <ListItem selected={props.status==="COMPLETED"} button id="COMPLETED" onClick={handleClick}>
                    <ListItemIcon>
                        <AssignmentTurnedInIcon />
                    </ListItemIcon>
                    <ListItemText primary="Completed" />
                </ListItem>
                <ListItem selected={props.status==="FAILED"} button id="FAILED" onClick={handleClick}>
                    <ListItemIcon>
                        <ErrorIcon />
                    </ListItemIcon>
                    <ListItemText primary="Failed" />
                </ListItem>
            </List>

        </div>
    );
}
