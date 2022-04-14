import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getToken,
  words,
  calculateEstimate,
} from '@the-collab-lab/shopping-list-utils';
import { setUser } from '../storage-utils/storage-utils.js';

export default function Home() {
  const navigate = useNavigate();

  // Notes: (04/14/22) -->
  // Utilize AddItem component to create new collection in FireStore db for that specific user.
  // Needs to navigate directly to URL with a query that is specifically for that user, e.g: "/users/:id"
  // App.js Route navigation must change to include new user "/users/:id" route.

  // This handleOnClick will need revising -->
  // Possibly utilize a use useEffect hook.
  // Currently runs setUser(getToken()) on initial page load.
  const handleOnClick = useCallback(
    () => navigate('./List', { replace: true }),
    [navigate],
    setUser(getToken()),
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
