import React from 'react';

import Modal from 'antd/lib/modal';
import Button from 'antd/lib/modal';

import 'antd/es/modal/style/css.js';
import 'antd/es/button/style/css.js';

/*
  This component is a modal that allows the user to read their message
*/
function ReadMessageModal({ setMessageKeyToRead, message }) {
  const { timestamp, content } = message;
  return (
    <Modal
      title={
        new Date(timestamp).toLocaleString() +
        (message.private ? ' - private message' : '')
      }
      // hide the read modal
      onCancel={(_) => setMessageKeyToRead(null)}
      visible={true}
      footer={null}
    >
      <p style={{ fontStyle: 'italic' }}>{content}</p>
    </Modal>
  );
}

export default ReadMessageModal;
