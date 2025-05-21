import React, {memo } from 'react';
import { useLocation} from 'react-router-dom';
import CariList from './cariList';
import './detailPage.scss';

const DetailPage = () => {

  const { state:{prop} } = useLocation();
  return (
    <div className='concubine-container'>
      <div className='list-alt concubineTable'>
        <CariList concubine={prop} />
      </div>
    </div>

  )
}

export default memo(DetailPage);