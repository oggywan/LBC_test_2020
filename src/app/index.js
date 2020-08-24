import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import config from '../config';
import MessagesTable from '../components/messagesTable';

import { Button } from 'antd';
import NewMessage from '../components/newMessage';

function App() {
  // array of messages, copied from the DB
  const [messages, setMessages] = useState([]);
  // Boolean that toggles the new message modal display
  const [newMessage, setNewMessage] = useState(false);
  // reference to the Firebase DB
  const [database, setDatabase] = useState(null);

  // first connect to the Firebase DB
  try {
    firebase.initializeApp(config);
    setDatabase(firebase.database());
    console.log('database: ', database);
  } catch (err) {
    if (!/already exists/.test(err.message)) {
      console.error('firebase initialization error', err.stack);
    }
  }

  // listen to the DB updates, and update the messages accordingly
  useEffect(() => {
    const rootRef = firebase.database().ref().child('messages');
    rootRef.on('value', (snap) => {
      console.log('hello');
      const dbMessages = snap.val() || {};
      setMessages(
        Object.keys(dbMessages).map((key) => ({
          ...dbMessages[key],
          key,
        }))
      );
    });
  }, []);

  // add a message to the DB
  const addMessage = ({ content, isPrivate }) => {
    console.log('addMessage: ', content);
    if (content) {
      const data = {
        private: isPrivate,
        content,
        timestamp: new Date().getTime(),
      };
      database.ref('messages/').push(data);

      // close the modal
      setNewMessage(false);
    }
  };

  // removes the message from the DB
  const deleteData = (key) => database.ref('messages/' + key).remove();

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
        onClick={addMessage}
      >
        A great title
      </p>
      <div
        style={{
          position: 'absolute',
          width: '20%',
          left: '40%',
          top: '20%',
        }}
      >
        <Button
          type='primary'
          style={{}}
          block
          onClick={() => setNewMessage(true)}
        >
          Add a new message
        </Button>
      </div>

      <MessagesTable messages={messages} deleteData={deleteData} />

      {newMessage && (
        <NewMessage setNewMessage={setNewMessage} addMessage={addMessage} />
      )}
    </div>
  );
}

export default App;
