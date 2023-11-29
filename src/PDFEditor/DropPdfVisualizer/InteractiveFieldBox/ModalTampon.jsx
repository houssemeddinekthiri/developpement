import React, { useState ,useRef } from 'react';
import nft from './nft.jpg';

const ModalTampon = ({ open, onClose , selectedFieldData , inputValue , setContent }) => {
  const [selectedOption, setSelectedOption] = useState(null);



  const inputRef = useRef();
  const [files, setFiles] = useState(null);
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleImageSelection(event.dataTransfer.files[0])
  };
  const [uploadedImage, setUploadedImage] = useState(null); // State to store the uploaded image


  // send files to the server // learn from my other video
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };

    reader.readAsDataURL(file);
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  const handleImageSelection = (imageFile) => {
    setSelectedImage(imageFile);
  };
  const handleImageApply = () => {
    if (selectedImage) {
      const imageSource = URL.createObjectURL(selectedImage);
      setContent(`<img src="${imageSource}" alt="Tampon" style="max-width: 100px; maw-height:50px" />`);
      setSelectedImage(null); 
      setImage(imageSource)
      onClose()
    }
  };

  if (!open) return null;
  return (
    <div onClick={onClose} className='overlay'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainerr'
      >
        <div className='modalRight'>

          <div className='content'>

            <div
            className="dropzone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
          <h3>Drag and Drop Files to Upload</h3>
          <h1>Or</h1>
          <input
            type="file"
            multiple

            hidden
            accept="image/png, image/jpeg"
            onChange={(event) => handleImageSelection(event.target.files[0])}
            ref={inputRef}

          />

          <button onClick={() => inputRef.current.click()}>Select Files</button>
          <br/>
          <img src={image}   style={{width:'100px' , height:'80px'}}/><br/>
        </div>
          </div>
          <div className='btnContainer'>
            <button className='btnPrimary' onClick={handleImageApply} >
              <span className='bold'>Appliquer</span>
            </button>
            <button className='btnOutline' onClick={onClose}  >
              <span className='bold'>Annuler</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTampon;
