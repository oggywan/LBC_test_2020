import React from 'react';

import Modal from 'antd/lib/modal';

import 'antd/es/form/style/css.js';
import 'antd/es/input/style/css.js';
import 'antd/es/checkbox/style/css.js';
import 'antd/es/modal/style/css.js';

/*
  This component is a modal that allows the user to enter their message
*/
function DeleteMessageModal({ deleteMessage, setMessageKeyToDelete, content }) {
  return (
    <Modal
      title='Warning'
      visible={true}
      onOk={deleteMessage}
      // hide the deletion modal
      onCancel={(_) => setMessageKeyToDelete(null)}
    >
      <p>You are about to delete the below message:</p>
      <p style={{ fontStyle: 'italic' }}>{content}</p>
      <p>Are you sure?</p>
    </Modal>
  );
}

export default DeleteMessageModal;
