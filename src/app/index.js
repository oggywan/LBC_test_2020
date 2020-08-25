import React, { useEffect, useState } from 'react';
import MessagesTable from '../components/messagesTable';
import NewMessage from '../components/createMessageModal';
import DeleteMessageModal from '../components/deleteMessageModal';
import config from '../config';
import firebase from 'firebase';
import Button from 'antd/lib/button';
import Switch from 'antd/lib/switch';

import { LoadingOutlined } from '@ant-design/icons';
import 'antd/es/switch/style/css.js';
import ReadMessageModal from '../components/readMessageModal';

function App() {
  // array of messages, copied from the DB
  const [messages, setMessages] = useState([]);
  // Boolean that toggles the new message modal display
  const [creatingMessage, setIsCreatingMessage] = useState(false);
  // key of the message to be read, if any. Used to display the rading modal
  const [messageKeyToRead, setMessageKeyToRead] = useState(null);
  // key of the message to be deleted, if any. Used to display the deletion modal
  const [messageKeyToDelete, setMessageKeyToDelete] = useState(null);
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

  // add a message to the Firebase DB
  const addMessageToDB = ({ content, isPrivate }) => {
    console.log('addMessageToDB: ', content);
    if (content) {
      const data = {
        private: isPrivate,
        content,
        timestamp: new Date().getTime(),
      };
      database.ref('messages/').push(data);

      // close the modal
      setIsCreatingMessage(false);
    }
  };

  // removes the message whose id is messageKeyToDelete, from the DB
  const deleteMessage = () => {
    database.ref('messages/' + messageKeyToDelete).remove();
    setMessageKeyToDelete('');
  };
  console.log('messages: ', messages);
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
        onClick={addMessageToDB}
      >
        My message app
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
          onClick={() => setIsCreatingMessage(true)}
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
              top: '30%',
            }}
            checked={showAll}
            checkedChildren='hide private'
            unCheckedChildren='show private'
            onChange={() => setShowAll(!showAll)}
          />
          <MessagesTable
            messages={messages
              .filter((msg) => !msg.private || showAll)
              .reverse()}
            setMessageKeyToRead={setMessageKeyToRead}
            setMessageKeyToDelete={setMessageKeyToDelete}
          />
        </>
      )}
      {messageKeyToDelete && (
        <DeleteMessageModal
          deleteMessage={deleteMessage}
          setMessageKeyToDelete={setMessageKeyToDelete}
          content={
            messages.find((msg) => msg.key === messageKeyToDelete).content
          }
        />
      )}
      {creatingMessage && (
        <NewMessage
          addMessageToDB={addMessageToDB}
          setIsCreatingMessage={setIsCreatingMessage}
        />
      )}
      {messageKeyToRead && (
        <ReadMessageModal
          setMessageKeyToRead={setMessageKeyToRead}
          message={messages.find((msg) => msg.key === messageKeyToRead)}
        />
      )}
    </div>
  );
}

export default App;
