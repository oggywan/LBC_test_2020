import React from 'react';

import Modal from 'antd-mobile/lib/modal';
import 'antd-mobile/es/modal/style/css.js';

/*
  This component is a modal that allows the user to enter their message
*/
const DeleteMessageModal = ({
  deleteMessage,
  setMessageKeyToDelete,
  content,
  isMobile,
}) => (
  <Modal
    style={{ transform: isMobile ? 'scale(2)' : 'unset', width: '45%' }}
    title='Warning'
    visible={true}
    transparent={true}
    maskClosable={false}
    footer={[
      {
        text: 'Cancel',
        // hide the deletion modal
        onPress: () => setMessageKeyToDelete(null),
      },
      {
        text: 'Ok',
        onPress: deleteMessage,
      },
    ]}
  >
    <p>You are about to delete the below message:</p>
    <p style={{ borderBottom: '1px solid black' }}>{'    '}</p>
    <p style={{ fontStyle: 'italic' }}>{content}</p>
    <p style={{ borderBottom: '1px solid black' }}>{'    '}</p>
    <p>Are you sure?</p>
  </Modal>
);

export default DeleteMessageModal;
