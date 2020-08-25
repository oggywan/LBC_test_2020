import React, { useEffect, useState } from 'react';
import MessagesTable from '../components/messagesTable';
import CreateMessageModal from '../components/createMessageModal';
import DeleteMessageModal from '../components/deleteMessageModal';
import config from '../config';
import firebase from 'firebase';
import Button from 'antd/lib/button';
import Switch from 'antd/lib/switch';
import { LoadingOutlined } from '@ant-design/icons';
import 'antd-mobile/es/switch/style/css.js';
import ReadMessageModal from '../components/readMessageModal';
import './App.less';

const MOBILE_MAX_WIDTH = 600;

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
  // Boolean: whether the user is on a mobile device
  const [isMobile, setIsMobile] = useState(false);
  // height of the display window
  const [windowHeight, setWindowHeight] = useState(120);

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

  // set the window height, detect if user is on mobile, and listen to any window resize
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    setIsMobile(screen.width < MOBILE_MAX_WIDTH);
    window.addEventListener('resize', () =>
      setWindowHeight(window.innerHeight)
    );
    return () =>
      window.removeEventListener('resize', () =>
        setWindowHeight(window.innerHeight)
      );
  }, [setWindowHeight, setIsMobile]);

  // add a message to the Firebase DB
  const addMessageToDB = ({ content, isPrivate }) => {
    console.log('addMessageToDB: ', content);
    if (content) {
      const data = {
        isPrivate,
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
          lineHeight: isMobile ? '4em' : '3em',
          fontSize: isMobile ? '6em' : '3em',
          fontFamily: 'Playfair Display',
        }}
        onClick={addMessageToDB}
      >
        My message app
      </p>
      <div
        style={{
          position: 'absolute',
          width: isMobile ? '50%' : '20%',
          left: isMobile ? '25%' : '40%',
          top: '20%',
        }}
      >
        <Button
          type='primary'
          style={{
            fontSize: isMobile ? '3em' : '1em',
            height: '10%',
          }}
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
          <div
            style={{
              position: 'absolute',
              right: '5%',
              top: '30%',
              transform: isMobile ? 'scale(2)' : 'unset',
              transformOrigin: '100% 50%',
            }}
          >
            <Switch
              checked={showAll}
              checkedChildren='hide private'
              unCheckedChildren='show private'
              onChange={() => setShowAll(!showAll)}
            />
          </div>
          <MessagesTable
            messages={messages
              .filter((msg) => !msg.isPrivate || showAll)
              .reverse()}
            setMessageKeyToRead={setMessageKeyToRead}
            setMessageKeyToDelete={setMessageKeyToDelete}
            windowHeight={windowHeight}
            isMobile={isMobile}
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
          isMobile={isMobile}
        />
      )}
      {creatingMessage && (
        <CreateMessageModal
          addMessageToDB={addMessageToDB}
          setIsCreatingMessage={setIsCreatingMessage}
          isMobile={isMobile}
        />
      )}
      {messageKeyToRead && (
        <ReadMessageModal
          setMessageKeyToRead={setMessageKeyToRead}
          message={messages.find((msg) => msg.key === messageKeyToRead)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}

export default App;
