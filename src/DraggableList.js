import React, { Component } from "react";
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    ListItemSecondaryAction,
    Avatar
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Delete } from "@material-ui/icons";
const moment = require('moment');


const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle,
    ...(isDragging && {
        background: "rgb(235,235,235)"
    })
});


export default class DraggableList extends Component {
    state = {
        items: []
    }
    componentDidMount() {
        this.setState({ items: this.props.signers })
        console.log(this.props.signers);
    }
    componentDidUpdate() {
        if (this.props.signers != this.state.items)
            this.setState({ items: this.props.signers })
    }

    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.setState({
            items
        });
        this.props.handleSwap(items);
    }
    handleDelete = (email) => {
        this.props.handleDelete(email)
    }
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <RootRef rootRef={provided.innerRef}>
                            <List >
                                {this.state.items.map((item, index) => (
                                    <Draggable key={item.email} draggableId={item.email} index={index}>
                                        {(provided, snapshot) => (
                                            <ListItem
                                                ContainerComponent="li"
                                                ContainerProps={{ ref: provided.innerRef }}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                <ListItemIcon>
                                                    <Avatar alt={item.name} src={item.image} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.email}
                                                    secondary={"Expiry :" + moment(item.deadline).format('YYYY-MM-DD HH:mm')}
                                                />
                                                <ListItemSecondaryAction hidden={snapshot.isDragging}>

                                                    <IconButton onClick={() => { this.handleDelete(item.email) }}>
                                                        <Delete />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </List>
                        </RootRef>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}
