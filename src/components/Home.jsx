import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getToken,
  words,
  calculateEstimate,
} from '@the-collab-lab/shopping-list-utils';
import { setUser } from '../storage-utils/storage-utils.js';
import AddItem from './AddItem.jsx';

export default function Home() {
  const navigate = useNavigate();
  let userToken = getToken();

  // useEffect(
  //   () => {
  //     // if condition: if local storage is empty, set the user token into local storage w/ setUser(userToken) call.

  //   },
  //   [],
  // );

  // Notes: (04/14/22) -->
  // Utilize AddItem component to create new collection in FireStore db for that specific user.

  const handleOnClick = useCallback(
    () => navigate('./List', { replace: true }),
    [navigate],
    // Calling setUser utility function and storing user token > implement in useEffect above?
    setUser(userToken),
    // calls addItem functional component and passes in userToken
    AddItem(userToken),
  );

  return (
    <>
      <div>
        <h1>Welcome To Your Smart Shopping List!</h1>
      </div>

      <button onClick={handleOnClick}>Create a new list</button>
    </>
  );
}
