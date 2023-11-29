import React, { useRef, useEffect, useState, useContext } from 'react'
import { Rnd } from "react-rnd";
import signature from './sig.png';
import Popover from '@material-ui/core/Popover';
import { ClickAwayListener, Menu, MenuItem, Paper, Popper, TextareaAutosize, Typography } from '@material-ui/core';
import DeleteOutlined from '@material-ui/icons/DeleteOutline';
import Delete from '@material-ui/icons/Delete';
import SignatureContext from './SignatureContext';
import CONSTS from './constants';
import useLongPress from './useLongPress';

const DraggableImage = props => {
  const imgRef = useRef(null);
  const [state, _setState] = useState({
    x: 0,
    y: 0,
    imagewidth: 0,
    imageheight: 0
  });
  const RndRef = useRef(null);
  const [open, setOpen] = useState(true);
  const [isRndActive, setIsRndActive] = useState(true);
  const setState = (data) => {
    _setState({ ...state, ...data });
  }

  useEffect(() => {
    let image = props.image;

    setState(image);
  }, [props]);

  useEffect(() => {
    props.imageChange(props.id, state);
  }, [state]);

  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);

  const handleMenu = (event) => {
    event.preventDefault();
    setMouseX(event.clientX - 2)
    setMouseY(event.clientY - 2)
  };

  const handleClose = () => {
    setMouseX(null);
    setMouseY(null);
  };

  const signatureContext = useContext(SignatureContext);


  const handleClickAway = () => {
    setIsRndActive(false);
  };


  const handleImageClick = () => {
    setIsRndActive(true);
  };

  return (
    <React.Fragment>

      <ClickAwayListener onClickAway={handleClickAway}>
        <Rnd
          size={{ width: state.imagewidth + 2, height: state.imageheight + 2 }}
          style={{ border: isRndActive ? '1px solid black ' : 'none' }}
          position={{ x: state.x, y: state.y }}
          bounds={".__page" + props.pageNum}
          onDragStop={(e, d) => {
            setState({ x: d.x, y: d.y });
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setState({
              x: position.x,
              y: position.y,
              imagewidth: state.imagewidth + delta.width,
              imageheight: state.imageheight + delta.height
            });
          }}

          enableResizing={isRndActive}
          enableDragging={isRndActive}
        >
          <img
            onContextMenu={handleMenu}
            onClick={handleImageClick}
            ref={imgRef}
            width={state.imagewidth}
            height={state.imageheight}
            draggable="false"
            src={signatureContext.defaultSignature == 0 ? signatureContext.signature : signatureContext.imageSignature}
          ></img>
          <Menu
            keepMounted
            open={mouseY !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              mouseY !== null && mouseX !== null
                ? { top: mouseY, left: mouseX }
                : undefined
            }
          >
            <MenuItem onClick={() => { handleClose(); props.imageDelete(props.id) }} ><DeleteOutlined></DeleteOutlined></MenuItem>
          </Menu>
        </Rnd>
      </ClickAwayListener>
    </React.Fragment>
  )
}

export default DraggableImage
