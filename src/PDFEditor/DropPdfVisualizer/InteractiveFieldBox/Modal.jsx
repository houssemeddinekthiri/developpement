import React, { useState } from 'react';
import nft from './nft.jpg';

const Modal = ({ open, onClose , content , applyToAllPages , inputValue }) => {
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
            <h1>Placer sur</h1>
            <label>
              <input
                type='radio'
                checked={selectedOption === 'all'}
                onChange={() => handleOptionChange('all')}
              />
              Toutes les pages
            </label>
            <label>
              <input
                type='radio'
                checked={selectedOption === 'allExceptLast'}
                onChange={() => handleOptionChange('allExceptLast')}
              />
              Toutes les pages exceptée la dernière
            </label>
            <label>
              <input
                type='radio'
                checked={selectedOption === 'last'}
                onChange={() => handleOptionChange('last')}
              />
              Dernière page
            </label>
          </div>
          <div className='btnContainer'>
            <button className='btnPrimary' onClick={() => handleApplyClick()}>
              <span className='bold'>Appliquer</span>
            </button>
            <button className='btnOutline'>
              <span className='bold'>Annuler</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
