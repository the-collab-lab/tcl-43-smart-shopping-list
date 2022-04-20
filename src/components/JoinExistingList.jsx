import { db } from '../lib/firebase';
import { collection, onSnapshot } from '@firebase/firestore';
import { useState, useEffect } from 'react';
import { setUser } from '../storage-utils/storage-utils';
import { Navigate } from 'react-router-dom';

export default function JoinExistingList() {
  const [userToken, setUserToken] = useState('');
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (userToken !== '') {
      const unsubscribe = onSnapshot(collection(db, userToken), (snapshot) => {
        let snapshotDocs = [];
        snapshot.forEach((doc) => snapshotDocs.push(doc));
        setDocs(snapshotDocs);
      });
      return () => {
        unsubscribe();
      };
    }
  }, [userToken]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('User Token', userToken);
    setUser(userToken);
    // console.log(docs.length)

    if (docs.length === 0) {
      alert('THIS LIST DOES NOT EXIST!');
    } else {
      alert('this list DOES exist');
      // needs to navigate back to existing list
      return <Navigate to="/list" />;
    }
    // save to local storage (does local storage need to be emptied first?)
    // get input token and set to setUser
    // check if collection exists - if does - then navigate to list and display list
    // else - display error message e.g: "That list does not exist, etc... "
  };

  return (
    <div>
      <p>Join an existing list by entering a three word token below.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="user token">Share Token</label>
        <input
          type="text"
          id="user token"
          onChange={(e) => setUserToken(e.target.value)}
          value={userToken}
        />
        <button>join an existing list</button>
      </form>
    </div>
  );
}
