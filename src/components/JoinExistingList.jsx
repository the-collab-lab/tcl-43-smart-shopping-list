import React from 'react';

export default function JoinExistingList() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('from submit handler');
  };
  return (
    <div>
      <p>Join an existing list by entereing a three word token below.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="user token">Share Token</label>
        <input type="text" id="user token" />
        <button>join an existing list</button>
      </form>
    </div>
  );
}
