import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import config from '../config';
import MessagesTable from '../components/messagesTable';

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
      updateMessages(snap.val());
    });
  }, []);

  useEffect(() => {
    console.log('start: ', config);
    const getUserData = () => {
      database
        .ref('messages/')
        .once('value')
        .then((snapshot) => {
          updateMessages(snapshot.val());
        });
      console.log('DATA RETRIEVED');
    };
    getUserData();
  }, [setMessages]);

  const updateMessages = (val) => {
    console.log('updateMessages: ', val);
    const msgs = [];
    if (val) {
      Object.keys(val).forEach(function (key) {
        console.log(key, val[key]);
        msgs.push({ ...val[key], key });
      });
    }
    setMessages(msgs);
  };

  const addData = () => {
    console.log('addData: ', database);
    const data = {
      title: 'title-test-' + Math.random(),
      private: Math.random() < 0.5,
      content:
        'content-test-content-test-content-test-content-test-content-test',
      username: 'nonono',
      timestamp: new Date().getTime(),
    };

    database.ref('messages/').push(data);
  };

  const deleteData = (key) => {
    console.log('deleteData: ', key);
    database.ref('messages/' + key).remove();
  };

  return (
    <div>
      <p
        style={{
          position: 'absolute',
          width: '100%',
          height: '10%',
          textAlign: 'center',
          lineHeight: '3em',
          fontSize: '3em',
          fontFamily: 'Playfair Display',
        }}
        onClick={addData}
      >
        A great title
      </p>
      <MessagesTable messages={messages} deleteData={deleteData} />
    </div>
  );
}

export default App;
