import React, { useState } from 'react';

import Modal from 'antd-mobile/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Checkbox from 'antd/lib/checkbox';

import 'antd/es/form/style/css.js';
import 'antd/es/checkbox/style/css.js';
import 'antd-mobile/es/modal/style/css.js';

const { TextArea } = Input;
const { Item } = Form;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

/*
  This component is a modal that allows the user to enter their new message
*/
function CreateMessageModal({
  setIsCreatingMessage,
  addMessageToDB,
  isMobile,
}) {
  // content of the message
  const [content, setContent] = useState('');
  // Boolean: whether the message is private or no
  const [isPrivate, setIsPrivate] = useState(true);

  return (
    <Modal
      style={{ transform: isMobile ? 'scale(2)' : 'unset' }}
      title='Write a new message'
      visible={true}
      transparent={true}
      maskClosable={false}
      footer={[
        {
          text: 'Cancel',
          // hide the read modal
          onPress: () => setIsCreatingMessage(false),
        },
        {
          text: 'Ok',
          onPress: () => addMessageToDB({ content, isPrivate }),
        },
      ]}
    >
      <Form {...layout}>
        <Item label='Message' rows={4} rules={[{ required: true }]}>
          <TextArea onChange={(e) => setContent(e.target.value)} />
        </Item>
        <Item label='Private'>
          <Checkbox
            onChange={() => setIsPrivate(!isPrivate)}
            checked={isPrivate}
          />
        </Item>
      </Form>
    </Modal>
  );
}

export default CreateMessageModal;
