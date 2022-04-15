import React from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '@the-collab-lab/shopping-list-utils';
import { setUser, getUser } from '../storage-utils/storage-utils';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const NewListButton = () => {
  const onClick = async () => {
    const newUserToken = await getToken();
    setUser(newUserToken); // verified: Correctly sets into localStorage
    console.log('New user token: ', newUserToken);
    const userToken = await getUser();
    console.log('GET USER TOKEN FROM LS: ', userToken); // verified: Correctly gets token from localStorage
    // verified: Correctly creates new collection in database with this new userToken
    await addDoc(collection(db, userToken), {
      item: 'this users new item',
    });
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
