import { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { setUser, getUser } from '../utils/utils';

const NewListButton = () => {
  const [userToken, setUserToken] = useState(getUser());

  const onClick = async () => {
    if (userToken === null) {
      const newUserToken = generateToken(); // if null generate new token
      setUser(newUserToken); // set into ls
      setUserToken(getUser()); // updating state with getUser token
    }
  };

  return (
    <Link to="/List" onClick={onClick}>
      <button type="button" className="NewList-button">
        create a new list
      </button>
    </Link>
  );
};

export default NewListButton;
