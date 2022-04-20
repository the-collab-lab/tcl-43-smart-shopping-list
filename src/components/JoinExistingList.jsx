import { db } from '../lib/firebase';
import { collection, onSnapshot } from '@firebase/firestore';
import { useState, useEffect } from 'react';
import { setUser } from '../storage-utils/storage-utils';
import { useNavigate } from 'react-router-dom';

export default function JoinExistingList() {
  const [userToken, setUserToken] = useState('');
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  // get the collection when userToken changes
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

  return (
    <div>
      <p>Join an existing list by entering a three word token below.</p>

      <form
        onSubmit={() => {
          docs.length > 0
            ? navigate('list')
            : alert(
                'That list does not exist. Please try again or create a new list.',
              );
          setUser(userToken);
        }}
      >
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
