import React, { useEffect, useState, useCallback } from 'react';
import firebase from 'firebase';
import config from '../config';

function App() {
  const [messages, setMessages] = useState([]);
  const [database, setDatabase] = useState(null);
  try {
    firebase.initializeApp(config);
    setDatabase(firebase.database());
    console.log('database: ', database);
  } catch (err) {
    if (!/already exists/.test(err.message)) {
      console.error('firebase initialization error', err.stack);
    }
  }

  useEffect(() => {
    const rootRef = firebase.database().ref().child('messages');
    rootRef.on('value', (snap) => {
      console.log('update!!!: ', snap);
      updateValues(snap.val());
    });
  }, []);

  useEffect(() => {
    console.log('start: ', config);
    const getUserData = () => {
      database
        .ref('messages/')
        .once('value')
        .then((snapshot) => {
          updateValues(snapshot.val());
        });
      console.log('DATA RETRIEVED');
    };
    getUserData();
  }, [setMessages]);

  const updateValues = (val) => {
    console.log('updateValues: ', val);
    const msgs = [];
    Object.keys(val).forEach(function (key) {
      console.log(key, val[key]);
      msgs.push(val[key]);
    });
    setMessages(msgs);
  };

  const addData = useCallback(() => {
    console.log('addData: ', database);
    const data = {
      title: 'title-test-' + Math.random(),
      private: true,
      content: 'content-test',
      username: 'nonono',
    };

    database.ref('messages/').push(data);
  });

  return (
    <div>
      Hello world!
      <div
        style={{ width: '333px', height: '333px', backgroundColor: 'green' }}
        onClick={addData}
      />
      {messages.map((msg, i) => (
        <p key={i}>{msg.title}</p>
      ))}
      {'///////////'}
    </div>
  );
}

export default App;
