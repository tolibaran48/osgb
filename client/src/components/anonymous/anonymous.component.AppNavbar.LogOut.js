import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { ImExit } from "react-icons/im";

const LogOut = ({ closeK, closeM }) => {
  const navigate = useNavigate();
  const { signOut} = useContext(AuthContext);

  const SignOut = () => {
    closeK(false);
    closeM(false);
    signOut();
    navigate("/")
  }

  return (
      <button target="_self" rel=""  onClick={SignOut} className="menu-item-container" role="menuitem" aria-disabled="false">
        <div className="menu-item" >
          <div>
            <ImExit style={{ color: 'ghostwhite', height: '14.77px', width: '16.63px', marginRight: '5px' }}/>
            Çıkış
          </div>
        </div>
      </button>
  )
}

export default LogOut;