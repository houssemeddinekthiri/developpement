import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import DescriptionIcon from '@material-ui/icons/Description';
const useStyles = makeStyles((theme) => ({

    root: {
        backgroundColor: theme.palette.background.paper,
    },
    List: {
        width: '100%',
        position: 'relative',
        overflow: 'auto',
        maxHeight: "86vh"
    },
    Avatar: {
        backgroundColor: '#2a2a72',
        backgroundImage: 'linear-gradient(315deg, #2a2a72 0%, #009ffd 74%)'
    },
    text: {
        fontFamily: 'poppins'
    }
}));



export default function Files(props) {
    const classes = useStyles();
    const [dense, setDense] = React.useState(false);

    const generate = props.documents.map((doc) => {
        return (
            <React.Fragment>

                <ListItem key={doc._id} id={doc._id} onClick={props.handleSelect}>
                    <ListItemAvatar >
                        <Avatar className={classes.Avatar}>
                            <DescriptionIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText className={classes.text}
                        primary={doc.name}
                        secondary={doc.owner}
                    />
                </ListItem>
                <Divider />
            </React.Fragment>
        );
    });


    return (
        <div className={classes.root}>
            <List component="div" className={classes.List} dense={dense} >
                {generate}
            </List>
        </div>
    );
}
