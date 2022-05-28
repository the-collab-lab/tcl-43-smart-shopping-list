import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getUser } from '../../utils/utils';
import Nav from '../Nav/Nav';
import { useNavigate } from 'react-router-dom';
import ListItem from '../ListItem/ListItem';
import { daysUntilNextPurchase, isActive } from '../../utils/utils';
import './List.css';

export default function List() {
  //states:
  const [docs, setDocs] = useState([]);
  const [userToken] = useState(getUser());
  const navigate = useNavigate();
  const [searchInputValue, setSearchInputValue] = useState('');

  const sortList = (docs) => {
    docs.sort(function (a, b) {
      if ((isActive(a) && isActive(b)) || (!isActive(a) && !isActive(b))) {
        return daysUntilNextPurchase(a) - daysUntilNextPurchase(b);
      }

      if (isActive(a)) {
        return -1;
      }
      return 1;
    });
    return docs;
  };

  useEffect(() => {
    const listRef = collection(db, userToken);
    const q = query(listRef, orderBy('item'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let snapshotDocs = [];

      snapshot.forEach((doc) => snapshotDocs.push(doc));
      setDocs(sortList(snapshotDocs));
    });
    return () => {
      unsubscribe();
    };
  }, [userToken]);

  return (
    <div className="list-container">
      <h1>Shopping List</h1>
      {docs.length > 0 ? (
        <div>
          <input
            className="search-input search-style"
            type="text"
            placeholder="Search..."
            value={searchInputValue}
            onChange={(e) => {
              setSearchInputValue(e.target.value);
            }}
          />

          <button
            className="reset-button"
            onClick={() => setSearchInputValue(() => '')}
          >
            Clear Search
          </button>

          <ul>
            {docs
              .filter((item) => {
                return item
                  .data()
                  .item.toLowerCase()
                  .includes(searchInputValue.toLowerCase());
              })

              .map((item, index) => {
                return <ListItem item={item} index={index} />;
              })}
          </ul>
        </div>
      ) : (
        <div>
          <p>Your shopping list is currently empty</p>
          <button
            onClick={() => {
              navigate('/addItem');
            }}
          >
            Add Item
          </button>
        </div>
      )}
      <Nav />
    </div>
  );
}
