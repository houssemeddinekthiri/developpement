import React, { useState } from 'react';


const Modal = ({props, open, onClose , content , applyToAllPages , inputValue, load, }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  if (!open) return null;

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleApplyClick = () => {
    console.log(content)

      applyToAllPages(content);

   onClose();
  };
  return (
    <div onClick={onClose} className='overlay'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <div className='modalRight'>
          <button className='closeBtn' style={{backgroundColor:"transparent" , border:"transparent"}} onClick={onClose}>
            X
          </button>
          <div className='content'>
            <h1>Ajouter Nom du l'entreprise</h1>

            <input type='text'  placeholder="Ajouter nom d'entreprise"/>
          </div>
          <div className='btnContainer'>
            <button className='btnPrimary' onClick={load}>
              <span className='bold'>Appliquer</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
