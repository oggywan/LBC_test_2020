import React from 'react';

import Modal from 'antd-mobile/lib/modal';
import 'antd-mobile/es/modal/style/css.js';

/*
  This component is a modal that allows the user to read their message
*/
function ReadMessageModal({ setMessageKeyToRead, message, isMobile }) {
  const { timestamp, content, isPrivate } = message;
  return (
    <Modal
      style={{ transform: isMobile ? 'scale(2)' : 'unset', width: '45%' }}
      title={
        new Date(timestamp).toLocaleString() +
        (isPrivate ? ' - private message' : '')
      }
      visible={true}
      transparent={true}
      maskClosable={false}
      footer={[
        {
          text: 'Ok',
          // hide the read modal
          onPress: () => setMessageKeyToRead(null),
        },
      ]}
    >
      <p style={{ fontStyle: 'italic' }}>{content}</p>
    </Modal>
  );
}

export default ReadMessageModal;
