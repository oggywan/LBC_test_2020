import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import config from '../config';
import MessagesTable from '../components/messagesTable';

import { Button, Switch } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import NewMessage from '../components/newMessage';
import 'antd/es/switch/style/css.js';

function App() {
  // array of messages, copied from the DB
  const [messages, setMessages] = useState([]);
  // Boolean that toggles the new message modal display
  const [newMessage, setNewMessage] = useState(false);
  // reference to the Firebase DB
  const [database, setDatabase] = useState(null);
  // Boolean: show all messages, including private ones
  const [showAll, setShowAll] = useState(false);
  // Boolean: whether the Firebase DB is currently loading
  const [dbLoading, setDbLoading] = useState(true);

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
      setDbLoading(false);
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
  const deleteMessage = (key) => database.ref('messages/' + key).remove();

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

      {dbLoading ? (
        <LoadingOutlined
          style={{
            position: 'absolute',
            left: 'calc(50% - 20px)',
            top: '35%',
            fontSize: '40px',
          }}
        />
      ) : (
        <>
          <Switch
            style={{
              position: 'absolute',
              right: '5%',
              top: '25%',
            }}
            checked={showAll}
            checkedChildren='hide private'
            unCheckedChildren='show private'
            onChange={() => setShowAll(!showAll)}
          />
          <MessagesTable
            messages={messages.filter((msg) => !msg.private || showAll)}
            deleteMessage={deleteMessage}
          />
        </>
      )}
      {newMessage && (
        <NewMessage setNewMessage={setNewMessage} addMessage={addMessage} />
      )}
    </div>
  );
}

export default App;
