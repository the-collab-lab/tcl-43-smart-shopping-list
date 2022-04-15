import React from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '@the-collab-lab/shopping-list-utils';
import { setUser } from '../storage-utils/storage-utils';
import AddItem from './AddItem'; // Used to pass newToken as prop into AddItem functional component.

const NewListButton = (props) => {
  const onClick = (e) => {
    const newUserToken = getToken();
    setUser(newUserToken); // verified: Correctly sets into localStorage
    console.log('New user token: ', newUserToken);
    AddItem(newUserToken); // verified: Correctly passing newToken to AddItem component..
  };
  return (
    <Link to="/List" onClick={onClick}>
      <button node="button" className="NewList-button">
        create a new list
      </button>
    </Link>
  );
};

export default NewListButton;
