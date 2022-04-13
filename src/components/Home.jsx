import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import List from './List'

export default function Home() {
  // console.log('has this been clicked?')
  const navigate = useNavigate();
  const handleOnClick = useCallback(
    () => navigate('./List', { replace: true }),
    [navigate],
  );

  return (
    <>
      <div>
        <h1>Hello this is the home page</h1>
      </div>

      <button onClick={handleOnClick}>Click me to redirect to List view</button>
    </>
  );
}
