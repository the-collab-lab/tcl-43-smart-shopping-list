import { db } from '../../lib/firebase';
import { collection, onSnapshot } from '@firebase/firestore';
import { useState, useEffect } from 'react';
import { setUser } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import './JoinExistingList.css';

export default function JoinExistingList() {
  const [userToken, setUserToken] = useState('');
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  // get the collection when userToken changes
  useEffect(() => {
    if (userToken && userToken.split(' ').length === 3) {
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
    <div className="join-container">
      <p className="join-p">
        Join an existing list by entering a three word token below.
      </p>
      <form
        onSubmit={() => {
          if (docs.length > 0) {
            setUser(userToken);
            navigate('list');
          } else {
            alert(
              'That list does not exist. Please try again or create a new list.',
            );
          }
        }}
      >
        {/* <label htmlFor=“user token”>Share Token</label> */}
        <input
          placeholder=" Enter Token..."
          className="search-input join-input"
          type="text"
          id="user token"
          onChange={(e) => setUserToken(e.target.value)}
          value={userToken}
        />
        <button className="join-btn">Join An Existing List</button>
      </form>
    </div>
  );
}
